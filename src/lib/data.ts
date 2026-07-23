import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cache } from "react";

// ─── Types ─────────────────────────────────────────────────────────────

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    images: { select: { id: true; url: true; alt: true; isPrimary: true; sortOrder: true }; orderBy: { sortOrder: "asc" } };
    variants: { where: { isActive: true }; select: { id: true; sku: true; color: true; colorName: true; width: true; price: true; salePrice: true; stock: true; isActive: true }; orderBy: { price: "asc" } };
    categories: { select: { categoryId: true; category: { select: { id: true; name: true; slug: true } } } };
    collections: { select: { collectionId: true; collection: { select: { id: true; name: true; slug: true } } } };
  };
}>;

export type ProductWithReviews = ProductWithDetails & {
  reviews: { rating: number; id: string }[];
  _avgRating?: number;
  _reviewCount?: number;
};

// ─── Shared include payload for product queries ────────────────────────

const productInclude = {
  images: {
    select: { id: true, url: true, alt: true, isPrimary: true, sortOrder: true },
    orderBy: { sortOrder: "asc" as const },
  },
  variants: {
    where: { isActive: true },
    select: { id: true, sku: true, color: true, colorName: true, width: true, price: true, salePrice: true, stock: true, isActive: true },
    orderBy: { price: "asc" as const },
  },
  categories: {
    select: { categoryId: true, category: { select: { id: true, name: true, slug: true } } },
  },
  collections: {
    select: { collectionId: true, collection: { select: { id: true, name: true, slug: true } } },
  },
} satisfies Prisma.ProductInclude;

// ─── Get all active products with filtering, sorting, pagination ────────

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

  const where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  // Category filter
  if (category) {
    const cleanCat = category.trim().toLowerCase();
    where.categories = {
      some: {
        category: {
          OR: [
            { slug: cleanCat },
            { slug: `${cleanCat}-straps` },
            { slug: `${cleanCat}-bands` },
            { name: { contains: cleanCat } },
          ],
        },
      },
    };
  }

  // Collection filter
  if (collection) {
    where.collections = {
      some: {
        collection: {
          OR: [{ slug: collection }, { name: collection }],
        },
      },
    };
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDesc: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Strap type filter
  if (strapType) {
    where.strapType = strapType;
  }

  // Price range filter — filter at the variant level
  if (priceMin !== undefined || priceMax !== undefined) {
    const variantWhere: Prisma.ProductVariantWhereInput = {
      isActive: true,
      ...(priceMin !== undefined ? { price: { gte: priceMin } } : {}),
      ...(priceMax !== undefined ? { price: { lte: priceMax } } : {}),
    };
    where.variants = { some: variantWhere };
  }

  // In-stock filter
  if (inStock) {
    const existingVariantFilter = where.variants as
      | { some: Prisma.ProductVariantWhereInput }
      | undefined;
    where.variants = {
      some: {
        ...(existingVariantFilter?.some ?? {}),
        isActive: true,
        stock: { gt: 0 },
      },
    };
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput;
  switch (sort) {
    case "featured":
      orderBy = { isFeatured: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "price-asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price-desc":
      orderBy = { basePrice: "desc" };
      break;
    case "rating": {
      // Sort by average review rating (descending)
      // SQLite doesn't support subqueries in orderBy, so we do an in-memory sort
      const ratedProducts = await db.review.groupBy({
        by: ["productId"],
        where: { isApproved: true },
        _avg: { rating: true },
        orderBy: { _avg: { rating: "desc" } },
      });
      const ratedMap = new Map(
        ratedProducts.map((r, i) => [r.productId, i])
      );
      const allProducts = await db.product.findMany({
        where,
        include: productInclude,
      });
      allProducts.sort((a, b) => {
        const aIdx = ratedMap.get(a.id) ?? ratedProducts.length;
        const bIdx = ratedMap.get(b.id) ?? ratedProducts.length;
        return aIdx - bIdx;
      });
      const total = allProducts.length;
      const skip = (page - 1) * limit;
      return { products: allProducts.slice(skip, skip + limit) as ProductWithDetails[], total };
    }
    case "bestselling":
      orderBy = { isBestseller: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return { products: products as ProductWithDetails[], total };
}

// ─── Get a single product by slug with reviews and avg rating ──────────

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<ProductWithReviews | null> {
  const product = await db.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: productInclude,
  });

  if (!product) return null;

  // Fetch approved reviews for this product
  const reviews = await db.review.findMany({
    where: {
      productId: product.id,
      isApproved: true,
    },
    select: {
      id: true,
      rating: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Aggregate average rating and count
  const aggregate = await db.review.aggregate({
    where: {
      productId: product.id,
      isApproved: true,
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    ...product,
    reviews,
    _avgRating: aggregate._avg.rating ?? undefined,
    _reviewCount: aggregate._count.rating,
  } as ProductWithReviews;
});

// ─── Get featured products (max 8) ────────────────────────────────────

export const getFeaturedProducts = cache(async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  return db.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 8,
  }) as Promise<ProductWithDetails[]>;
});

// ─── Get bestseller products (max 8) ──────────────────────────────────

export const getBestsellerProducts = cache(async function getBestsellerProducts(): Promise<ProductWithDetails[]> {
  return db.product.findMany({
    where: {
      status: "ACTIVE",
      isBestseller: true,
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 8,
  }) as Promise<ProductWithDetails[]>;
});

// ─── Get new arrival products (max 8) ─────────────────────────────────

export const getNewArrivals = cache(async function getNewArrivals(): Promise<ProductWithDetails[]> {
  return db.product.findMany({
    where: {
      status: "ACTIVE",
      isNewArrival: true,
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 8,
  }) as Promise<ProductWithDetails[]>;
});

// ─── Get all categories ───────────────────────────────────────────────

export const getCategories = cache(async function getCategories(): Promise<{
  id: string;
  name: string;
  slug: string;
  description: string | null;
}[]> {
  return db.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
    orderBy: { sortOrder: "asc" },
  });
});

// ─── Get all collections ──────────────────────────────────────────────

export const getCollections = cache(async function getCollections(): Promise<{
  id: string;
  name: string;
  slug: string;
  description: string | null;
}[]> {
  return db.collection.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
    orderBy: { sortOrder: "asc" },
  });
});

// ─── Get watch brands ─────────────────────────────────────────────────

export async function getWatchBrands(): Promise<{
  id: string;
  name: string;
  slug: string;
}[]> {
  return db.watchBrand.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: "asc" },
  });
}

