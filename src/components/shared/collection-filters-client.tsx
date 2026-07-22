'use client'

import { useCallback, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { XIcon, SlidersHorizontalIcon, ChevronDownIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

// ─── Constants ─────────────────────────────────────────────────────────

const PRICE_RANGES = [
  { label: 'All Prices',      key: null,          desc: '' },
  { label: 'Under ₹999',      key: '0-998',       desc: '₹0 – ₹998' },
  { label: '₹999 – ₹1,499',  key: '999-1499',    desc: '' },
  { label: '₹1,500 – ₹2,499',key: '1500-2499',   desc: '' },
  { label: '₹2,500 – ₹3,999',key: '2500-3999',   desc: '' },
  { label: '₹4,000+',        key: '4000-99999',  desc: 'Premium range' },
] as const

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest First'       },
  { value: 'featured',    label: 'Featured'           },
  { value: 'price-asc',   label: 'Price: Low → High'  },
  { value: 'price-desc',  label: 'Price: High → Low'  },
  { value: 'rating',      label: 'Top Rated'          },
  { value: 'bestselling', label: 'Best Selling'       },
] as const

const STRAP_TYPES = [
  'Leather', 'Silicone', 'Metal', 'NATO', 'Rubber', 'Fabric', 'Milanese',
] as const

// ─── CollapsibleBlock ──────────────────────────────────────────────────

function CollapsibleBlock({
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
    <div className="border-b border-border/40 pb-5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground"
      >
        <span>{title}</span>
        <ChevronDownIcon
          size={15}
          className={cn('text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && <div className="mt-2 space-y-1.5">{children}</div>}
    </div>
  )
}

// ─── Pill button helper ─────────────────────────────────────────────────

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 border',
        active
          ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
          : 'bg-transparent text-foreground/70 border-border/60 hover:border-foreground/30 hover:text-foreground'
      )}
    >
      {children}
    </button>
  )
}

// ─── Main CollectionFiltersClient ─────────────────────────────────────

export function CollectionFiltersClient({
  totalProducts,
  baseSlug,
  variant,
}: {
  totalProducts: number
  baseSlug: string
  variant: 'mobile' | 'desktop'
}) {
  const router     = useRouter()
  const pathname   = usePathname()
  const rawParams  = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  // ── URL helpers ────────────────────────────────────────────────────

  const updateURL = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(rawParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      }
      params.delete('page')
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, rawParams]
  )

  const toggle = (key: string, value: string) => {
    const cur = rawParams.get(key)
    updateURL({ [key]: cur === value ? null : value })
  }

  const clearAll = () => router.push(pathname, { scroll: false })

  // ── Active state helpers ───────────────────────────────────────────

  const is = (key: string, value: string) => rawParams.get(key) === value
  const activeSort      = rawParams.get('sort')      ?? 'newest'
  const activePriceKey  = rawParams.get('priceRange') ?? null
  const activeStrapType = rawParams.get('strapType')  ?? null
  const inStock         = rawParams.get('inStock') === 'true'

  const hasFilters = activePriceKey || activeStrapType || inStock || (activeSort && activeSort !== 'newest')

  // ── Active chips ──────────────────────────────────────────────────

  const activeChips: { key: string; label: string }[] = []
  if (activePriceKey) {
    const range = PRICE_RANGES.find((r) => r.key === activePriceKey)
    if (range) activeChips.push({ key: 'priceRange', label: range.label })
  }
  if (activeStrapType) activeChips.push({ key: 'strapType', label: activeStrapType })
  if (inStock)         activeChips.push({ key: 'inStock',   label: 'In Stock Only' })

  // ─── Filter Panel (shared between desktop & mobile) ──────────────

  const FilterPanel = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon size={14} className="text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">Filters</span>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-4 border-b border-border/40">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => updateURL({ [chip.key]: null })}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#CCFF00]/15 text-foreground border border-[#CCFF00]/30 px-3 py-1 text-xs font-medium hover:bg-[#CCFF00]/25 transition-colors"
            >
              {chip.label}
              <XIcon size={11} />
            </button>
          ))}
        </div>
      )}

      {/* Sort */}
      <CollapsibleBlock title="Sort By">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => updateURL({ sort: opt.value === 'newest' ? null : opt.value })}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all text-left',
              activeSort === opt.value
                ? 'bg-[#CCFF00]/10 text-foreground font-semibold'
                : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground font-medium'
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full border-2 shrink-0 transition-colors',
                activeSort === opt.value ? 'border-[#CCFF00] bg-[#CCFF00]' : 'border-border'
              )}
            />
            {opt.label}
          </button>
        ))}
      </CollapsibleBlock>

      {/* Price Range */}
      <CollapsibleBlock title="Price Range">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.key ?? 'all'}
            type="button"
            onClick={() => updateURL({ priceRange: range.key ?? null })}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all text-left',
              (range.key === null ? !activePriceKey : activePriceKey === range.key)
                ? 'bg-[#CCFF00]/10 text-foreground font-semibold'
                : 'text-foreground/70 hover:bg-muted/50 hover:text-foreground font-medium'
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full border-2 shrink-0 transition-colors',
                (range.key === null ? !activePriceKey : activePriceKey === range.key)
                  ? 'border-[#CCFF00] bg-[#CCFF00]'
                  : 'border-border'
              )}
            />
            <span className="flex-1">{range.label}</span>
          </button>
        ))}

        {/* Price bucket visual bar */}
        <div className="mt-4 px-1">
          <div className="flex items-end gap-0.5 h-8">
            {[30, 55, 80, 65, 40, 25, 15].map((h, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-sm transition-colors',
                  activePriceKey ? 'bg-[#CCFF00]/60' : 'bg-border/60'
                )}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground/60">₹0</span>
            <span className="text-[10px] text-muted-foreground/60">₹4,000+</span>
          </div>
        </div>
      </CollapsibleBlock>

      {/* Strap Type */}
      <CollapsibleBlock title="Strap Type">
        <div className="flex flex-wrap gap-1.5 pt-1">
          {STRAP_TYPES.map((type) => (
            <FilterPill
              key={type}
              active={activeStrapType === type}
              onClick={() => toggle('strapType', type)}
            >
              {type}
            </FilterPill>
          ))}
        </div>
      </CollapsibleBlock>

      {/* Availability */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => updateURL({ inStock: inStock ? null : 'true' })}
          className="flex items-center gap-3 w-full"
        >
          <div
            className={cn(
              'relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0',
              inStock ? 'bg-[#CCFF00]' : 'bg-border'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-300',
                inStock ? 'translate-x-5' : 'translate-x-0.5'
              )}
            />
          </div>
          <span className="text-sm font-medium text-foreground">In Stock Only</span>
        </button>
      </div>

      {/* Total count */}
      <div className="pt-4 mt-2 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center">
          {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
        </p>
      </div>
    </div>
  )

  if (variant === 'desktop') {
    return (
      <aside className="sticky top-24 self-start w-56 xl:w-64 shrink-0">
        <FilterPanel />
      </aside>
    )
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold border transition-all',
          hasFilters
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background text-foreground border-border/60 hover:border-foreground/40'
        )}
      >
        <SlidersHorizontalIcon size={13} />
        Filter {hasFilters && `(${activeChips.length})`}
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="relative ml-auto w-[85vw] max-w-sm bg-background h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground lowercase">filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="size-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <XIcon size={14} />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  )
}

