import {
  getFeaturedProducts,
  getBestsellerProducts,
  getCollections,
} from "@/lib/data";
import { HeroSection }             from "@/components/shared/hero-section";
import { FeaturedProductSection }  from "@/components/shared/featured-product-section";
import { MaterialsSection }        from "@/components/shared/materials-section";
import { ProductGrid }             from "@/components/shared/product-grid";
import { LifestyleBannerSection }  from "@/components/shared/lifestyle-banner-section";
import { WhyProStrapsSection }     from "@/components/shared/why-prostraps-section";
import { TestimonialsSection }     from "@/components/shared/testimonials-section";
import { CollectionsSection }      from "@/components/shared/collections-section";
import { NewsletterSection }       from "@/components/shared/newsletter-section";

export const metadata = {
  title: "Pro Straps | Premium Watch Straps Handcrafted in India",
  description:
    "Discover luxury watch straps for Apple Watch, Fossil, Garmin, Seiko, and more. Full-grain leather, silicone, titanium, and NATO straps. 5-year warranty.",
};


export default async function HomePage() {
  const [featured, bestsellers, collections] = await Promise.all([
    getFeaturedProducts(),
    getBestsellerProducts(),
    getCollections(),
  ]);

  const displayProducts  = featured.length > 0    ? featured    : bestsellers;
  const bestsellerDisplay = bestsellers.length > 0 ? bestsellers : featured;

  return (
    <main className="w-full overflow-hidden">
      {/* ── 1. EDITORIAL HERO ── */}
      <HeroSection />

      {/* ── Padded content container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 2. FEATURED PRODUCT CALLOUT ── */}
        <FeaturedProductSection />

        {/* ── 3. SHOP BY MATERIAL ── */}
        <MaterialsSection />

        {/* ── 4. PRODUCT CAROUSEL: Featured ── */}
        {displayProducts.length > 0 && (
          <ProductGrid
            products={displayProducts}
            title="new arrivals"
            subtitle="Handpicked from our latest additions"
            viewAllHref="/shop"
          />
        )}

        {/* ── 5. LIFESTYLE BANNER ── */}
        <LifestyleBannerSection />

        {/* ── 6. WHY PRO STRAPS ── */}
        <WhyProStrapsSection />

        {/* ── 7. BESTSELLERS CAROUSEL ── */}
        {bestsellerDisplay.length > 0 && (
          <ProductGrid
            products={bestsellerDisplay}
            title="bestsellers"
            subtitle="The favourites — loved by thousands"
            viewAllHref="/shop?sort=bestseller"
          />
        )}

        {/* ── 8. COLLECTIONS GRID ── */}
        {collections.length > 0 && (
          <CollectionsSection collections={collections} />
        )}

        {/* ── 9. TESTIMONIALS ── */}
        <TestimonialsSection />

        {/* ── 10. NEWSLETTER ── */}
        <NewsletterSection />
      </div>
    </main>
  );
}