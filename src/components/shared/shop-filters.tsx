'use client'

import React, { useCallback, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { XIcon, ChevronDownIcon, SlidersHorizontalIcon } from "@/lib/icons"
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────

type CategoryOrCollection = {
  name: string
  slug: string
  description?: string | null
}

export type ShopFiltersProps = {
  categories: CategoryOrCollection[]
  collections: CategoryOrCollection[]
  activeFilters: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  onClearFilters?: () => void
}

// ─── Constants ────────────────────────────────────────────────────────

const STRAP_TYPES = [
  'Leather',
  'Silicone',
  'Metal',
  'NATO',
  'Rubber',
  'Fabric',
  'Milanese',
] as const

const PRICE_RANGES = [
  { label: 'Under ₹999', min: 0, max: 998, key: '0-998' },
  { label: '₹999 – ₹1,499', min: 999, max: 1499, key: '999-1499' },
  { label: '₹1,500 – ₹2,499', min: 1500, max: 2499, key: '1500-2499' },
  { label: '₹2,500 – ₹3,999', min: 2500, max: 3999, key: '2500-3999' },
  { label: '₹4,000+', min: 4000, max: 99999, key: '4000-99999' },
] as const

// ─── Active Filter Chips ──────────────────────────────────────────────

function ActiveFilterChips({
  activeFilters,
  categories,
  collections,
  onRemove,
  onClearAll,
}: {
  activeFilters: Record<string, string>
  categories: CategoryOrCollection[]
  collections: CategoryOrCollection[]
  onRemove: (key: string) => void
  onClearAll: () => void
}) {
  const chips: { key: string; label: string }[] = []

  if (activeFilters.category) {
    const cat = categories.find((c) => c.slug === activeFilters.category)
    chips.push({ key: 'category', label: cat?.name ?? activeFilters.category })
  }
  if (activeFilters.collection) {
    const col = collections.find((c) => c.slug === activeFilters.collection)
    chips.push({ key: 'collection', label: col?.name ?? activeFilters.collection })
  }
  if (activeFilters.strapType) {
    chips.push({ key: 'strapType', label: activeFilters.strapType })
  }
  if (activeFilters.priceRange) {
    const range = PRICE_RANGES.find((r) => r.key === activeFilters.priceRange)
    chips.push({ key: 'priceRange', label: range?.label ?? activeFilters.priceRange })
  }
  if (activeFilters.inStock === 'true') {
    chips.push({ key: 'inStock', label: 'In Stock' })
  }
  if (activeFilters.q) {
    chips.push({ key: 'q', label: `"${activeFilters.q}"` })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 text-lime-foreground border border-lime/20 px-3 py-1 text-xs font-medium transition-colors hover:bg-lime/25"
        >
          {chip.label}
          <XIcon size={12} />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}

// ─── Collapsible Filter Section ───────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground group"
      >
        {title}
          <ChevronDownIcon
            size={16}
            className={cn(
              "text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
        />
      </button>
      {open && <div className="space-y-1.5">{children}</div>}
    </div>
  )
}

// ─── Main Shop Filters Component ──────────────────────────────────────

export function ShopFilters({
  categories,
  collections,
  activeFilters,
}: ShopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      // Reset page when filters change
      params.delete('page')

      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      // For category, collection, strapType, priceRange — toggle behavior
      if (['category', 'collection', 'strapType', 'priceRange'].includes(key)) {
        const currentValue = searchParams.get(key)
        if (currentValue === value) {
          updateURL({ [key]: null })
        } else {
          updateURL({ [key]: value })
        }
      } else {
        updateURL({ [key]: value })
      }
    },
    [searchParams, updateURL]
  )

  const handleClearFilters = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const handleRemoveFilter = useCallback(
    (key: string) => {
      updateURL({ [key]: null })
    },
    [updateURL]
  )

  const isActive = (key: string, value: string) => {
    return searchParams.get(key) === value
  }

  const inStock = searchParams.get('inStock') === 'true'

  const pillClass = (active: boolean) =>
    cn(
      'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 border',
      active
        ? 'bg-lime text-black border-lime'
        : 'bg-transparent text-foreground/70 border-border/60 hover:border-foreground/30 hover:text-foreground'
    )

  return (
    <div className="space-y-6">
      {/* Active filters */}
      <ActiveFilterChips
        activeFilters={activeFilters}
        categories={categories}
        collections={collections}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearFilters}
      />

      {/* Categories */}
      {categories.length > 0 && (
        <>
          <FilterSection title="Categories">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleFilterChange('category', cat.slug)}
                  className={pillClass(isActive('category', cat.slug))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </FilterSection>
          <Separator />
        </>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <>
          <FilterSection title="Collections">
            <div className="flex flex-wrap gap-1.5">
              {collections.map((col) => (
                <button
                  key={col.slug}
                  onClick={() => handleFilterChange('collection', col.slug)}
                  className={pillClass(isActive('collection', col.slug))}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </FilterSection>
          <Separator />
        </>
      )}

      {/* Strap Type */}
      <FilterSection title="Strap Type">
        <div className="flex flex-wrap gap-1.5">
          {STRAP_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange('strapType', type)}
              className={pillClass(isActive('strapType', type))}
            >
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.key}
              onClick={() => handleFilterChange('priceRange', range.key)}
              className={cn(
                'flex items-center w-full rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150 text-left',
                isActive('priceRange', range.key)
                  ? 'bg-lime/10 text-foreground'
                  : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <span
                className={cn(
                  'mr-2.5 size-2.5 rounded-full border-2 shrink-0 transition-colors',
                  isActive('priceRange', range.key)
                    ? 'border-lime bg-lime'
                    : 'border-border'
                )}
              />
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Availability */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="in-stock-filter"
          className="text-sm font-semibold text-foreground cursor-pointer"
        >
          In Stock Only
        </label>
        <Switch
          id="in-stock-filter"
          checked={inStock}
          onCheckedChange={(checked) =>
            updateURL({ inStock: checked ? 'true' : null })
          }
        />
      </div>
    </div>
  )
}

// ─── Sort Selector (client component for URL-based sort) ──────────────

export function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'bestselling', label: 'Bestselling' },
  ]

  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none bg-transparent border border-border/60 rounded-full pl-4 pr-10 py-2 text-xs font-medium text-foreground cursor-pointer hover:border-foreground/30 transition-colors focus:outline-none focus:ring-2 focus:ring-lime/30 focus:border-lime"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background text-foreground">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
    </div>
  )
}

// ─── Mobile Filter Sheet Wrapper ──────────────────────────────────────

export function MobileFilterSheet({
  categories,
  collections,
  activeFilters,
}: ShopFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="md:hidden rounded-full gap-2 border-border/60"
      >
        <SlidersHorizontalIcon className="size-3.5" />
        Filters
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-lg font-bold tracking-tight lowercase">
              Filters
            </SheetTitle>
            <SheetDescription>
              Narrow down your search to find the perfect strap.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 pb-8">
            <ShopFilters
              categories={categories}
              collections={collections}
              activeFilters={activeFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}