"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sniglet } from "next/font/google";
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

const sniglet = Sniglet({
  weight: ["400", "800"],
  subsets: ["latin"],
});

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

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
  CONFIRMED: {
    bg: "bg-blue-500/10",
    text: "text-blue-500 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  SHIPPED: {
    bg: "bg-purple-500/10",
    text: "text-purple-500 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  DELIVERED: {
    bg: "bg-green-500/10",
    text: "text-green-500 dark:text-green-400",
    dot: "bg-green-500",
  },
  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-500 dark:text-red-400",
    dot: "bg-red-500",
  },
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
  const initials = (displayName || "u")[0].toLowerCase();

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      {/* Header section inspired by medical dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight lowercase">
            dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            welcome back, <span className="text-foreground font-medium">{displayName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#CCFF00]/10 text-[#0A0A0A] dark:text-[#CCFF00] font-semibold px-3 py-1.5 rounded-full border border-[#CCFF00]/20 uppercase tracking-wider">
            Premium Member
          </span>
        </div>
      </div>

      {/* Quick stats grid matching CRM cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Highlighted Card (New Patient Leads vibe) */}
        <Link href="/account/orders" className="block relative overflow-hidden group">
          <div className="rounded-3xl bg-[#CCFF00] p-6 hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] transition-all duration-300 min-h-[140px] flex flex-col justify-between relative z-10">
            {/* Concentric rings vector background */}
            <div className="absolute -top-8 -left-8 size-28 rounded-full border border-[#0A0A0A]/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -top-16 -left-16 size-44 rounded-full border border-[#0A0A0A]/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -top-24 -left-24 size-60 rounded-full border border-[#0A0A0A]/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

            <div className="flex justify-between items-start relative z-10">
              <div className="size-11 rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-[#CCFF00]">
                <PackageIcon size={20} />
              </div>
              <span className="text-xs font-semibold text-[#0A0A0A]/60 flex items-center gap-1">
                orders <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="mt-4 relative z-10">
              <p className="text-3xl font-extrabold text-[#0A0A0A] tracking-tight">{recentOrders.length}</p>
              <p className="text-[11px] font-medium text-[#0A0A0A]/70 uppercase tracking-wider mt-1">total purchases</p>
            </div>
          </div>
        </Link>

        {/* Wishlist Card with mock bars */}
        <Link href="/wishlist" className="block relative overflow-hidden group">
          <div className="rounded-3xl border border-border/50 bg-[#FFFFFF] dark:bg-[#141414] p-6 hover:shadow-md transition-all duration-300 min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="size-11 rounded-2xl bg-[#CCFF00]/10 text-[#0A0A0A] dark:text-[#CCFF00] flex items-center justify-center">
                <HeartIcon size={20} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                wishlist <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{wishlistItems.length}</p>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">saved items</p>
              </div>

              {/* Mock Bar chart */}
              <div className="flex items-end gap-1 h-8 opacity-60">
                <div className="w-1.5 h-3 bg-muted-foreground/20 rounded-full" />
                <div className="w-1.5 h-5 bg-muted-foreground/20 rounded-full" />
                <div className="w-1.5 h-4 bg-[#CCFF00] rounded-full" />
                <div className="w-1.5 h-7 bg-[#CCFF00] rounded-full" />
              </div>
            </div>
          </div>
        </Link>

        {/* Address Card with mock sparkline */}
        <Link href="/account/addresses" className="block relative overflow-hidden group">
          <div className="rounded-3xl border border-border/50 bg-[#FFFFFF] dark:bg-[#141414] p-6 hover:shadow-md transition-all duration-300 min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="size-11 rounded-2xl bg-[#CCFF00]/10 text-[#0A0A0A] dark:text-[#CCFF00] flex items-center justify-center">
                <LocationIcon size={20} />
              </div>
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                addresses <ArrowRightIcon size={12} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{defaultAddress ? "1" : "0"}</p>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-1">saved locations</p>
              </div>

              {/* Mock Sparkline chart */}
              <div className="opacity-60 flex items-end h-8">
                <svg className="w-16 h-8 text-[#CCFF00]" viewBox="0 0 100 50">
                  <path
                    d="M0,45 Q25,15 50,35 T100,15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main dashboard widgets section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info widget */}
        <div className="lg:col-span-1 rounded-3xl border border-border/50 bg-[#FFFFFF] dark:bg-[#141414] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-foreground lowercase">profile info</h3>
            <Link href="/account/profile">
              <Button variant="ghost" size="sm" className="text-xs gap-1 lowercase hover:bg-muted/50 rounded-xl">
                edit profile
                <ArrowRightIcon size={12} />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center text-center pb-6 border-b border-border/30 mb-5">
            {session?.user?.image ? (
              <div className="size-20 rounded-full overflow-hidden border-2 border-[#CCFF00] p-0.5 mb-3 shadow-[0_0_15px_rgba(204,255,0,0.05)]">
                <Image
                  src={session.user.image}
                  alt={displayName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className={cn("size-20 rounded-full bg-[#CCFF00] text-[#0A0A0A] flex items-center justify-center text-3xl font-bold mb-3 shadow-[0_0_15px_rgba(204,255,0,0.1)] border border-[#CCFF00]/20 uppercase leading-none", sniglet.className)}>
                {initials}
              </div>
            )}
            <h4 className="font-bold text-lg text-foreground">{displayName}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{profile?.email || session?.user?.email}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border/10">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">phone</span>
              <span className="text-foreground font-medium">{profile?.phone || "not set"}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/10">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">member since</span>
              <span className="text-foreground font-medium">
                {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent orders widget */}
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-[#FFFFFF] dark:bg-[#141414] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base text-foreground lowercase">recent orders</h3>
            <Link href="/account/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1 lowercase hover:bg-muted/50 rounded-xl">
                view all
                <ArrowRightIcon size={12} />
              </Button>
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-border/50 rounded-2xl bg-muted/20">
              <ShoppingBagIcon size={36} className="text-muted-foreground/30 mb-3 animate-pulse" />
              <p className="text-sm text-muted-foreground font-medium">no orders placed yet</p>
              <Link href="/shop" className="mt-4">
                <Button size="sm" className="rounded-full text-xs gap-1 bg-[#0A0A0A] text-white dark:bg-[#CCFF00] dark:text-[#0A0A0A] hover:opacity-95 font-semibold">
                  explore straps
                  <ArrowRightIcon size={12} />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusInfo = STATUS_COLORS[order.status] || {
                  bg: "bg-muted",
                  text: "text-muted-foreground",
                  dot: "bg-muted-foreground",
                };
                return (
                  <Link key={order.id} href={`/account/orders/${order.id}`} className="block group">
                    <div className="rounded-2xl border border-border/40 bg-card/40 p-4 hover:border-[#CCFF00]/40 hover:bg-[#CCFF00]/5 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-foreground group-hover:text-[#CCFF00] transition-colors">
                            {order.orderNumber}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5",
                              statusInfo.bg,
                              statusInfo.text
                            )}
                          >
                            <span className={cn("size-1.5 rounded-full", statusInfo.dot)} />
                            {order.status.toLowerCase()}
                          </span>
                        </div>
                        <span className="text-base font-bold text-foreground sm:text-right">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ClockIcon size={12} />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
