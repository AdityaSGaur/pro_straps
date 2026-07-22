import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@/lib/icons'

const COLLECTION_IMAGES: Record<string, string> = {
  essentials: '/products/chain_straps/chain_straps_black_v1.png',
  premium: '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  sport: '/products/synthetic_&_rubber_straps/w1.jpg',
  'new-arrivals': '/products/chain_straps/Titanium-Edition-Band-For-Apple-Watch-49464544-MM-5.webp',
  leather: '/products/chain_straps/Whisk_2c5f31ee9e25fa383564f044f09d9024dr.jpeg',
  silicone: '/products/synthetic_&_rubber_straps/w2.webp',
  metal: '/products/chain_straps/chain_straps_silver_v1.jpg',
  nato: '/products/synthetic_&_rubber_straps/w1.jpg',
  titanium: '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  milanese: '/products/chain_straps/f-shgcdn-645cf54f67795.webp',
}

const FALLBACK_IMAGES = [
  '/products/chain_straps/chain_straps_black_v1.png',
  '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  '/products/synthetic_&_rubber_straps/w1.jpg',
  '/products/chain_straps/Titanium-Edition-Band-For-Apple-Watch-49464544-MM-5.webp',
  '/products/chain_straps/Whisk_a21debfae9faa82bb4b4329dcb29d761dr.jpeg',
  '/products/chain_straps/f-shgcdn-645cf54f67795.webp',
]

export const metadata = {
  title: 'Collections',
  description: 'Browse all Pro Straps curated collections — leather, silicone, metal, NATO and more.',
}


export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  })

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section className="relative w-full bg-foreground text-background overflow-hidden">
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22%3E%3C/rect%3E%3C/svg%3E')",
          }}
        />
        {/* Lime glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#CCFF00]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col gap-4">
              <span className="text-label text-background/40 flex items-center gap-2">
                <span className="size-1 rounded-full bg-[#CCFF00]" />
                Curated Selections
              </span>
              <h1 className="text-display font-bold text-background lowercase font-sans">
                all<br />collections
              </h1>
              <p className="text-sm text-background/50 max-w-sm leading-relaxed">
                Each collection is designed for a different wrist — a different style, occasion, and story.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:items-end shrink-0">
              <div className="text-4xl font-bold text-background">{collections.length}</div>
              <span className="text-label text-background/40">Collections</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-muted-foreground">No collections yet. Check back soon.</p>
            <Link href="/shop" className="mt-4 text-sm font-semibold text-foreground underline underline-offset-4">
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Hero collection — first item full width */}
            {collections.length > 0 && (() => {
              const hero = collections[0]
              const heroImg =
                COLLECTION_IMAGES[hero.slug.toLowerCase()] ||
                COLLECTION_IMAGES[hero.name.toLowerCase()] ||
                FALLBACK_IMAGES[0]
              return (
                <Link
                  href={`/collections/${hero.slug}`}
                  className="group relative w-full flex overflow-hidden rounded-[2.5rem] h-[340px] sm:h-[420px] lg:h-[500px] mb-4 sm:mb-6 bg-black"
                >
                  <Image
                    src={heroImg}
                    alt={hero.name}
                    fill
                    priority
                    className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                    sizes="100vw"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  {/* Decorative lines */}
                  <div className="absolute top-8 left-10 right-10 h-px bg-white/10" />
                  <div className="absolute bottom-8 left-10 right-10 h-px bg-white/10" />
                  {/* Label */}
                  <span className="absolute top-8 left-10 text-label text-white/40">01</span>
                  <span className="absolute top-8 right-10 text-label text-white/40">Pro Straps™</span>

                  {/* Bottom content */}
                  <div className="relative z-10 mt-auto p-8 sm:p-12 flex items-end justify-between w-full gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-label text-[#CCFF00]">Featured Collection</span>
                      <h2 className="text-title font-bold text-white lowercase font-sans">{hero.name}</h2>
                      {hero.description && (
                        <p className="text-sm text-white/60 max-w-sm line-clamp-2">{hero.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <div className="size-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all duration-300">
                        <ArrowRightIcon size={16} className="text-white group-hover:text-black transition-colors" />
                      </div>
                      <span className="text-label text-white/40">{hero._count.products} products</span>
                    </div>
                  </div>
                </Link>
              )
            })()}

            {/* Rest — responsive masonry-style grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collections.slice(1).map((col, idx) => {
                const img =
                  COLLECTION_IMAGES[col.slug.toLowerCase()] ||
                  COLLECTION_IMAGES[col.name.toLowerCase()] ||
                  FALLBACK_IMAGES[(idx + 1) % FALLBACK_IMAGES.length]

                // Alternate tall/short for visual rhythm
                const isTall = idx % 3 === 1
                return (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    className={`group relative overflow-hidden rounded-3xl bg-black ${isTall ? 'h-[380px] sm:h-[460px]' : 'h-[280px] sm:h-[340px]'}`}
                  >
                    <Image
                      src={img}
                      alt={col.name}
                      fill
                      className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-85 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                    {/* Index number */}
                    <span className="absolute top-5 right-5 text-label text-white/30">
                      {String(idx + 2).padStart(2, '0')}
                    </span>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-2">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-base sm:text-lg font-bold text-white lowercase tracking-tight">{col.name}</h2>
                        {col.description && (
                          <p className="text-xs text-white/50 line-clamp-1 max-w-[200px]">{col.description}</p>
                        )}
                        <span className="text-label text-white/30 mt-1">{col._count.products} products</span>
                      </div>
                      <div className="size-9 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-[#CCFF00] group-hover:border-[#CCFF00] transition-all duration-300">
                        <ArrowRightIcon size={13} className="text-white group-hover:text-black transition-colors" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}