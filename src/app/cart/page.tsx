"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
  TagIcon,
  ArrowRightIcon,
} from "@/lib/icons";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const cartSubtotal = subtotal();
  const shipping = cartSubtotal > 999 ? 0 : 99;
  const tax = Math.round(cartSubtotal * 0.18);
  const total = cartSubtotal + shipping + tax;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.toUpperCase(), orderValue: cartSubtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`);
      } else {
        toast.error(data.message || "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon");
    }
    setCouponLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 lg:py-16">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBagIcon size={32} className="text-muted-foreground" />
        </div>
        <h1 className="heading text-2xl font-bold text-foreground mb-2">
          your cart is empty
        </h1>
        <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
          Looks like you haven&apos;t added any straps yet. Browse our collection
          and find your perfect match.
        </p>
        <Link href="/shop">
          <Button className="rounded-full h-11 px-8 font-semibold text-sm">
            shop now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading text-2xl sm:text-3xl font-bold text-foreground">
            your cart
          </h1>
          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-1">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
              <h2 className="heading text-lg font-bold text-foreground mb-4">
                order summary
              </h2>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <TagIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-9 h-10 rounded-lg text-sm"
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
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

              <Separator className="mb-4" />

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
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
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="heading font-bold text-base text-foreground">Total</span>
                <span className="heading font-bold text-lg text-foreground">
                  {formatPrice(total)}
                </span>
              </div>

              {cartSubtotal < 999 && (
                <p className="text-xs text-muted-foreground mb-4 text-center">
                  Add {formatPrice(999 - cartSubtotal)} more for free shipping
                </p>
              )}

              <Link href="/checkout" className="block">
                <Button className="w-full h-12 rounded-full font-semibold text-sm gap-2">
                  proceed to checkout
                  <ArrowRightIcon size={16} />
                </Button>
              </Link>

              <Link
                href="/shop"
                className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
              >
                continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const price = item.salePrice ?? item.price;

  return (
    <div className="flex gap-4 py-4 border-b border-border/50 last:border-0">
      {/* Image */}
      <Link
        href={`/products/${item.productName.toLowerCase().replace(/\s+/g, "-")}`}
        className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-muted"
      >
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBagIcon size={24} className="text-muted-foreground" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground truncate">
              {item.productName}
            </h3>
            {item.variantName && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.variantName}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              onRemove(item.id);
              toast.success("Item removed from cart");
            }}
            className="shrink-0 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            aria-label="Remove item"
          >
            <TrashIcon size={16} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-0 border border-border rounded-full">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <PlusIcon size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-bold text-sm text-foreground">
              {formatPrice(price * item.quantity)}
            </p>
            {item.salePrice && item.salePrice < item.price && (
              <p className="text-xs text-muted-foreground line-through mt-0.5">
                {formatPrice(item.price * item.quantity)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}