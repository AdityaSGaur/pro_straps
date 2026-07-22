"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  PackageIcon,
  ClockIcon,
  LocationIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
};

type OrderItem = { id: string; productName: string; variantName: string | null; productImage: string | null; price: number; quantity: number; total: number };
type StatusEntry = { id: string; status: string; note: string | null; createdAt: string };
type ShippingAddr = { id: string; label: string | null; street: string; city: string; state: string; postalCode: string; country: string; phone: string | null } | null;
type OrderDetail = {
  id: string; orderNumber: string; status: string; paymentStatus: string;
  subtotal: number; discount: number; tax: number; shipping: number; total: number;
  createdAt: string; items: OrderItem[];
  statusHistory: StatusEntry[];
  shippingAddress: ShippingAddr;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/account/orders/${orderId}`);
      const data = await res.json();
      if (data.id) setOrder(data);
      else toast.error("Order not found");
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      {/* Back link */}
      <button
        onClick={() => router.push("/account/orders")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon size={16} />
        back to orders
      </button>

      {/* Order header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{order.orderNumber}</h1>
            <Badge className={cn("text-[11px] px-2.5 py-0.5 rounded-full border-0 font-semibold uppercase", STATUS_COLORS[order.status] || "bg-muted text-muted-foreground")}>
              {order.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <ClockIcon size={13} />
            placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: items + status timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold text-foreground mb-4">items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-xl bg-muted overflow-hidden shrink-0 relative">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBagIcon size={20} className="text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.productName}</p>
                    {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-[11px] text-muted-foreground">{formatPrice(item.price)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status timeline */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold text-foreground mb-4">order status</h3>
            {order.statusHistory.length > 0 ? (
              <div className="relative pl-6 space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {order.statusHistory.map((entry, i) => {
                  const isLast = i === order.statusHistory.length - 1;
                  return (
                    <div key={entry.id} className="relative pb-6 last:pb-0">
                      <div className={cn(
                        "absolute -left-6 top-1 size-4 rounded-full border-2",
                        isLast ? "bg-[#CCFF00] border-[#CCFF00]" : "bg-card border-border"
                      )}>
                        {isLast && <CheckCircleIcon size={16} className="text-[#0A0A0A]" />}
                      </div>
                      <div>
                        <p className={cn("text-sm font-medium", isLast ? "text-foreground" : "text-muted-foreground")}>
                          {entry.status}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                        {entry.note && <p className="text-xs text-muted-foreground/70 mt-1">{entry.note}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No status updates yet.</p>
            )}
          </div>
        </div>

        {/* Right sidebar: summary + address */}
        <div className="space-y-6">
          {/* Order summary */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="font-semibold text-foreground mb-4">order summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">tax (18%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">shipping</span>
                <span>{order.shipping === 0 ? "free" : formatPrice(order.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-border/50 bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <LocationIcon size={16} />
                shipping address
              </h3>
              <div className="text-sm space-y-1">
                {order.shippingAddress.label && (
                  <p className="font-medium">{order.shippingAddress.label}</p>
                )}
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="text-muted-foreground">{order.shippingAddress.phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
