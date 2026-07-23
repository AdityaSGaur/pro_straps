import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Watch Straps',
  description: 'Shop premium watch straps at Pro Straps. Leather, silicone, metal, NATO, and more. Filter by price, strap type, and brand compatibility.',
}


import { getProducts, getCategories, getCollections } from '@/lib/data'
import { InfiniteProductGrid } from '@/components/shared/infinite-product-grid'
import {
  ShopFilters,
  SortSelector,
  MobileFilterSheet,
} from '@/components/shared/shop-filters'
import { cn } from '@/lib/utils'

const PRODUCTS_PER_PAGE = 12

const CATEGORY_PILLS = [
  { label: 'all straps', category: null },
  { label: 'leather', category: 'leather' },
  { label: 'silicone', category: 'silicone' },
  { label: 'metal', category: 'metal' },
  { label: 'nato', category: 'nato' },
]

function parsePriceRange(
  priceRange: string | null
): { priceMin?: number; priceMax?: number } {
  if (!priceRange) return {}
  const [minStr, maxStr] = priceRange.split('-')
  const min = parseInt(minStr, 10)
  const max = parseInt(maxStr, 10)
  if (isNaN(min)) return {}
  if (isNaN(max)) return { priceMin: min }
  return { priceMin: min, priceMax: max }
}

function buildQueryString(params: URLSearchParams, overrides: Record<string, string | null>) {
  const next = new URLSearchParams(params.toString())
  for (const [key, value] of Object.entries(overrides)) {
    if (value === null) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  }
  const qs = next.toString()
  return qs ? `/shop?${qs}` : '/shop'
}

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams

  const category = typeof params.category === 'string' ? params.category : undefined
  const collection = typeof params.collection === 'string' ? params.collection : undefined
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'
  const q = typeof params.q === 'string' ? params.q : undefined
  const strapType = typeof params.strapType === 'string' ? params.strapType : undefined
  const priceRange = typeof params.priceRange === 'string' ? params.priceRange : null
  const inStockParam = typeof params.inStock === 'string' ? params.inStock : undefined
  const inStock = inStockParam === 'true'
  const pageParam = typeof params.page === 'string' ? params.page : undefined
  const page = pageParam ? parseInt(pageParam, 10) : 1

  const { priceMin, priceMax } = parsePriceRange(priceRange)

  const [productsData, categories, collections] = await Promise.all([
    getProducts({
      category,
      collection,
      sort,
      search: q,
      strapType,
      priceMin,
      priceMax,
      inStock: inStock || undefined,
      page,
      limit: PRODUCTS_PER_PAGE,
    }),
    getCategories(),
    getCollections(),
  ])

  const { products, total } = productsData
  const searchParamsObj = new URLSearchParams()

  if (category) searchParamsObj.set('category', category)
  if (collection) searchParamsObj.set('collection', collection)
  if (sort && sort !== 'newest') searchParamsObj.set('sort', sort)
  if (q) searchParamsObj.set('q', q)
  if (strapType) searchParamsObj.set('strapType', strapType)
  if (priceRange) searchParamsObj.set('priceRange', priceRange)
  if (inStock) searchParamsObj.set('inStock', 'true')
  if (page > 1) searchParamsObj.set('page', String(page))

  const activeFilters: Record<string, string> = {}
  if (category) activeFilters.category = category
  if (collection) activeFilters.collection = collection
  if (q) activeFilters.q = q
  if (strapType) activeFilters.strapType = strapType
  if (priceRange) activeFilters.priceRange = priceRange
  if (inStock) activeFilters.inStock = 'true'

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* ── Page Header (Ref. Nixon Catalog) ── */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase text-foreground">
            CATALOG
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {total} {total === 1 ? 'item' : 'items'} available
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MobileFilterSheet
            categories={categories}
            collections={collections}
            activeFilters={activeFilters}
          />
          <Suspense fallback={null}>
            <SortSelector currentSort={sort} />
          </Suspense>
        </div>
      </div>

      {/* ── Category Capsule Pill Filter Bar (Ref. Nomos Shop) ── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-8 pb-2">
        {CATEGORY_PILLS.map((pill) => {
          const isSelected =
            pill.category === null
              ? !category
              : category === pill.category || category?.startsWith(pill.category)

          const targetHref = buildQueryString(searchParamsObj, {
            category: pill.category,
            page: null,
          })

          return (
            <Link
              key={pill.label}
              href={targetHref}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-bold transition-all shrink-0 border',
                isSelected
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-sm'
                  : 'bg-[#f7f7f9] text-muted-foreground border-transparent hover:text-foreground dark:bg-neutral-800'
              )}
            >
              {pill.label}
            </Link>
          )
        })}
      </div>

      {/* ── Full Width Ultra-Clean Product Grid ── */}
      <main className="w-full">
        {products.length > 0 ? (
          <InfiniteProductGrid
            initialProducts={products}
            total={total}
            limit={PRODUCTS_PER_PAGE}
            activeFilters={activeFilters}
            sort={sort}
          />
        ) : (
          <div className="text-center py-20 bg-[#f7f7f9] dark:bg-neutral-900/60 rounded-3xl border border-border/40">
            <h3 className="text-lg font-bold text-foreground lowercase">
              no products found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your search query or filter tags to find what you are looking for.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 text-xs font-bold lowercase tracking-wider"
            >
              clear all filters
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
