'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, ArrowLeft2Icon, ArrowRight2Icon } from '@/lib/icons'
import { ProductCard } from './product-card'
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
    id: string; sku: string; color: string | null; colorName: string | null
    width: string | null; price: number; salePrice: number | null
    stock: number; isActive: boolean
  }[]
  categories: { categoryId: string; category: { id: string; name: string; slug: string } }[]
  collections: { collectionId: string; collection: { id: string; name: string; slug: string } }[]
}

export function ProductGrid({
  products,
  title,
  subtitle,
  viewAllHref,
}: {
  products: ProductWithDetails[]
  title?: string
  subtitle?: string
  viewAllHref?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [products])

  const handleScroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section className="w-full py-20 sm:py-28 border-t border-border/40">
      {/* Header row */}
      {(title || viewAllHref) && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-10 sm:mb-14"
        >
          <div className="flex flex-col gap-3">
            <span className="text-label text-muted-foreground flex items-center gap-2">
              <span className="size-1 rounded-full bg-[#CCFF00]" /> Collection
            </span>
            {title && (
              <h2 className="text-display font-bold text-foreground lowercase font-sans">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors mr-2"
              >
                View All <ArrowRightIcon size={13} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous"
              className="size-10 rounded-full border border-border/60 flex items-center justify-center text-foreground/60 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ArrowLeft2Icon size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next"
              className="size-10 rounded-full border border-border/60 flex items-center justify-center text-foreground/60 hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ArrowRight2Icon size={15} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Horizontal scroll carousel with gradient edge masks */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.07 }}
              className="w-[220px] sm:w-[240px] lg:w-[260px] shrink-0"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Left fade gradient overlay */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 sm:w-12 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/70 pointer-events-none z-10" />
        )}

        {/* Right fade gradient overlay */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 sm:w-12 bg-gradient-to-l from-white via-white/70 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/70 pointer-events-none z-10" />
        )}
      </div>
    </section>
  )
}