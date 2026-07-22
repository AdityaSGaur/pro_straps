"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LinkedinIcon, InstagramIcon, GithubIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SOCIAL_LINKS = [
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/aditya-s-gaur/",
    label: "LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/gauradityas111/",
    label: "Instagram",
  },
  {
    icon: GithubIcon,
    href: "https://github.com/AdityaSGaur",
    label: "GitHub",
  },
] as const;

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Straps", href: "/shop" },
      { label: "Leather", href: "/shop?category=leather" },
      { label: "Silicone", href: "/shop?category=silicone" },
      { label: "Metal", href: "/shop?category=metal" },
      { label: "NATO", href: "/shop?category=nato" },
      { label: "New Arrivals", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Refund Policy", href: "/refund" },
    ],
  },
] as const;

const PAYMENT_METHODS = ["Visa", "Mastercard", "UPI", "COD"] as const;

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-[#F5F5F7] dark:bg-[#111] text-[#0A0A0A] dark:text-white/80">
      {/* Row 1: Logo + tagline + social */}
      <div className="border-b border-[#0A0A0A]/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/docs/planning/brand/logo_light.png"
                  alt="Pro Straps Logo"
                  width={160}
                  height={40}
                  className="h-9 w-auto block dark:hidden object-contain"
                />
                <Image
                  src="/docs/planning/brand/logo_dark.png"
                  alt="Pro Straps Logo"
                  width={160}
                  height={40}
                  className="h-9 w-auto hidden dark:block object-contain"
                />
              </Link>
              <p className="mt-4 text-sm text-[#0A0A0A]/60 dark:text-white/50 leading-relaxed">
                premium watch straps for every wrist
              </p>
            </div>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center size-11 sm:size-12 rounded-full border border-neutral-300 dark:border-neutral-700/80 hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-all duration-200"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Link columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-wider uppercase text-[#0A0A0A] dark:text-white mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#0A0A0A]/60 dark:text-white/50 hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Newsletter */}
      <div className="border-t border-[#0A0A0A]/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-lg font-bold tracking-tight text-[#0A0A0A] dark:text-white">
              join the pro straps club
            </h3>
            <p className="mt-2 text-sm text-[#0A0A0A]/60 dark:text-white/50">
              get early access to new drops, exclusive offers, and style tips.
            </p>
            <form onSubmit={handleSubscribe} className="mt-6 flex gap-3">
              <Input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-full border-[#0A0A0A]/15 dark:border-white/15 bg-white dark:bg-white/5 px-5 text-sm placeholder:text-[#0A0A0A]/40 dark:placeholder:text-white/30 focus-visible:border-[#0A0A0A] dark:focus-visible:border-white/30 focus-visible:ring-0"
              />
              <Button
                type="submit"
                className="h-11 px-6 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-[#0A0A0A] font-medium text-sm shrink-0"
              >
                subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Row 4: Copyright & payment */}
      <div className="border-t border-[#0A0A0A]/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#0A0A0A]/60 dark:text-white/50">
              &copy; 2025 Pro Straps. All rights reserved. &bull; A personal project by <span className="font-semibold text-foreground">Aditya Gaur</span>
            </p>
            <div className="flex items-center gap-3">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="text-[10px] font-medium tracking-wider uppercase text-[#0A0A0A]/40 dark:text-white/30 border border-[#0A0A0A]/10 dark:border-white/10 rounded-md px-2.5 py-1"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}