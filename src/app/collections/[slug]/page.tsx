import { Suspense } from 'react'
import { db } from '@/lib/db'
import { getProducts } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/shared/product-card'
import { CollectionFiltersClient } from '@/components/shared/collection-filters-client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

const PRODUCTS_PER_PAGE = 16

const SORT_LABELS: Record<string, string> = {
  newest: 'Newest First',
  featured: 'Featured',
  'price-asc': 'Price: Low → High',
  'price-desc': 'Price: High → Low',
  rating: 'Top Rated',
  bestselling: 'Best Selling',
}

function parsePriceRange(v: string | null): { priceMin?: number; priceMax?: number } {
  if (!v) return {}
  const [a, b] = v.split('-').map(Number)
  if (isNaN(a)) return {}
  if (isNaN(b)) return { priceMin: a }
  return { priceMin: a, priceMax: b }
}

function buildURL(params: URLSearchParams, overrides: Record<string, string | null>) {
  const next = new URLSearchParams(params.toString())
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null) next.delete(k)
    else next.set(k, v)
  }
  const qs = next.toString()
  return qs ? `?${qs}` : ''
}

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const col = await db.collection.findUnique({ where: { slug }, select: { name: true, description: true } })
  if (!col) return {}
  return {
    title: `${col.name} — Collections`,
    description: col.description ?? `Browse the ${col.name} collection at Pro Straps.`,
  }
}


export default async function SingleCollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const sp       = await searchParams

  // ── Parse search params ────────────────────────────────────────────
  const sort       = typeof sp.sort       === 'string' ? sp.sort       : 'newest'
  const strapType  = typeof sp.strapType  === 'string' ? sp.strapType  : undefined
  const priceRange = typeof sp.priceRange === 'string' ? sp.priceRange : null
  const inStockRaw = typeof sp.inStock    === 'string' ? sp.inStock    : undefined
  const inStock    = inStockRaw === 'true'
  const pageParam  = typeof sp.page       === 'string' ? sp.page       : undefined
  const page       = pageParam ? parseInt(pageParam, 10) : 1

  const { priceMin, priceMax } = parsePriceRange(priceRange)

  // ── Fetch collection meta ──────────────────────────────────────────
  const collection = await db.collection.findUnique({
    where: { slug },
    select: { id: true, name: true, description: true, slug: true },
  })
  if (!collection) notFound()

  // ── Fetch filtered products ────────────────────────────────────────
  const { products, total } = await getProducts({
    collection: slug,
    sort,
    strapType,
    priceMin,
    priceMax,
    inStock: inStock || undefined,
    page,
    limit: PRODUCTS_PER_PAGE,
  })

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)

  // Build a URLSearchParams object for pagination links
  const currentParams = new URLSearchParams()
  if (sort && sort !== 'newest') currentParams.set('sort', sort)
  if (strapType) currentParams.set('strapType', strapType)
  if (priceRange) currentParams.set('priceRange', priceRange)
  if (inStock) currentParams.set('inStock', 'true')
  if (page > 1) currentParams.set('page', String(page))

  const basePath = `/collections/${slug}`

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO BANNER ── */}
      <section className="relative bg-foreground text-background overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22%3E%3C/rect%3E%3C/svg%3E')",
          }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#CCFF00]/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-background/50 hover:text-background text-xs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-background/20" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/collections" className="text-background/50 hover:text-background text-xs">Collections</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-background/20" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-background text-xs">{collection.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-label text-background/40 flex items-center gap-2">
                <span className="size-1 rounded-full bg-[#CCFF00]" /> Collection
              </span>
              <h1 className="text-display font-bold text-background lowercase font-sans">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="text-sm text-background/50 max-w-lg leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:items-end gap-1 shrink-0">
              <span className="text-4xl font-bold text-background">{total}</span>
              <span className="text-label text-background/40">Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Mobile: top bar with filter button + sort info */}
        <div className="flex items-center justify-between mb-6 lg:mb-0">
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger (rendered inside CollectionFiltersClient) */}
            <Suspense fallback={null}>
              <CollectionFiltersClient totalProducts={total} baseSlug={slug} variant="mobile" />
            </Suspense>

            {/* Active filter label */}
            {priceRange || strapType || inStock ? (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Filtered · {total} results
              </span>
            ) : null}
          </div>

          {/* Current sort indicator (desktop) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sorted by:</span>
            <span className="font-semibold text-foreground">{SORT_LABELS[sort] ?? sort}</span>
          </div>
        </div>

        {/* Two-column layout: sidebar (desktop) + product grid */}
        <div className="flex gap-10 xl:gap-14 mt-0 lg:mt-6">
          {/* Desktop sidebar — rendered inside CollectionFiltersClient via sticky aside */}
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <CollectionFiltersClient totalProducts={total} baseSlug={slug} variant="desktop" />
            </Suspense>
          </div>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-border/40 bg-[#F7F7F5] dark:bg-[#111] text-center">
                <div className="size-14 rounded-2xl bg-border/30 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-base font-bold text-foreground lowercase">No products found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Try adjusting your filters to find more products.
                </p>
                <Link
                  href={basePath}
                  className="mt-5 inline-flex items-center rounded-full bg-foreground text-background px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <>
                {/* Result count (mobile) */}
                <p className="text-xs text-muted-foreground mb-5 lg:hidden">
                  {total} {total === 1 ? 'product' : 'products'} · {SORT_LABELS[sort] ?? sort}
                </p>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
                    {page > 1 ? (
                      <Link
                        href={`${basePath}${buildURL(currentParams, { page: String(page - 1) })}`}
                        className="inline-flex items-center justify-center size-10 rounded-full border border-border/60 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        ←
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center size-10 rounded-full border border-border/30 text-sm text-muted-foreground/40 cursor-not-allowed">←</span>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const show = p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)
                      if (!show) {
                        if ((p === 2 && page > 3) || (p === totalPages - 1 && page < totalPages - 2)) {
                          return <span key={p} className="size-10 flex items-center justify-center text-xs text-muted-foreground">···</span>
                        }
                        return null
                      }
                      return (
                        <Link
                          key={p}
                          href={`${basePath}${buildURL(currentParams, { page: String(p) })}`}
                          className={cn(
                            'inline-flex items-center justify-center size-10 rounded-full text-sm font-bold transition-all',
                            p === page
                              ? 'bg-foreground text-background shadow-sm'
                              : 'border border-border/60 text-foreground hover:bg-muted'
                          )}
                        >
                          {p}
                        </Link>
                      )
                    })}

                    {page < totalPages ? (
                      <Link
                        href={`${basePath}${buildURL(currentParams, { page: String(page + 1) })}`}
                        className="inline-flex items-center justify-center size-10 rounded-full border border-border/60 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        →
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center size-10 rounded-full border border-border/30 text-sm text-muted-foreground/40 cursor-not-allowed">→</span>
                    )}
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}