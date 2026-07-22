"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlistStore, type WishlistItem } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import {
  HeartIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
  TrashIcon,
  ShareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "recently added" },
  { value: "price-asc", label: "price: low to high" },
  { value: "price-desc", label: "price: high to low" },
  { value: "name", label: "name: a to z" },
];

/* ------------------------------------------------------------------ */
/*  Empty State                                                         */
/* ------------------------------------------------------------------ */
function EmptyWishlist() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 lg:py-20">
      {/* Animated heart illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center">
          <HeartIcon size={48} className="text-muted-foreground/40" />
        </div>
        {/* Decorative ring */}
        <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground/10 animate-[spin_20s_linear_infinite]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-center">
        your wishlist is empty
      </h1>
      <p className="text-sm text-muted-foreground mb-2 text-center max-w-md leading-relaxed">
        Start saving your favourite watch straps here. Tap the heart icon on any product to add it to your wishlist.
      </p>
      <p className="text-xs text-muted-foreground/60 mb-8 text-center">
        Items you save will stay here until you remove them or add them to cart.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/shop">
          <Button className="rounded-full h-11 px-8 font-semibold text-sm gap-2">
            explore straps
            <ArrowRightIcon size={16} />
          </Button>
        </Link>
        <Link href="/collections">
          <Button
            variant="outline"
            className="rounded-full h-11 px-8 font-medium text-sm"
          >
            view collections
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wishlist Item Card                                                  */
/* ------------------------------------------------------------------ */
function WishlistItemCard({
  item,
  onRemove,
  onMoveToCart,
}: {
  item: WishlistItem;
  onRemove: () => void;
  onMoveToCart: () => void;
}) {
  const displayPrice = item.salePrice ?? item.price;
  const hasDiscount = item.salePrice !== null && item.salePrice < item.price;
  const savings = hasDiscount ? item.price - (item.salePrice as number) : 0;

  return (
    <div className="group rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30">
      {/* Image */}
      <Link
        href={`/products/${item.slug}`}
        className="block relative aspect-square bg-muted overflow-hidden"
      >
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBagIcon size={28} className="text-muted-foreground/40" />
          </div>
        )}

        {/* Remove button — filled heart state */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "absolute top-3 right-3 flex items-center justify-center size-9 rounded-full backdrop-blur-sm border transition-all duration-200",
            "bg-red-500/90 border-red-400/50 text-white hover:bg-red-600 shadow-lg shadow-red-500/20"
          )}
          aria-label="Remove from wishlist"
        >
          <HeartIcon size={16} className="text-white" />
        </button>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wide">
            -{Math.round((savings / item.price) * 100)}%
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4 space-y-2.5">
        <Link href={`/products/${item.slug}`}>
          <h3 className="font-semibold text-sm truncate text-card-foreground hover:text-lime dark:hover:text-lime transition-colors">
            {item.productName}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-sm text-card-foreground">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.price)}
              </span>
              <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
                save {formatPrice(savings)}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-full h-9 text-xs font-semibold"
            onClick={onMoveToCart}
          >
            <ShoppingBagIcon size={14} className="mr-1" />
            add to cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-9 w-9 p-0 shrink-0 border-border/50 hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:border-red-500/30"
            onClick={onRemove}
            aria-label="Remove"
          >
            <TrashIcon size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Wishlist Page                                                  */
