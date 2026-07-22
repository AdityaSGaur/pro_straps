"use client";

import { useState, useMemo, useCallback, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  RefreshCwIcon,
  ShieldIcon,
  AwardIcon,
  ChevronRightIcon,
  CheckIcon,
  ZoomInIcon,
  ArrowUpIcon,
  RulerIcon,
} from "@/lib/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ProductCard } from "@/components/shared/product-card";
import type { ProductWithDetails, ProductWithReviews } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────

interface ReviewType {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: { name: string | null; avatar: string | null } | null;
  images: { id: string; url: string }[];
}

interface CompatibilityType {
  id: string;
  watchBrand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  watchModel: { id: string; name: string } | null;
  lugWidth: number | null;
  notes: string | null;
}

interface ProductDetailClientProps {
  product: ProductWithReviews;
  relatedProducts: ProductWithDetails[];
  categories: { name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
  reviews: ReviewType[];
  compatibilities: CompatibilityType[];
}

// ─── Helpers ──────────────────────────────────────────────────────────

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const getDiscountPercent = (base: number, sale: number): number =>
  Math.round(((base - sale) / base) * 100);

function getUniqueColors(
  variants: ProductWithReviews["variants"]
): { color: string | null; colorName: string | null }[] {
  const seen = new Set<string>();
  const unique: { color: string | null; colorName: string | null }[] = [];
  for (const v of variants) {
    if (!v.isActive) continue;
    const key = v.color ?? v.colorName ?? "unknown";
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ color: v.color, colorName: v.colorName });
    }
  }
  return unique;
}

function getUniqueWidths(
  variants: ProductWithReviews["variants"]
): string[] {
  const seen = new Set<string>();
  const widths: string[] = [];
  for (const v of variants) {
    if (!v.isActive || !v.width) continue;
    if (!seen.has(v.width)) {
      seen.add(v.width);
      widths.push(v.width);
    }
  }
  return widths;
}

// ─── Star Rating Display ───────────────────────────────────────────────

