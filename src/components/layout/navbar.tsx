"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Sniglet } from "next/font/google";

const sniglet = Sniglet({
  weight: ["400", "800"],
  subsets: ["latin"],
});
import {
  SearchIcon,
  HeartIcon,
  UserIcon,
  ShoppingBagIcon,
  MenuIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  LogoutIcon,
} from "@/lib/icons";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "Collections", href: "/collections", hasDropdown: false },
  { label: "Customizer", href: "/customizer", hasDropdown: false },
  { label: "About", href: "/about", hasDropdown: false },
] as const;

const SHOP_CATEGORIES = [
  { label: "All Straps", href: "/shop" },
  { label: "Leather", href: "/shop?category=leather" },
  { label: "Silicone", href: "/shop?category=silicone" },
  { label: "Metal", href: "/shop?category=metal" },
  { label: "NATO", href: "/shop?category=nato" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center justify-center shrink-0", className)}>
      <Image
        src="/docs/planning/brand/logo_light.png"
        alt="Pro Straps Logo"
        width={150}
        height={36}
        className="h-7 w-auto block dark:hidden object-contain"
        priority
      />
      <Image
        src="/docs/planning/brand/logo_dark.png"
        alt="Pro Straps Logo"
        width={150}
        height={36}
        className="h-7 w-auto hidden dark:block object-contain"
        priority
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop Shop Dropdown                                              */
/* ------------------------------------------------------------------ */
function ShopDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/shop"
        className="flex items-center gap-1 text-sm font-medium text-[#0A0A0A] dark:text-white hover:opacity-70 transition-opacity"
      >
        shop
        <ChevronDownIcon size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </Link>

      {/* Dropdown panel */}
      <div
        className={cn(
          "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200",
          open
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        )}
      >
        <div className="w-52 rounded-2xl border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111] p-2 shadow-lg">
          {SHOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="block rounded-xl px-4 py-2.5 text-sm text-[#0A0A0A] dark:text-white/80 hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Sheet Content                                                */
/* ------------------------------------------------------------------ */
function MobileNavContent({ onClose, session, wishlistCount, cartCount }: {
  onClose: () => void;
  session: { user?: { name?: string | null; email?: string | null } } | null;
  wishlistCount: number;
  cartCount: number;
}) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="border-b border-[#e5e5e5] dark:border-white/10 pb-4">
        <SheetTitle>
          <Logo />
        </SheetTitle>
      </SheetHeader>

      {/* Quick Action Icons — replaces hidden navbar icons on small screens */}
      <div className="flex items-center justify-around px-4 py-3 border-b border-[#e5e5e5] dark:border-white/10">
        <MobileQuickAction
          icon="search"
          label="search"
          onClick={() => {
            useUIStore.getState().setSearchOpen(true);
            handleLinkClick();
          }}
        />
        <MobileQuickAction
          icon="wishlist"
          label="wishlist"
          count={wishlistCount}
          onClick={() => {
            // navigate then close
          }}
          href="/wishlist"
          onClose={handleLinkClick}
        />
        <MobileQuickAction
          icon="cart"
          label="cart"
          count={cartCount}
          onClick={() => {
            useUIStore.getState().setMobileMenuOpen(false);
          }}
          href="/cart"
          onClose={handleLinkClick}
        />
        <MobileQuickAction
          icon="account"
          label="account"
          onClick={() => {
            // navigate then close
          }}
          href={session?.user ? "/account" : "/login"}
          onClose={handleLinkClick}
        />
        <MobileThemeToggle />
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {/* Shop with expandable categories */}
          <li>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[#0A0A0A] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              shop
              <ChevronDownIcon
                size={16}
                className={cn(
                  "transition-transform duration-200",
                  categoriesOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                categoriesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <ul className="pl-4 pb-2 space-y-0.5">
                {SHOP_CATEGORIES.map((cat) => (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      onClick={handleLinkClick}
                      className="block px-4 py-2.5 text-sm text-[#0A0A0A]/70 dark:text-white/60 hover:text-[#0A0A0A] dark:hover:text-white rounded-xl hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {NAV_LINKS.filter((l) => !l.hasDropdown).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={handleLinkClick}
                className="block px-4 py-3 text-sm font-medium text-[#0A0A0A] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label.toLowerCase()}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-[#e5e5e5] dark:border-white/10 pt-4 pb-6 space-y-3 px-4">
        {session?.user ? (
          <>
            <div className="px-2 py-2 text-sm">
              <p className="font-medium text-[#0A0A0A] dark:text-white">
                {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-[#0A0A0A]/50 dark:text-white/50">
                {session.user.email}
              </p>
            </div>
            <Link href="/account" onClick={handleLinkClick} className="block">
              <Button
                variant="outline"
                className="w-full rounded-full border-[#0A0A0A]/20 dark:border-white/20 h-11"
              >
                <UserIcon size={16} />
                my account
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full rounded-full border-[#0A0A0A]/20 dark:border-white/20 h-11"
              onClick={() => {
                signOut();
                handleLinkClick();
              }}
            >
              <LogoutIcon size={16} />
              sign out
            </Button>
          </>
        ) : (
          <Link href="/login" onClick={handleLinkClick} className="block">
            <Button
              variant="default"
              className="w-full rounded-full bg-[#0A0A0A] hover:bg-[#0A0A0A]/80 text-white h-11"
            >
              <UserIcon size={16} />
              login / register
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Quick Action Icon                                            */
/* ------------------------------------------------------------------ */
function MobileQuickAction({ icon, label, count, onClick, href, onClose }: {
  icon: "search" | "wishlist" | "cart" | "account";
  label: string;
  count?: number;
  onClick?: () => void;
  href?: string;
  onClose?: () => void;
}) {
  const { data: session } = useSession();

  const iconEl = (
    <span className="relative flex items-center justify-center">
      {icon === "search" && <SearchIcon size={20} className="text-[#0A0A0A] dark:text-white" />}
      {icon === "wishlist" && <HeartIcon size={20} className="text-[#0A0A0A] dark:text-white" />}
      {icon === "cart" && <ShoppingBagIcon size={20} className="text-[#0A0A0A] dark:text-white" />}
      {icon === "account" && (
        session?.user ? (
          session.user.image ? (
            <div className="size-6 rounded-full overflow-hidden border border-border">
              <Image
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={cn("size-8 rounded-full bg-[#CCFF00] text-[#0A0A0A] flex items-center justify-center text-base font-normal border border-border leading-none", sniglet.className)}>
              {(session.user.name || session.user.email || "u")[0].toLowerCase()}
            </div>
          )
        ) : (
          <UserIcon size={20} className="text-[#0A0A0A] dark:text-white" />
        )
      )}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-2 size-4 flex items-center justify-center bg-[#CCFF00] text-[#0A0A0A] text-[10px] font-bold rounded-full min-w-4">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </span>
  );

  const classes = "flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors";

  if (href) {
    return (
      <Link href={href} onClick={onClose} className={cn(classes, "hover:bg-[#F5F5F7] dark:hover:bg-white/5")}>
        {iconEl}
        <span className="text-[10px] font-medium text-[#0A0A0A]/60 dark:text-white/60">{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(classes, "hover:bg-[#F5F5F7] dark:hover:bg-white/5")}>
      {iconEl}
      <span className="text-[10px] font-medium text-[#0A0A0A]/60 dark:text-white/60">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Theme Toggle (inline, no SSR flash)                         */
/* ------------------------------------------------------------------ */
function MobileThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!mounted) return <div className="flex flex-col items-center gap-1 py-1 px-2"><div className="size-5" /></div>;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      <span className="relative">
        {isDark ? (
          <SunIcon size={20} className="text-[#F5F5F7]" />
        ) : (
          <MoonIcon size={20} className="text-[#0A0A0A]" />
        )}
      </span>
      <span className="text-[10px] font-medium text-[#0A0A0A]/60 dark:text-white/60">
        {isDark ? "light" : "dark"}
      </span>
    </button>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  if (!mounted) return <div className={cn("p-2", className)} />;
  const isDark = resolvedTheme === "dark";
  return (
    <button
      className={cn("p-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors", className)}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <SunIcon size={18} className="text-[#F5F5F7]" />
      ) : (
        <MoonIcon size={18} className="text-[#0A0A0A]" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Navbar                                                        */
/* ------------------------------------------------------------------ */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const toggleCart = useCartStore((s) => s.toggleCart);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = mounted ? cartItems.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <>
      <header
        data-scrolled={scrolled || undefined}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-[#e5e5e5]/50 dark:border-white/5"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ---- Mobile: hamburger ---- */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} className="text-[#0A0A0A] dark:text-white" />
            </button>

            {/* ---- Desktop: logo ---- */}
            <div className="hidden lg:flex items-center">
              <Logo />
            </div>

            {/* ---- Mobile: centered logo ---- */}
            <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <Logo className="scale-90" />
            </div>

            {/* ---- Desktop: center nav ---- */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ShopDropdown />
              {NAV_LINKS.filter((l) => !l.hasDropdown).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#0A0A0A] dark:text-white hover:opacity-70 transition-opacity"
                >
                  {link.label.toLowerCase()}
                </Link>
              ))}
            </nav>

            {/* ---- Right icons ---- */}
            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:flex" />
              <button
                className="hidden sm:flex p-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                aria-label="Search"
                onClick={() => useUIStore.getState().setSearchOpen(true)}
              >
                <SearchIcon size={18} className="text-[#0A0A0A] dark:text-white" />
              </button>

              <Link
                href="/wishlist"
                className="hidden lg:flex p-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors relative"
                aria-label="Wishlist"
              >
                <HeartIcon size={18} className="text-[#0A0A0A] dark:text-white" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#CCFF00] text-[#0A0A0A] text-[10px] font-bold border-0 rounded-full min-w-4">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>

              {/* Cart button */}
              <button
                className="p-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors relative"
                aria-label="Cart"
                onClick={toggleCart}
              >
                <ShoppingBagIcon size={18} className="text-[#0A0A0A] dark:text-white" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 flex items-center justify-center bg-[#CCFF00] text-[#0A0A0A] text-[10px] font-bold border-0 rounded-full min-w-4">
                    {cartCount}
                  </Badge>
                )}
              </button>

              {/* Account button */}
              <div className="hidden lg:block relative ml-1.5">
                 <button
                  className="flex items-center justify-center rounded-full hover:opacity-85 transition-opacity"
                  aria-label="Account"
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  {session?.user ? (
                    session.user.image ? (
                      <div className="size-8 rounded-full overflow-hidden border border-border">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User Avatar"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={cn("size-9 rounded-full bg-[#CCFF00] text-[#0A0A0A] flex items-center justify-center text-lg font-normal border border-border leading-none", sniglet.className)}>
                        {(session.user.name || session.user.email || "u")[0].toLowerCase()}
                      </div>
                    )
                  ) : (
                    <div className="p-2 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors">
                      <UserIcon size={18} className="text-[#0A0A0A] dark:text-white" />
                    </div>
                  )}
                </button>

                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111] p-2 shadow-lg">
                      {session?.user ? (
                        <>
                          <div className="px-3 py-2 border-b border-[#e5e5e5] dark:border-white/10 mb-1">
                            <p className="text-sm font-medium text-[#0A0A0A] dark:text-white truncate">
                              {session.user.name || "Account"}
                            </p>
                            <p className="text-xs text-[#0A0A0A]/50 dark:text-white/50 truncate">
                              {session.user.email}
                            </p>
                          </div>
                          <Link
                            href="/account"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0A0A0A]/80 dark:text-white/80 hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                          >
                            <UserIcon size={16} />
                            my account
                          </Link>
                          <Link
                            href="/wishlist"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0A0A0A]/80 dark:text-white/80 hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                          >
                            <HeartIcon size={16} />
                            wishlist
                          </Link>
                          <button
                            onClick={() => {
                              setAccountOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
                          >
                            <LogoutIcon size={16} />
                            sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0A0A0A] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                          >
                            <UserIcon size={16} />
                            sign in
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#0A0A0A] dark:text-white hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                          >
                            <UserIcon size={16} />
                            create account
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Mobile Sheet ---- */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80 sm:max-w-sm p-0">
          <MobileNavContent onClose={() => setMobileMenuOpen(false)} session={session} wishlistCount={wishlistCount} cartCount={cartCount} />
        </SheetContent>
      </Sheet>
    </>
  );
}