/* ------------------------------------------------------------------ */
export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  /* ---- Derived ---- */
  const totalValue = useMemo(
    () => items.reduce((sum, i) => sum + (i.salePrice ?? i.price), 0),
    [items]
  );
  const totalSavings = useMemo(
    () =>
      items.reduce((sum, i) => {
        if (i.salePrice !== null && i.salePrice < i.price) {
          return sum + (i.price - i.salePrice);
        }
        return sum;
      }, 0),
    [items]
  );

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "name":
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "newest":
      default:
        // items are already in insertion order (newest last), reverse for newest first
        sorted.reverse();
        break;
    }
    return sorted;
  }, [items, sortBy]);

  /* ---- Handlers ---- */
  function handleMoveToCart(item: (typeof items)[0]) {
    addToCart({
      id: `${item.productId}-default`,
      productId: item.productId,
      variantId: "default",
      productName: item.productName,
      productImage: item.productImage,
      variantName: "",
      price: item.price,
      salePrice: item.salePrice,
      quantity: 1,
      stock: 10,
    });
    removeItem(item.productId);
    toast.success("Moved to cart");
  }

  function handleMoveAllToCart() {
    for (const item of items) {
      addToCart({
        id: `${item.productId}-default`,
        productId: item.productId,
        variantId: "default",
        productName: item.productName,
        productImage: item.productImage,
        variantName: "",
        price: item.price,
        salePrice: item.salePrice,
        quantity: 1,
        stock: 10,
      });
    }
    clearAll();
    toast.success(`${items.length} item${items.length > 1 ? "s" : ""} moved to cart`);
  }

  function handleShareWishlist() {
    const text = items
      .map((i) => `${i.productName} — ${formatPrice(i.salePrice ?? i.price)}`)
      .join("\n");
    const shareText = `My Pro Straps Wishlist:\n${text}\n\nShop now: ${window.location.origin}/shop`;

    if (navigator.share) {
      navigator.share({ title: "My Pro Straps Wishlist", text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success("Wishlist copied to clipboard");
      }).catch(() => {
        toast.error("Failed to copy");
      });
    }
  }

  function handleClearAll() {
    clearAll();
    setShowClearConfirm(false);
    toast.success("Wishlist cleared");
  }

  /* ---- Render ---- */
  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "sort";

  return (
    <div className="px-4 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              your wishlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-9 px-4 gap-1.5 text-xs font-medium border-border/50"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                {sortBy === "price-asc" && <ArrowUpIcon size={14} />}
                {sortBy === "price-desc" && <ArrowDownIcon size={14} />}
                {currentSortLabel}
              </Button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-border bg-popover p-1 shadow-lg">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          "flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left",
                          sortBy === opt.value
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50 text-popover-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Share */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-9 px-3 gap-1.5 text-xs font-medium border-border/50"
              onClick={handleShareWishlist}
              aria-label="Share wishlist"
            >
              <ShareIcon size={14} />
              <span className="hidden sm:inline">share</span>
            </Button>

            {/* Continue Shopping */}
            <Link href="/shop" className="hidden sm:block">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-9 px-4 gap-1.5 text-xs font-medium border-border/50"
              >
                continue shopping
                <ArrowRightIcon size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-4 rounded-2xl bg-muted/50 border border-border/30">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">total value</span>
              <p className="font-bold text-foreground">{formatPrice(totalValue)}</p>
            </div>
            {totalSavings > 0 && (
              <div>
                <span className="text-muted-foreground">you save</span>
                <p className="font-bold text-green-600 dark:text-green-400">{formatPrice(totalSavings)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-full h-9 px-5 text-xs font-semibold gap-1.5"
              onClick={handleMoveAllToCart}
            >
              <ShoppingBagIcon size={14} />
              move all to cart
            </Button>

            {/* Clear all with confirmation */}
            {showClearConfirm ? (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-full h-9 px-3 text-xs font-medium"
                  onClick={handleClearAll}
                >
                  confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 px-3 text-xs font-medium border-border/50"
                  onClick={() => setShowClearConfirm(false)}
                >
                  cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-9 px-3 text-xs font-medium text-muted-foreground hover:text-destructive"
                onClick={() => setShowClearConfirm(true)}
              >
                <TrashIcon size={14} className="mr-1" />
                clear all
              </Button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {sortedItems.map((item) => (
            <WishlistItemCard
              key={item.productId}
              item={item}
              onRemove={() => {
                removeItem(item.productId);
                toast.success("Removed from wishlist");
              }}
              onMoveToCart={() => handleMoveToCart(item)}
            />
          ))}
        </div>

        {/* Mobile: Continue shopping at bottom */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/shop" className="block w-full max-w-xs">
            <Button
              variant="outline"
              className="w-full rounded-full h-11 text-sm font-medium gap-2"
            >
              continue shopping
              <ArrowRightIcon size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}