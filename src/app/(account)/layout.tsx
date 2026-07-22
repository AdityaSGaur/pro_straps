"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  LocationIcon,
  TruckIcon,
  PackageIcon,
  HeartIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

const ACCOUNT_LINKS = [
  { label: "overview", href: "/account", icon: HomeIcon },
  { label: "profile", href: "/account/profile", icon: UserIcon },
  { label: "addresses", href: "/account/addresses", icon: LocationIcon },
  { label: "delivery", href: "/account/delivery-instructions", icon: TruckIcon },
  { label: "orders", href: "/account/orders", icon: PackageIcon },
  { label: "wishlist", href: "/wishlist", icon: HeartIcon },
];

function AccountLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-56 shrink-0">
              <div className="sticky top-24 space-y-1">
                <h2 className="text-lg font-bold text-foreground mb-4">my account</h2>
                <nav className="space-y-1">
                  {ACCOUNT_LINKS.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          active
                            ? "bg-[#CCFF00]/10 text-[#0A0A0A] dark:text-[#CCFF00]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>

      {/* Mobile: full width content + bottom tab bar */}
      <div className="lg:hidden pb-20">
        <main>{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-border/50">
        <nav className="flex items-center justify-around px-2 py-2">
          {ACCOUNT_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-0",
                  active ? "text-[#0A0A0A] dark:text-[#CCFF00]" : "text-muted-foreground"
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AccountLayoutInner>{children}</AccountLayoutInner>
    </SessionProvider>
  );
}
