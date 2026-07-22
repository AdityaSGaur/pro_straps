import {
  getProductBySlug,
  getRelatedProducts,
  getCategories,
  getWatchBrands,
  getProductReviews,
  getAllProductSlugs,
  getProductCompatibilities,
} from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";
import type { Metadata } from "next";

// ─── Static Params ────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return {
    title: product.metaTitle ?? product.name,
    description:
      product.metaDescription ??
      product.shortDesc ??
      `Shop ${product.name} at Pro Straps. Premium watch straps crafted for perfection.`,
    openGraph: {
      title: product.metaTitle ?? `${product.name} | Pro Straps`,
      description:
        product.metaDescription ?? product.shortDesc ?? undefined,
      images: primaryImage ? [{ url: primaryImage.url }] : [],
      type: "website",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categorySlug = product.categories[0]?.category.slug;

  const [relatedProducts, reviews, categories, brands, compatibilities] =
    await Promise.all([
      getRelatedProducts(product.id, categorySlug).then((items) =>
        items.slice(0, 4)
      ),
      getProductReviews(product.id),
      getCategories(),
      getWatchBrands(),
      getProductCompatibilities(product.id),
    ]);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
      brands={brands}
      reviews={reviews}
      compatibilities={compatibilities}
    />
  );
}