'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from "@/lib/icons"
import { useWishlistStore } from '@/stores/wishlist-store'
import { StarRating } from '@/components/shared/star-rating'
import { cn } from '@/lib/utils'

type ProductWithDetails = {
  id: string
  name: string
  slug: string
  shortDesc: string | null
  basePrice: number
  salePrice: number | null
  sku: string
  strapType: string | null
  isFeatured: boolean
  isNewArrival: boolean
  isBestseller: boolean
  status: string
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[]
  variants: {
    id: string
    sku: string
    color: string | null
    colorName: string | null
    width: string | null
    price: number
    salePrice: number | null
    stock: number
    isActive: boolean
  }[]
  categories: {
    categoryId: string
    category: { id: string; name: string; slug: string }
  }[]
  collections: {
    collectionId: string
    collection: { id: string; name: string; slug: string }
  }[]
  _avgRating?: number
  _reviewCount?: number
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getDiscountPercent(base: number, sale: number): number {
  return Math.round(((base - sale) / base) * 100)
}

function getUniqueColors(
  variants: ProductWithDetails['variants']
): { color: string | null; colorName: string | null }[] {
  const seen = new Set<string>()
  const unique: { color: string | null; colorName: string | null }[] = []
  for (const v of variants) {
    if (!v.isActive) continue
    const key = v.color ?? v.colorName ?? 'unknown'
    if (!seen.has(key)) {
      seen.add(key)
      unique.push({ color: v.color, colorName: v.colorName })
    }
  }
  return unique
}

export function ProductCard({ product }: { product: ProductWithDetails }) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0]
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  const colors = getUniqueColors(product.variants)
  const hasDiscount = product.salePrice !== null && product.salePrice < product.basePrice
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.basePrice, product.salePrice as number)
    : 0
  const displayPrice = product.salePrice ?? product.basePrice
  const avgRating = product._avgRating ?? 0
  const reviewCount = product._reviewCount ?? 0

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="rounded-3xl border border-neutral-200/60 dark:border-neutral-800/80 bg-[#f7f7f9] dark:bg-neutral-900/80 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40 hover:-translate-y-1 flex flex-col justify-between h-full">
        {/* Centered Image Showcase Stage */}
        <div className="relative aspect-square rounded-2xl bg-white dark:bg-neutral-800/60 overflow-hidden flex items-center justify-center p-3 border border-neutral-100 dark:border-neutral-800">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt ?? product.name}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}

          {/* Badges - top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestseller && (
              <span className="inline-flex items-center rounded-full bg-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                bestseller
              </span>
            )}
            {product.isNewArrival && !product.isBestseller && (
              <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-black dark:text-white uppercase tracking-wider border border-border/30">
                new
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Heart Button - top right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleItem({
                productId: product.id,
                productName: product.name,
                productImage: primaryImage?.url ?? '',
                price: product.basePrice,
                salePrice: product.salePrice,
                slug: product.slug,
              })
            }}
            className={cn(
              "absolute top-3 right-3 flex items-center justify-center size-8 rounded-full backdrop-blur-md border transition-all duration-200 z-10",
              inWishlist
                ? "bg-red-500 text-white border-red-500 scale-100 shadow-md"
                : "bg-white/80 dark:bg-neutral-800/80 border-border/20 text-foreground hover:bg-white dark:hover:bg-neutral-700 hover:scale-110"
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon
              size={15}
              className={cn(inWishlist && "fill-current")}
            />
          </button>
        </div>

        {/* Product Details & Price */}
        <div className="pt-3.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>{product.strapType || "Strap"}</span>
            {reviewCount > 0 && (
              <span className="flex items-center gap-1 font-semibold text-foreground">
                ★ {avgRating.toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight lowercase line-clamp-1 group-hover:text-muted-foreground transition-colors">
            {product.name}
          </h3>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-base sm:text-lg text-foreground">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through font-medium">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-foreground group-hover:underline underline-offset-4">
              Buy &rsaquo;
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}