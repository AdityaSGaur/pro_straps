"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/stores/cart-store";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LocationIcon,
  CreditCardIcon,
  PackageIcon,
  TagIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@/lib/icons";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

interface AddressForm {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const STEPS = [
  { id: "shipping", label: "shipping", icon: LocationIcon },
  { id: "payment", label: "payment", icon: CreditCardIcon },
  { id: "review", label: "review", icon: PackageIcon },
] as const;

type StepId = (typeof STEPS)[number]["id"];

// We need a CreditCardIcon — let me add a simple one via makeBrandIcon-style
// Actually let's just use the existing icons

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCartStore();

  const [step, setStep] = useState<StepId>("shipping");
  const [loading, setLoading] = useState(false);

  // Shipping
  const [address, setAddress] = useState<AddressForm>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

  // Pre-fill address from session and fetch saved addresses
  useEffect(() => {
    if (session?.user) {
      setAddress((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }));

      // Fetch saved addresses from DB
      fetch("/api/account/addresses")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            const def = data.find((a: any) => a.isDefault) || data[0];
            if (def) {
              setSelectedAddressId(def.id);
              setAddress((prev) => ({
                ...prev,
                phone: def.phone || prev.phone || "",
                street: def.street || "",
                city: def.city || "",
                state: def.state || "",
                postalCode: def.postalCode || "",
              }));
            }
          }
        })
        .catch((err) => console.error("Failed to load saved addresses:", err));
    }
  }, [session]);
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const cartSubtotal = subtotal();
  const shipping = cartSubtotal > 999 ? 0 : 99;
  const taxableAmount = cartSubtotal - couponDiscount;
  const tax = Math.round(Math.max(0, taxableAmount) * 0.18);
  const total = Math.max(0, cartSubtotal - couponDiscount + shipping + tax);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function validateAddress(): boolean {
    const errs: Partial<Record<keyof AddressForm, string>> = {};
    if (!address.name.trim()) errs.name = "Required";
    if (!address.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email))
      errs.email = "Invalid email";
    if (!address.phone.trim()) errs.phone = "Required";
    if (!address.street.trim()) errs.street = "Required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    if (!address.postalCode.trim()) errs.postalCode = "Required";
    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === "shipping") {
      if (!validateAddress()) return;
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    }
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          orderValue: cartSubtotal,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discount);
        setCouponMessage(data.message);
        setCouponValid(true);
        toast.success(data.message);
      } else {
        setCouponDiscount(0);
        setCouponMessage(data.message);
        setCouponValid(false);
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to validate coupon");
    }
    setCouponLoading(false);
  }

  // Shared order data builder
  const buildOrderData = useCallback(() => ({
    items,
    shippingAddress: address,
    paymentMethod,
    couponCode: couponValid ? couponCode.toUpperCase() : undefined,
    userId: (session?.user as { id?: string })?.id || null,
    subtotal: cartSubtotal,
    discount: couponDiscount,
    tax,
    shipping,
    total,
    couponId: undefined,
  }), [items, address, paymentMethod, couponValid, couponCode, session, cartSubtotal, couponDiscount, tax, shipping, total]);

  // COD order — uses the existing /api/orders endpoint
  async function placeCodOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          paymentMethod: "COD",
          couponCode: couponValid ? couponCode.toUpperCase() : undefined,
          userId: (session?.user as { id?: string })?.id || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(
          `/order-confirmation?orderNumber=${data.orderNumber}&total=${total}`
        );
      } else {
        toast.error(data.error || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  }

  // Razorpay online payment flow
  async function handleRazorpayPayment() {
    if (!razorpayReady || typeof window === "undefined" || !(window as unknown as { Razorpay: unknown }).Razorpay) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create a Razorpay order on the server (amount is in paise)
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `PS-${Date.now()}`,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.error || "Failed to create payment order");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const RazorpayClass = (window as unknown as { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      const rzp = new RazorpayClass({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Pro Straps",
        description: "Watch strap purchase",
        order_id: orderData.order_id,
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: "#C8FF00",
        },
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // 3. Verify payment and create order
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: buildOrderData(),
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              clearCart();
              toast.success("Payment successful! Order confirmed.");
              router.push(
                `/order-confirmation?orderNumber=${verifyData.orderNumber}&total=${total}`
              );
            } else {
              toast.error(verifyData.error || "Payment verification failed");
            }
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      });

      rzp.open();
    } catch {
      toast.error("Something went wrong starting payment");
      setLoading(false);
    }
  }

  // Dispatch to correct payment handler
  async function placeOrder() {
    if (paymentMethod === "cod") {
      await placeCodOrder();
    } else {
      await handleRazorpayPayment();
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBagIcon size={32} className="text-muted-foreground" />
        </div>
        <h1 className="heading text-2xl font-bold text-foreground mb-2">
          nothing to checkout
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Your cart is empty. Add some straps first.
        </p>
        <a href="/shop">
          <Button className="rounded-full h-11 px-8 font-semibold text-sm">
            shop now
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:py-12">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
          checkout
        </h1>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 sm:gap-4 mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = STEPS.findIndex((st) => st.id === step) > i;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => {
                    if (isDone || i <= stepIndex) setStep(s.id);
                  }}
                  className="flex items-center gap-2 sm:gap-3 group"
                >
                  <div
                    className={`flex items-center justify-center size-8 sm:size-10 rounded-full border-2 transition-colors shrink-0 ${
                      isActive
                        ? "border-lime bg-lime/10 text-foreground"
                        : isDone
                          ? "border-lime bg-lime text-black"
                          : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircleIcon size={16} />
                    ) : (
                      <Icon size={16} />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium hidden sm:block ${
                      isActive
                        ? "text-foreground"
                        : isDone
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 sm:mx-4 ${
                      isDone ? "bg-lime" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-3">
            {/* Step 1: Shipping */}
            {step === "shipping" && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 animate-fade-in-up">
                <h2 className="heading text-lg font-bold text-foreground">
                  shipping address
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Select saved address
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setAddress((prev) => ({
                                ...prev,
                                phone: addr.phone || prev.phone || "",
                                street: addr.street || "",
                                city: addr.city || "",
                                state: addr.state || "",
                                postalCode: addr.postalCode || "",
                              }));
                            }}
                            className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#CCFF00] bg-[#CCFF00]/5"
                                : "border-border/60 hover:border-border bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-foreground capitalize">
                                {addr.label || "Saved Address"}
                              </span>
                              {isSelected && (
                                <span className="size-2 rounded-full bg-[#CCFF00]" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                          </div>
                        );
                      })}

                      {/* Add new address option */}
                      <div
                        onClick={() => {
                          setSelectedAddressId("new");
                          setAddress((prev) => ({
                            ...prev,
                            phone: "",
                            street: "",
                            city: "",
                            state: "",
                            postalCode: "",
                          }));
                        }}
                        className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-center ${
                          selectedAddressId === "new"
                            ? "border-[#CCFF00] bg-[#CCFF00]/5"
                            : "border-border/60 hover:border-border bg-card"
                        }`}
                      >
                        <p className="text-xs font-bold text-foreground">
                          + Add new address
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Enter details manually
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <AddressField
                    label="Full name"
                    id="addr-name"
                    value={address.name}
                    error={addressErrors.name}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, name: v }));
                      if (addressErrors.name)
                        setAddressErrors((p) => ({ ...p, name: undefined }));
                    }}
                  />
                  <AddressField
                    label="Email"
                    id="addr-email"
                    type="email"
                    value={address.email}
                    error={addressErrors.email}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, email: v }));
                      if (addressErrors.email)
                        setAddressErrors((p) => ({ ...p, email: undefined }));
                    }}
                  />
                  <AddressField
                    label="Phone"
                    id="addr-phone"
                    type="tel"
                    value={address.phone}
                    error={addressErrors.phone}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, phone: v }));
                      if (addressErrors.phone)
                        setAddressErrors((p) => ({ ...p, phone: undefined }));
                    }}
                  />
                  <AddressField
                    label="City"
                    id="addr-city"
                    value={address.city}
                    error={addressErrors.city}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, city: v }));
                      if (addressErrors.city)
                        setAddressErrors((p) => ({ ...p, city: undefined }));
                    }}
                  />
                </div>

                <AddressField
                  label="Street address"
                  id="addr-street"
                  value={address.street}
                  error={addressErrors.street}
                  onChange={(v) => {
                    setAddress((p) => ({ ...p, street: v }));
                    if (addressErrors.street)
                      setAddressErrors((p) => ({ ...p, street: undefined }));
                  }}
                />

                <div className="grid sm:grid-cols-3 gap-4">
                  <AddressField
                    label="State"
                    id="addr-state"
                    value={address.state}
                    error={addressErrors.state}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, state: v }));
                      if (addressErrors.state)
                        setAddressErrors((p) => ({ ...p, state: undefined }));
                    }}
                  />
                  <AddressField
                    label="Postal code"
                    id="addr-postal"
                    value={address.postalCode}
                    error={addressErrors.postalCode}
                    onChange={(v) => {
                      setAddress((p) => ({ ...p, postalCode: v }));
                      if (addressErrors.postalCode)
                        setAddressErrors((p) => ({
                          ...p,
                          postalCode: undefined,
                        }));

                      // Auto-fetch city & state from Indian Post PIN code API if exactly 6 digits
                      if (v.length === 6 && /^\d+$/.test(v)) {
                        fetch(`https://api.postalpincode.in/pincode/${v}`)
                          .then((r) => r.json())
                          .then((data) => {
                            if (data && data[0] && data[0].Status === "Success") {
                              const info = data[0].PostOffice[0];
                              if (info) {
                                setAddress((prev) => ({
                                  ...prev,
                                  city: info.District || info.Taluk || prev.city,
                                  state: info.State || prev.state,
                                }));
                                toast.success(`Location auto-detected: ${info.District}, ${info.State}`);
                              }
                            }
                          })
                          .catch((err) => console.error("Pin code fetch error:", err));
                      }
                    }}
                  />
                  <AddressField
                    label="Country"
                    id="addr-country"
                    value={address.country}
                    onChange={(v) => setAddress((p) => ({ ...p, country: v }))}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-6 animate-fade-in-up">
                <h2 className="heading text-lg font-bold text-foreground">
                  payment method
                </h2>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  {/* Card */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === "card"
                        ? "border-lime bg-lime/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value="card" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        Credit / debit card
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Visa, Mastercard, RuPay
                      </p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === "upi"
                        ? "border-lime bg-lime/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value="upi" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        UPI
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Google Pay, PhonePe, Paytm
                      </p>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-lime bg-lime/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <RadioGroupItem value="cod" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">
                        Cash on delivery
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pay when you receive
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Review */}
            {step === "review" && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Address Summary */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="heading text-lg font-bold text-foreground">
                      shipping address
                    </h2>
                    <button
                      onClick={() => setStep("shipping")}
                      className="text-xs font-medium text-lime hover:underline"
                    >
                      edit
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">
                      {address.name}
                    </p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p>{address.email} &middot; {address.phone}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="heading text-lg font-bold text-foreground">
                      payment method
                    </h2>
                    <button
                      onClick={() => setStep("payment")}
                      className="text-xs font-medium text-lime hover:underline"
                    >
                      edit
                    </button>
                  </div>
                  <p className="text-sm font-medium text-foreground capitalize">
                    {paymentMethod === "cod"
                      ? "Cash on delivery"
                      : paymentMethod === "upi"
                        ? "UPI"
                        : "Credit / debit card"}
                  </p>
                </div>

                {/* Order Items */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="heading text-lg font-bold text-foreground mb-4">
                    order items
                  </h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PackageIcon size={16} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.productName}
                          </p>
                          {item.variantName && (
                            <p className="text-xs text-muted-foreground">
                              {item.variantName}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-foreground shrink-0">
                          {formatPrice(
                            (item.salePrice ?? item.price) * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon (Review step) */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h2 className="heading text-lg font-bold text-foreground mb-4">
                    coupon code
                  </h2>
                  {couponValid ? (
                    <div className="flex items-center justify-between bg-lime/10 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon
                          size={16}
                          className="text-foreground"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {couponCode.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {couponMessage}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCouponCode("");
                          setCouponDiscount(0);
                          setCouponValid(false);
                          setCouponMessage("");
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="pl-9 h-10 rounded-lg text-sm"
                          onKeyDown={(e) =>
                            e.key === "Enter" && applyCoupon()
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-4 h-10 text-xs font-semibold"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                      >
                        apply
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step !== "shipping" ? (
                <Button
                  variant="outline"
                  className="rounded-full h-11 px-6 font-medium text-sm gap-2"
                  onClick={() => {
                    if (step === "review") setStep("payment");
                    else if (step === "payment") setStep("shipping");
                  }}
                >
                  <ArrowLeftIcon size={16} />
                  back
                </Button>
              ) : (
                <a
                  href="/cart"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftIcon size={14} />
                  back to cart
                </a>
              )}

              {step !== "review" ? (
                <Button
                  className="rounded-full h-11 px-8 font-semibold text-sm gap-2"
                  onClick={handleNext}
                >
                  continue
                  <ArrowRightIcon size={16} />
                </Button>
              ) : (
                <Button
                  className="rounded-full h-12 px-10 font-bold text-sm gap-2"
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? (
                    "placing order..."
                  ) : (
                    <>
                      place order &middot; {formatPrice(total)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
              <h2 className="heading text-lg font-bold text-foreground mb-4">
                order summary
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate pr-2">
                      {item.productName}
                      <span className="text-muted-foreground/60">
                        {" "}
                        x{item.quantity}
                      </span>
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(
                        (item.salePrice ?? item.price) * item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{formatPrice(couponDiscount)}
                    </span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <span className="heading font-bold text-base text-foreground">
                  Total
                </span>
                <span className="heading font-bold text-xl text-foreground">
                  {formatPrice(total)}
                </span>
              </div>

              {shipping > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <TruckIcon size={14} />
                  <span>
                    Add {formatPrice(999 - cartSubtotal)} more for free shipping
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable address field component */
function AddressField({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 rounded-lg text-sm ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}