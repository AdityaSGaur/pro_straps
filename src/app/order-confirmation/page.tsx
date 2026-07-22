"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon, TruckIcon, PackageIcon, ArrowRightIcon } from "@/lib/icons";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "PS-000000";
  const total = parseFloat(searchParams.get("total") || "0");

  // Estimated delivery: 5-7 business days from now
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);
  const deliveryStr = estimatedDelivery.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 lg:py-16">
      <div className="w-full max-w-lg">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lime/20 mb-5">
            <CheckCircleIcon size={40} className="text-foreground" />
          </div>
          <h1 className="heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
            order confirmed!
          </h1>
          <p className="text-sm text-muted-foreground">
            Thank you for your purchase. We&apos;re getting your straps ready.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          {/* Order Number */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                order number
              </p>
              <p className="heading text-xl font-bold text-foreground">
                {orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                total
              </p>
              <p className="heading text-xl font-bold text-foreground">
                {formatPrice(total)}
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Estimated Delivery */}
          <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-muted/50">
            <TruckIcon size={20} className="text-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                estimated delivery
              </p>
              <p className="text-sm text-muted-foreground">{deliveryStr}</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-foreground">
              what happens next?
            </p>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-lime/20 shrink-0 mt-0.5">
                <CheckCircleIcon size={12} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  order confirmed
                </p>
                <p className="text-xs text-muted-foreground">
                  We&apos;ve received your order and it&apos;s being processed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-muted shrink-0 mt-0.5">
                <PackageIcon size={12} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  quality check &amp; packing
                </p>
                <p className="text-xs text-muted-foreground">
                  Each strap is inspected and carefully packaged
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-6 rounded-full bg-muted shrink-0 mt-0.5">
                <TruckIcon size={12} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  shipped &amp; delivered
                </p>
                <p className="text-xs text-muted-foreground">
                  Track your package with the tracking link in your email
                </p>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Actions */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Link href="/shop" className="block">
              <Button
                variant="outline"
                className="w-full rounded-full h-11 font-semibold text-sm gap-2"
              >
                continue shopping
                <ArrowRightIcon size={14} />
              </Button>
            </Link>
            <Button
              className="w-full rounded-full h-11 font-semibold text-sm"
              onClick={() =>
                toast.info("Tracking page coming soon!", {
                  id: "track-order",
                })
              }
            >
              track order
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          A confirmation email has been sent to your email address.
          <br />
          Need help? Contact us at{" "}
          <span className="font-medium text-foreground">
            support@prostraps.in
          </span>
        </p>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}