"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  UserIcon,
  LocationIcon,
  PackageIcon,
  HeartIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  ClockIcon,
} from "@/lib/icons";
import { useWishlistStore } from "@/stores/wishlist-store";
import { cn } from "@/lib/utils";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
};

type Address = { id: string; label: string | null; street: string; city: string; state: string; postalCode: string; isDefault: boolean };
type Order = { id: string; orderNumber: string; status: string; total: number; itemCount?: number; createdAt: string; items?: { id: string }[] };

export default function AccountOverviewPage() {
  const { data: session } = useSession();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [profile, setProfile] = useState<{ name: string | null; email: string; phone: string | null; createdAt: string } | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, addressRes, ordersRes] = await Promise.all([
          fetch("/api/account/profile").then((r) => r.json()),
          fetch("/api/account/addresses").then((r) => r.json()),
          fetch("/api/account/orders?months=24").then((r) => r.json()),
        ]);
        if (profileRes.id) setProfile(profileRes);
        if (Array.isArray(addressRes)) {
          const def = addressRes.find((a: Address) => a.isDefault) || addressRes[0] || null;
          setDefaultAddress(def);
        }
        if (Array.isArray(ordersRes)) {
          setRecentOrders(ordersRes.slice(0, 3));
        }
      } catch {
        toast.error("Failed to load account data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.name || session?.user?.name || session?.user?.email || "there";

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      {/* Mobile header */}
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-bold text-foreground">my account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          welcome back, {displayName}
        </p>
      </div>

      {/* Welcome banner (desktop) */}
      <div className="hidden lg:block mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          welcome back, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          manage your profile, orders, and addresses from here.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        <Link href="/account/orders" className="block">
          <div className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow">
            <PackageIcon size={22} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{recentOrders.length}</p>
            <p className="text-xs text-muted-foreground">total orders</p>
          </div>
        </Link>
        <Link href="/wishlist" className="block">
          <div className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow">
            <HeartIcon size={22} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{wishlistItems.length}</p>
            <p className="text-xs text-muted-foreground">wishlist items</p>
          </div>
        </Link>
        <Link href="/account/addresses" className="block">
          <div className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow">
            <LocationIcon size={22} className="text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{defaultAddress ? "1" : "0"}</p>
            <p className="text-xs text-muted-foreground">default address</p>
          </div>
        </Link>
      </div>

      {/* Profile quick info */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-muted flex items-center justify-center">
              <UserIcon size={20} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{displayName}</h3>
              <p className="text-xs text-muted-foreground">{profile?.email || session?.user?.email}</p>
            </div>
          </div>
          <Link href="/account/profile">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              edit
              <ArrowRightIcon size={12} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">phone</p>
            <p className="text-foreground">{profile?.phone || "not set"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">member since</p>
            <p className="text-foreground">{profile?.createdAt ? formatDate(profile.createdAt) : "—"}</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">recent orders</h2>
          <Link href="/account/orders">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              view all
              <ArrowRightIcon size={12} />
            </Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card p-8 text-center">
            <ShoppingBagIcon size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">no orders yet</p>
            <Link href="/shop" className="mt-4 inline-block">
              <Button size="sm" className="rounded-full text-xs gap-1">
                start shopping
                <ArrowRightIcon size={12} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`}>
                <div className="rounded-2xl border border-border/50 bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{order.orderNumber}</span>
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase",
                          STATUS_COLORS[order.status] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ClockIcon size={12} />
                      {formatDate(order.createdAt)}
                    </span>
                    <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
