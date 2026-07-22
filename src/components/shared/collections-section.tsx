import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, WatchIcon, ShieldIcon, AwardIcon, TrendingUpIcon } from '@/lib/icons'

type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
}

const COLLECTION_IMAGES: Record<string, string> = {
  essentials: '/products/chain_straps/chain_straps_black_v1.png',
  premium: '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  sport: '/products/synthetic_&_rubber_straps/w1.jpg',
  'new-arrivals': '/products/chain_straps/Titanium-Edition-Band-For-Apple-Watch-49464544-MM-5.webp',
  leather: '/ui-ux/appui-019d78ed-8ec2-73e8-87fe-65a9bbef5caa.png',
  silicone: '/products/synthetic_&_rubber_straps/w2.webp',
  metal: '/products/chain_straps/chain_straps_silver_v1.jpg',
  nato: '/ui-ux/appui3-019d78ed-8ce4-7448-aadb-1d9881eae4b0.png',
}

const FALLBACK_IMAGES = [
  '/products/chain_straps/chain_straps_black_v1.png',
  '/products/chain_straps/Matte-Titanium-Band-For-Apple-Watch-45-25.webp',
  '/products/synthetic_&_rubber_straps/w1.jpg',
  '/products/chain_straps/Titanium-Edition-Band-For-Apple-Watch-49464544-MM-5.webp',
]

const CATEGORY_ICONS = [WatchIcon, ShieldIcon, TrendingUpIcon, AwardIcon]

export function CollectionsSection({
  collections,
}: {
  collections: Collection[]
}) {
  const displayCollections = collections.slice(0, 4)

  return (
    <section className="w-full py-6">
      {/* Header */}
      <div className="flex flex-col mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight lowercase text-foreground font-sans">
          collections & advantages
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          more than a strap — your partner in wrist style and performance
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCollections.map((col, idx) => {
          const Icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length]
          const imageUrl =
            COLLECTION_IMAGES[col.slug.toLowerCase()] ||
            COLLECTION_IMAGES[col.name.toLowerCase()] ||
            FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]

          return (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group flex flex-col transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Image & Floating Badge Wrapper */}
              <div className="relative">
                {/* Overflow Clipped Image Container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 shadow-md border border-neutral-200/60 dark:border-neutral-800">
                  <Image
                    src={imageUrl}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Center Floating Icon Badge (Unclipped) */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 size-11 rounded-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
                  <Icon size={18} />
                </div>
              </div>

              {/* Bottom Content Box */}
              <div className="bg-[#f5f5f7] dark:bg-[#18181b] rounded-2xl pt-8 pb-6 px-5 text-center flex flex-col items-center gap-1.5 mt-[-10px] flex-1 border border-neutral-200/50 dark:border-neutral-800/80 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-neutral-300 dark:group-hover:border-neutral-700">
                <h3 className="font-bold text-sm lg:text-base tracking-wide uppercase text-foreground">
                  {col.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 max-w-[220px] leading-relaxed">
                  {col.description || 'Premium craftsmanship designed for daily elegance and durability.'}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground underline underline-offset-4 group-hover:text-lime transition-colors mt-3">
                  explore collection
                  <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}