import { cache } from "react";
import { db } from "./db";

// ─── Type definitions ──────────────────────────────────────────────────

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  color: string | null;
  colorName: string | null;
  width: string | null;
  material: string;
  price: number;
  salePrice: number | null;
  stock: number;
  buckleColor: string;
  isActive: boolean;
  lowStockThreshold: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type ProductWithDetails = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  sku: string;
  strapType: string;
  buckleType: string;
  watchType: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImage[];
  variants: ProductVariant[];
  categories: { categoryId: string; category: Category }[];
  collections: { collectionId: string; collection: Collection }[];
  metaTitle: string | null;
  metaDescription: string | null;
};

export type ProductWithReviews = ProductWithDetails & {
  reviews: any[];
  _avgRating?: number;
  _reviewCount?: number;
};

// ─── Query methods (JSON-File Database implementations) ───────────────────────────

export const getProducts = cache(async function getProducts(params?: {
  category?: string;
  collection?: string;
  sort?: string;
  search?: string;
  strapType?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ products: ProductWithDetails[]; total: number }> {
  const {
    category,
    collection,
    sort = "newest",
    search,
    strapType,
    priceMin,
    priceMax,
    inStock,
    page = 1,
    limit = 12,
  } = params ?? {};

  // Fetch all active products with details from our file-based db
  const allProducts = (await db.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithDetails[];

  let filtered = [...allProducts];

  // Category filter
  if (category) {
    const cleanCat = category.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      p.categories.some(
        (c) =>
          c.category.slug === cleanCat ||
          c.category.slug === `${cleanCat}-straps` ||
          c.category.name.toLowerCase().includes(cleanCat)
      )
    );
  }

  // Collection filter
  if (collection) {
    const cleanCol = collection.trim().toLowerCase();
    filtered = filtered.filter((p) =>
      p.collections.some(
        (c) =>
          c.collection.slug === cleanCol ||
          c.collection.name.toLowerCase().includes(cleanCol)
      )
    );
  }

  // Search filter
  if (search) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Strap type filter
  if (strapType) {
    filtered = filtered.filter((p) => p.strapType === strapType);
  }

  // Price filter
  if (priceMin !== undefined) {
    filtered = filtered.filter((p) => p.basePrice >= priceMin);
  }
  if (priceMax !== undefined) {
    filtered = filtered.filter((p) => p.basePrice <= priceMax);
  }

  // In stock filter
  if (inStock) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.stock > 0));
  }

  // Sorting
  if (sort === "price-asc") {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else if (sort === "bestselling") {
    filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  } else {
    // newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const sliced = filtered.slice(skip, skip + limit);

  return { products: sliced, total };
});

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<ProductWithReviews | null> {
  const p = (await db.product.findFirst({
    where: { slug },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithReviews;

  if (!p) return null;

  // Fetch reviews
  const reviews = await db.review.findMany({
    where: { productId: p.id, isApproved: true },
  });

  p.reviews = reviews;
  p._reviewCount = reviews.length;
  p._avgRating = reviews.length
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  return p;
});

export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  const cats = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return cats.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));
});

export const getCollections = cache(async function getCollections(): Promise<Collection[]> {
  const cols = await db.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return cols.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  }));
});

export async function searchProducts(query: string): Promise<ProductWithDetails[]> {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  const allProducts = (await db.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithDetails[];

  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.shortDesc.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export async function getRelatedProducts(
  productId: string,
  categorySlug?: string
): Promise<ProductWithDetails[]> {
  const { products } = await getProducts({ category: categorySlug, limit: 10 });
  const related = products.filter((p) => p.id !== productId);
  return related.slice(0, 4);
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
  });
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function getProductCompatibilities(productId: string): Promise<any[]> {
  const comps = await db.productCompatibility.findMany({
    where: { productId },
  });

  const brands = await db.watchBrand.findMany({});

  return comps.map((comp: any) => {
    const brand = brands.find((b: any) => b.id === comp.watchBrandId);
    return {
      id: comp.id,
      watchBrand: {
        id: brand?.id || comp.watchBrandId,
        name: brand?.name || "Traditional Watch",
        slug: brand?.slug || "traditional",
        logo: null,
      },
      watchModel: comp.watchModelId ? { id: comp.watchModelId, name: "Watch Model" } : null,
      lugWidth: comp.lugWidth || 20,
      notes: comp.notes || "Standard compatibility",
    };
  });
}

export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  const products = (await db.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithDetails[];
  return products;
}

export async function getBestsellerProducts(): Promise<ProductWithDetails[]> {
  const products = (await db.product.findMany({
    where: { isBestseller: true, status: "ACTIVE" },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithDetails[];
  return products;
}

export async function getNewArrivalProducts(): Promise<ProductWithDetails[]> {
  const products = (await db.product.findMany({
    where: { isNewArrival: true, status: "ACTIVE" },
    include: {
      variants: true,
      images: true,
      categories: { include: { category: true } },
      collections: { include: { collection: true } },
    },
  })) as unknown as ProductWithDetails[];
  return products;
}

export async function getWatchBrands(): Promise<{ id: string; name: string; slug: string }[]> {
  const brands = await db.watchBrand.findMany({
    where: { isActive: true },
  });
  return brands.map((b: any) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
  }));
}

export async function getProductReviews(productId: string): Promise<any[]> {
  return db.review.findMany({
    where: { productId, isApproved: true },
  });
}