// ─── Get reviews for a product ────────────────────────────────────────

export async function getProductReviews(
  productId: string
): Promise<{
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: { name: string | null; avatar: string | null } | null;
  images: { id: string; url: string }[];
}[]> {
  if (productId === "any") {
    return db.review.findMany({
      where: { isApproved: true },
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        isVerified: true,
        helpfulCount: true,
        createdAt: true,
        user: true,
        images: { select: { id: true, url: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }
  return db.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      isVerified: true,
      helpfulCount: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          avatar: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Search products ──────────────────────────────────────────────────

export async function searchProducts(
  query: string
): Promise<ProductWithDetails[]> {
  if (!query || query.trim().length === 0) return [];

  return db.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { name: { contains: query } },
        { shortDesc: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 20,
  }) as Promise<ProductWithDetails[]>;
}

// ─── Get related products ─────────────────────────────────────────────

export async function getRelatedProducts(
  productId: string,
  categorySlug?: string
): Promise<ProductWithDetails[]> {
  // Find category IDs that the given product belongs to
  const productCategories = await db.productCategory.findMany({
    where: { productId },
    select: { categoryId: true },
  });

  const categoryIds = productCategories.map((pc) => pc.categoryId);

  // If no categories found, try using the provided slug
  if (categoryIds.length === 0 && categorySlug) {
    const category = await db.category.findFirst({
      where: { slug: categorySlug },
      select: { id: true },
    });
    if (category) categoryIds.push(category.id);
  }

  // Find products sharing the same categories (excluding the current product)
  if (categoryIds.length > 0) {
    const related = await db.product.findMany({
      where: {
        id: { not: productId },
        status: "ACTIVE",
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      },
      include: productInclude,
      take: 8,
    });

    if (related.length > 0) return related as ProductWithDetails[];
  }

  // Fallback: return other active products if no category match
  return db.product.findMany({
    where: {
      id: { not: productId },
      status: "ACTIVE",
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 8,
  }) as Promise<ProductWithDetails[]>;
}

// ─── Get all product slugs (for static generation) ────────────────────

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return db.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });
}

// ─── Get product compatibilities with watch brands ────────────────────

export async function getProductCompatibilities(
  productId: string
): Promise<{
  id: string;
  watchBrand: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  watchModel: {
    id: string;
    name: string;
  } | null;
  lugWidth: number | null;
  notes: string | null;
}[]> {
  return db.productCompatibility.findMany({
    where: { productId },
    include: {
      watchBrand: {
        select: { id: true, name: true, slug: true, logo: true },
      },
      watchModel: {
        select: { id: true, name: true },
      },
    },
  });
}