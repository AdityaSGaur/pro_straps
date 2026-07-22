import { WatchIcon } from "@/lib/icons"

type Brand = {
  id: string
  name: string
  slug: string
}

export function BrandsSection({ brands }: { brands: Brand[] }) {
  return (
    <section className="w-full">
      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight lowercase text-foreground mb-8">
        compatible with your watch
      </h2>

      <div className="flex flex-wrap gap-3">
        {brands.map((brand) => (
          <a
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="
              inline-flex items-center gap-2 rounded-full
              border border-border/60 bg-background
              px-5 py-2.5 text-sm font-medium text-foreground
              transition-colors hover:bg-accent hover:text-accent-foreground
              hover:border-accent
            "
          >
            <WatchIcon size={16} className="text-muted-foreground" />
            {brand.name}
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-6">
        and 100+ more watch brands
      </p>
    </section>
  )
}