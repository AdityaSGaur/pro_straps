"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageIcon, ClockIcon, ArrowRightIcon, ShoppingBagIcon, FilterIcon } from "@/lib/icons";
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

const STATUS_TABS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
const MONTH_OPTIONS = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

type OrderItem = { id: string; productName: string; variantName: string | null; productImage: string | null; price: number; quantity: number; total: number };
type Order = { id: string; orderNumber: string; status: string; total: number; createdAt: string; items: OrderItem[] };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [months, setMonths] = useState("24");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/account/orders?status=${activeStatus}&months=${months}`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [activeStatus, months]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      {/* Mobile header */}
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-bold text-foreground">orders</h1>
        <p className="text-sm text-muted-foreground mt-1">view your order history</p>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block mb-6">
        <h2 className="text-lg font-bold text-foreground">order history</h2>
        <p className="text-sm text-muted-foreground mt-1">view and track your past orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        {/* Status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1 scrollbar-none">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                activeStatus === s
                  ? "bg-[#0A0A0A] text-white dark:bg-white dark:text-[#0A0A0A]"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Time range */}
        <div className="flex items-center gap-2 shrink-0">
          <FilterIcon size={14} className="text-muted-foreground" />
          {MONTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMonths(opt.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                months === opt.value
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
          <PackageIcon size={40} className="text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-1">no orders found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {activeStatus !== "ALL" ? `No ${activeStatus.toLowerCase()} orders in this period.` : "You haven't placed any orders yet."}
          </p>
          <Link href="/shop">
            <Button className="rounded-full text-sm gap-1.5">
              <ShoppingBagIcon size={14} />
              start shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                {/* Order header - clickable */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="w-full p-4 sm:p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <PackageIcon size={18} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{order.orderNumber}</span>
                          <Badge
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full border-0 font-semibold uppercase",
                              STATUS_COLORS[order.status] || "bg-muted text-muted-foreground"
                            )}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <ClockIcon size={11} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">{formatPrice(order.total)}</span>
                      <ArrowRightIcon size={14} className={cn("text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border/50 px-4 sm:px-5 py-4 space-y-4">
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-full text-xs gap-1.5">
                        view full details
                        <ArrowRightIcon size={12} />
                      </Button>
                    </Link>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="size-14 rounded-xl bg-muted overflow-hidden shrink-0 relative">
                            {item.productImage ? (
                              <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="56px" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ShoppingBagIcon size={16} className="text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                            {item.variantName && (
                              <p className="text-xs text-muted-foreground">{item.variantName}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
