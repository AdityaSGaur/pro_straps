"use client";

import { useState } from "react";
import { XIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "prostraps-announcement-dismissed";

const ANNOUNCEMENT_TEXT =
  "free shipping on orders over \u20b91,499 | use code welcome20 for 20% off your first order";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage not available
    }
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center px-4 py-2",
        "bg-[#CCFF00] dark:bg-[#1a2600]"
      )}
    >
      <p className="text-[11px] font-medium tracking-wider uppercase text-[#0A0A0A] dark:text-[#CCFF00] text-center px-6">
        {ANNOUNCEMENT_TEXT}
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss announcement"
      >
        <XIcon size={14} className="text-[#0A0A0A] dark:text-[#CCFF00]" />
      </button>
    </div>
  );
}