function StarRating({
  rating,
  size = "sm",
  count,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  count?: number;
}) {
  const sizeVal = size === "lg" ? 24 : size === "md" ? 16 : 14;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <span key={i} className="relative inline-block">
            <StarIcon size={sizeVal} className="text-muted-foreground/30" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating - i) * 100}%` : "100%" }}
              >
                <StarIcon size={sizeVal} className="text-lime" />
              </span>
            )}
          </span>
        );
      })}
      {count !== undefined && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────

export function ProductDetailClient({
  product,
  relatedProducts,
  categories,
  brands,
  reviews,
  compatibilities,
}: ProductDetailClientProps) {
  // ── Image gallery state ──
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // ── Variant selection state ──
  const uniqueColors = useMemo(() => getUniqueColors(product.variants), [product.variants]);
  const uniqueWidths = useMemo(() => getUniqueWidths(product.variants), [product.variants]);

  const [selectedColor, setSelectedColor] = useState<string | null>(
    uniqueColors.length === 1 ? (uniqueColors[0].color ?? uniqueColors[0].colorName ?? null) : null
  );
  const [selectedWidth, setSelectedWidth] = useState<string | null>(
    uniqueWidths.length === 1 ? uniqueWidths[0] : null
  );

  // ── Quantity state ──
  const [quantity, setQuantity] = useState(1);

  // ── Add to cart feedback state ──
  const [addedToCart, setAddedToCart] = useState(false);
  const [showVariantMessage, setShowVariantMessage] = useState(false);

  // ── Stores ──
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  // ── Compute selected variant ──
  const selectedVariant = useMemo(() => {
    if (!selectedColor && !selectedWidth) {
      return product.variants.find((v) => v.isActive) ?? null;
    }
    return (
      product.variants.find((v) => {
        if (!v.isActive) return false;
        const colorKey = v.color ?? v.colorName;
        const widthMatch = !selectedWidth || v.width === selectedWidth;
        const colorMatch = !selectedColor || colorKey === selectedColor;
        return colorMatch && widthMatch;
      }) ?? null
    );
  }, [product.variants, selectedColor, selectedWidth]);

  // ── Display price/stock from variant ──
  const displayPrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? product.salePrice ?? product.basePrice;
  const originalPrice = selectedVariant?.price ?? product.basePrice;
  const hasDiscount = displayPrice < originalPrice;
  const discountPercent = hasDiscount ? getDiscountPercent(originalPrice, displayPrice) : 0;
  const currentStock = selectedVariant?.stock ?? 0;
  const isLowStock = currentStock > 0 && currentStock <= (selectedVariant?.lowStockThreshold ?? 5);
  const isOutOfStock = currentStock === 0;

  // ── Clamp quantity ──
  const clampedQuantity = Math.min(quantity, currentStock);

  // ── Primary image for cart/wishlist ──
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  // ── Category for breadcrumb ──
  const productCategory = product.categories[0]?.category;

  // ── Review stats ──
  const avgRating = product._avgRating ?? 0;
  const reviewCount = product._reviewCount ?? 0;

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++;
    });
    return counts;
  }, [reviews]);

  // ── Image zoom handler ──
  const handleImageMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const container = imageContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    },
    []
  );

  // ── Add to cart handler ──
  const handleAddToCart = () => {
    if (uniqueColors.length > 1 && !selectedColor) {
      setShowVariantMessage(true);
      setTimeout(() => setShowVariantMessage(false), 3000);
      return;
    }
    if (uniqueWidths.length > 1 && !selectedWidth) {
      setShowVariantMessage(true);
      setTimeout(() => setShowVariantMessage(false), 3000);
      return;
    }
    if (!selectedVariant || isOutOfStock) return;

    const variantLabel = [
      selectedVariant.colorName ?? selectedVariant.color,
      selectedVariant.width,
    ]
      .filter(Boolean)
      .join(" / ");

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      productImage: primaryImage?.url ?? "",
      variantName: variantLabel,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity: clampedQuantity,
      stock: selectedVariant.stock,
    });

    setAddedToCart(true);
    setCartOpen(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (uniqueColors.length > 1 && !selectedColor) {
      setShowVariantMessage(true);
      setTimeout(() => setShowVariantMessage(false), 3000);
      return;
    }
    if (uniqueWidths.length > 1 && !selectedWidth) {
      setShowVariantMessage(true);
      setTimeout(() => setShowVariantMessage(false), 3000);
      return;
    }
    if (!selectedVariant || isOutOfStock) return;

    const variantLabel = [
      selectedVariant.colorName ?? selectedVariant.color,
      selectedVariant.width,
    ]
      .filter(Boolean)
      .join(" / ");

    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      productImage: primaryImage?.url ?? "",
      variantName: variantLabel,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity: clampedQuantity,
      stock: selectedVariant.stock,
    });

    setCartOpen(true);
  };

  const handleWishlistToggle = () => {
    toggleWishlist({
      productId: product.id,
      productName: product.name,
      productImage: primaryImage?.url ?? "",
      price: product.basePrice,
      salePrice: product.salePrice,
      slug: product.slug,
    });
  };

  // ── Auto-select first width when color changes ──
  const handleColorSelect = (colorKey: string) => {
    setSelectedColor(colorKey);
    if (uniqueWidths.length > 1) {
      const matchingVariant = product.variants.find((v) => {
        if (!v.isActive) return false;
        const vColorKey = v.color ?? v.colorName;
        return vColorKey === colorKey && v.width;
      });
      if (matchingVariant?.width && !uniqueWidths.includes(matchingVariant.width)) {
        setSelectedWidth(null);
      } else if (matchingVariant?.width) {
        setSelectedWidth(matchingVariant.width);
      }
    }
    setQuantity(1);
    setShowVariantMessage(false);
  };

  // ── Spec rows ──
  const specRows = [
    { label: "Material", value: selectedVariant?.material ?? "Premium" },
    { label: "Strap Type", value: product.strapType ?? "—" },
    { label: "Buckle Type", value: product.buckleType ?? "—" },
    {
      label: "Width Options",
      value: uniqueWidths.length > 0 ? uniqueWidths.join(", ") : "—",
    },
    { label: "Watch Type", value: product.watchType ?? "—" },
  ];

  // ── Unique compatible brands (deduplicated) ──
  const uniqueCompatBrands = useMemo(() => {
    const map = new Map<string, CompatibilityType>();
    compatibilities.forEach((c) => {
      if (!map.has(c.watchBrand.slug)) map.set(c.watchBrand.slug, c);
    });
    return Array.from(map.values());
  }, [compatibilities]);

  // ────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ── Top Navigation Bar ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            &lsaquo; back to shop
          </Link>
          {productCategory && (
            <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground border border-border/40">
              {productCategory.name}
            </span>
          )}
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ═══ LEFT COLUMN — Hero Image with Concentric Ring Accent ═══ */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div
              ref={imageContainerRef}
              className="relative w-full aspect-[4/3] sm:aspect-square max-h-[480px] rounded-[2.5rem] bg-[#f7f7f9] dark:bg-neutral-900/60 overflow-hidden cursor-crosshair border border-border/40 shadow-sm flex items-center justify-center p-6"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleImageMouseMove}
            >
              {/* Concentric Circle Accent Background */}
              <div className="absolute size-[320px] sm:size-[380px] rounded-full border border-black/5 dark:border-white/5 pointer-events-none" />
              <div className="absolute size-[240px] sm:size-[280px] rounded-full border border-black/5 dark:border-white/5 pointer-events-none" />

              {/* Floating Top Action Pill (Wishlist Bookmark) */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={cn(
                  "absolute top-5 left-5 size-10 rounded-full border transition-all flex items-center justify-center backdrop-blur-md z-10",
                  inWishlist
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-white/80 dark:bg-neutral-800/80 border-border/40 text-foreground hover:scale-105"
                )}
                aria-label="Wishlist"
              >
                <HeartIcon size={16} className={cn(inWishlist && "fill-current")} />
              </button>

              {/* Main Product Image */}
              {product.images[selectedImageIndex] ? (
                <Image
                  src={product.images[selectedImageIndex].url}
                  alt={
                    product.images[selectedImageIndex].alt ?? product.name
                  }
                  fill
                  className={cn(
                    "object-contain p-4 transition-transform duration-300 z-0",
                    isZooming && "scale-[2]"
                  )}
                  style={
                    isZooming
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : undefined
                  }
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}

              {/* Zoom Pill Badge */}
              {product.images[selectedImageIndex] && (
                <div className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-black/60 dark:bg-white/80 backdrop-blur-md px-3.5 py-1.5 text-white dark:text-black text-[11px] font-medium">
                  <ZoomInIcon size={12} />
                  {isZooming ? "Release" : "Hover zoom"}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Strip */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2 px-2 -ml-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    "relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all bg-white dark:bg-neutral-800",
                    selectedImageIndex === i
                      ? "border-black dark:border-white ring-2 ring-black/10 dark:ring-white/10 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT COLUMN — Luxury Info Column ═══ */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Header Title + SKU Badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight lowercase text-foreground">
                    {product.name}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 text-[10px] font-bold">
                    est. 2025
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {product.shortDesc ||
                    "Classic handcrafted watch strap with sophisticated laconic features, engineered for everyday movement and elegance."}
                </p>
              </div>

              {/* Secondary Angle Preview Card */}
              {product.images.length > 1 && (
                <div className="hidden sm:flex flex-col items-center bg-[#f7f7f9] dark:bg-neutral-900/80 rounded-2xl p-2 border border-border/40 shrink-0 w-36">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-neutral-800">
                    <Image
                      src={
                        product.images[
                          (selectedImageIndex + 1) % product.images.length
                        ].url
                      }
                      alt="Alternate view"
                      fill
                      className="object-contain p-2"
                      sizes="140px"
                    />
                  </div>
                  <div className="flex items-center justify-between w-full mt-2 px-1 text-[11px] text-muted-foreground font-medium">
                    <span>view angle</span>
                    <span className="font-mono text-[10px]">
                      &lsaquo; 0{((selectedImageIndex + 1) % product.images.length) + 1} &rsaquo;
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Stars */}
            {reviewCount > 0 && (
              <StarRating rating={avgRating} size="sm" count={reviewCount} />
            )}

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <Badge className="bg-red-500 text-white border-0 rounded-full px-2.5 py-0.5 text-xs font-bold">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>

            {/* Quantity Counter + Add to Cart Pill (Ref. Mockup Action Row) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Minimal Quantity Counter (- 1 +) */}
              {!isOutOfStock && (
                <div className="flex items-center border border-border/80 rounded-full h-12 bg-[#f7f7f9] dark:bg-neutral-900 px-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={clampedQuantity <= 1}
                    className="size-7 flex items-center justify-center text-foreground hover:opacity-70 transition-opacity disabled:opacity-30"
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">
                    {clampedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(currentStock, q + 1))
                    }
                    disabled={clampedQuantity >= currentStock}
                    className="size-7 flex items-center justify-center text-foreground hover:opacity-70 transition-opacity disabled:opacity-30"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
              )}

              {/* Add to Cart Pill Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold lowercase tracking-wide text-sm transition-all shadow-md gap-2"
              >
                <ShoppingBagIcon size={16} />
                {addedToCart
                  ? "added to cart"
                  : isOutOfStock
                  ? "out of stock"
                  : "add to cart"}
              </Button>
            </div>

            <Separator className="my-2" />

            {/* ── Color Selection Pills ── */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Color Options
                </span>
                <div className="flex items-center gap-2 flex-wrap ml-1 py-1">
                  {uniqueColors.map((c) => {
                    const key = c.color ?? c.colorName ?? "unknown";
                    const isSelected = selectedColor === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleColorSelect(key)}
                        className={cn(
                          "relative w-8 h-8 rounded-full transition-all",
                          isSelected
                            ? "ring-2 ring-offset-2 ring-foreground ring-offset-background"
                            : "ring-1 ring-border hover:scale-105"
                        )}
                        style={{ backgroundColor: c.color ?? "#888888" }}
                        title={c.colorName ?? "Color"}
                      >
                        {isSelected && (
                          <CheckIcon
                            size={14}
                            className={cn(
                              "absolute inset-0 m-auto",
                              c.color === "#FFFFFF" ||
                                c.color === "#ffffff" ||
                                c.color?.toLowerCase() === "white" ||
                                !c.color
                              ? "text-black"
                              : "text-white"
                            )}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Width Selection Pills ── */}
            {uniqueWidths.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Width Sizes
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {uniqueWidths.map((w) => {
                    const isSelected = selectedWidth === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setSelectedWidth(w);
                          setQuantity(1);
                          setShowVariantMessage(false);
                        }}
                        className={cn(
                          "rounded-full px-4 py-1.5 text-xs font-bold transition-all border",
                          isSelected
                            ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                            : "bg-[#f7f7f9] text-black border-transparent hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white"
                        )}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ BOTTOM CHARACTERISTICS & GUARANTEE GRID (Ref. Mockup Specs & Perks) ═══ */}
        <div className="mt-16 pt-10 border-t border-border/40 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Characteristics Table (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold tracking-tight lowercase text-foreground">
              characteristics
            </h3>
            <div className="divide-y divide-border/40 border-y border-border/40 text-xs sm:text-sm">
              {[
                { label: "Item / Model", value: product.name },
                { label: "Material", value: selectedVariant?.material ?? "Premium Authentic" },
                { label: "Strap Type", value: product.strapType ?? "Watch Strap" },
                { label: "Buckle Type", value: product.buckleType ?? "Stainless Steel Clasp" },
                { label: "Width Options", value: uniqueWidths.length > 0 ? uniqueWidths.join(", ") : "Universal" },
                { label: "Watch Type", value: product.watchType ?? "Smartwatch & Analog" },
              ].map((row) => (
                <div key={row.label} className="py-3 flex items-center justify-between">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold text-foreground text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee & Documents Cards (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight lowercase text-foreground mb-3">
                guarantee
              </h3>
              <div className="flex items-center gap-4 rounded-2xl bg-[#f7f7f9] dark:bg-neutral-900/80 p-4 border border-border/40">
                <div className="size-11 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-border/40">
                  <ShieldIcon size={20} className="text-foreground" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">5 Years Warranty</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Comprehensive warranty and repair support on every strap.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight lowercase text-foreground mb-3">
                documents & sizing
              </h3>
              <div className="flex items-center gap-4 rounded-2xl bg-[#f7f7f9] dark:bg-neutral-900/80 p-4 border border-border/40">
                <div className="size-11 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-border/40">
                  <RulerIcon size={20} className="text-foreground" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Sizing Guide & Manual</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Lug width guide (18mm &ndash; 24mm) &amp; fitting instruction manual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* ═══ RELATED PRODUCTS ═══ */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 space-y-6">
            <h2 className="text-2xl font-bold lowercase tracking-tight">
              you may also like
            </h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="shrink-0 w-[260px] sm:w-[280px] snap-start"
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Action Bar (Ref. Nomos & Nixon Mockups) */}
      <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-border/40 py-3.5 px-4 sm:px-8 shadow-2xl mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              total price
            </span>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {formatPrice(displayPrice)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Minimal Quantity counter */}
            {!isOutOfStock && (
              <div className="hidden sm:flex items-center border border-border/80 rounded-full h-11 bg-muted/30 px-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={clampedQuantity <= 1}
                  className="size-6 flex items-center justify-center text-foreground hover:opacity-70 disabled:opacity-30"
                >
                  <MinusIcon size={12} />
                </button>
                <span className="w-6 text-center text-xs font-bold text-foreground">
                  {clampedQuantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(currentStock, q + 1))
                  }
                  disabled={clampedQuantity >= currentStock}
                  className="size-6 flex items-center justify-center text-foreground hover:opacity-70 disabled:opacity-30"
                >
                  <PlusIcon size={12} />
                </button>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="h-11 sm:h-12 rounded-full px-6 sm:px-8 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 font-bold lowercase tracking-wide text-xs sm:text-sm transition-all shadow-lg gap-2"
            >
              <ShoppingBagIcon size={16} />
              {addedToCart
                ? "added to cart"
                : isOutOfStock
                ? "out of stock"
                : "add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}