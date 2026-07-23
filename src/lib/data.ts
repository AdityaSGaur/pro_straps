import { cache } from "react";

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

// ─── Static Mock Database Arrays ──────────────────────────────────────────

const MOCK_CATEGORIES: Record<string, Category> = {
  "leather-straps": { id: "cat_1", name: "leather", slug: "leather", description: "Premium leather straps" },
  "silicone-bands": { id: "cat_2", name: "silicone", slug: "silicone", description: "Waterproof silicone bands" },
  "metal-straps": { id: "cat_3", name: "metal", slug: "metal", description: "Refined stainless steel metal loops" },
  "nato-straps": { id: "cat_4", name: "nato", slug: "nato", description: "Military style nylon straps" },
  "sport-straps": { id: "cat_5", name: "sport", slug: "sport", description: "Fitness sport bands" },
  "luxury-straps": { id: "cat_6", name: "luxury", slug: "luxury", description: "High-end watch bands" },
  "rubber-straps": { id: "cat_7", name: "rubber", slug: "rubber", description: "Durable rubber straps" },
  "dive-straps": { id: "cat_8", name: "dive", slug: "dive", description: "Waterproof diver bands" },
  "casual-straps": { id: "cat_9", name: "casual", slug: "casual", description: "Casual everyday straps" },
  "fabric-straps": { id: "cat_10", name: "fabric", slug: "fabric", description: "Woven canvas straps" },
};

const MOCK_COLLECTIONS: Record<string, Collection> = {
  "essentials": { id: "col_1", name: "essentials", slug: "essentials", description: "Everyday essentials" },
  "premium": { id: "col_2", name: "premium", slug: "premium", description: "Premium luxury watch straps" },
  "sport": { id: "col_3", name: "sport", slug: "sport", description: "Workout and sports straps" },
  "new-arrivals": { id: "col_4", name: "new-arrivals", slug: "new-arrivals", description: "Latest watch bands" },
};

const MOCK_PRODUCTS: ProductWithReviews[] = [
  {
    id: "prod_1",
    name: "Premium Leather Watch Strap",
    slug: "premium-leather-watch-strap",
    shortDesc: "Hand-stitched Italian full-grain leather with a natural patina that develops over time.",
    description: "Crafted from the finest Italian full-grain leather, the Premium Leather Watch Strap is designed for watch enthusiasts who appreciate timeless elegance. Each strap undergoes meticulous hand-stitching with waxed linen thread, ensuring durability that lasts for years. The leather develops a rich patina over time, making each strap uniquely yours. Features a hypoallergenic stainless steel pin buckle with a polished finish. Compatible with most 20mm and 22mm lug width watches.",
    basePrice: 2499,
    salePrice: 1999,
    sku: "PS-LEA-001",
    strapType: "LEATHER",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    status: "ACTIVE",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    metaTitle: "Premium Leather Watch Strap | Pro Straps",
    metaDescription: "Hand-stitched Italian full-grain leather strap.",
    images: [
      { id: "img_1_1", url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80", alt: "Premium Leather", isPrimary: true, sortOrder: 0 },
      { id: "img_1_2", url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80", alt: "Premium Leather Box", isPrimary: false, sortOrder: 1 },
    ],
    variants: [
      { id: "var_1_1", sku: "var-1-1", color: "#1a1a1a", colorName: "Jet Black", width: "20mm", material: "Full-Grain Leather", price: 2499, salePrice: 1999, stock: 45, buckleColor: "Silver", isActive: true, lowStockThreshold: 5 },
      { id: "var_1_2", sku: "var-1-2", color: "#8B4513", colorName: "Cognac Brown", width: "20mm", material: "Full-Grain Leather", price: 2499, salePrice: 1999, stock: 32, buckleColor: "Gold", isActive: true, lowStockThreshold: 5 },
      { id: "var_1_3", sku: "var-1-3", color: "#D2691E", colorName: "Tan", width: "22mm", material: "Full-Grain Leather", price: 2699, salePrice: 2199, stock: 28, buckleColor: "Silver", isActive: true, lowStockThreshold: 5 },
    ],
    categories: [
      { categoryId: "cat_1", category: MOCK_CATEGORIES["leather-straps"] },
    ],
    collections: [
      { collectionId: "col_1", collection: MOCK_COLLECTIONS["essentials"] },
    ],
    reviews: [
      { id: "rev_1", rating: 5, title: "Classy", body: "Matches my watch perfectly.", isVerified: true, helpfulCount: 2, createdAt: new Date("2026-06-10"), user: { name: "Rahul", avatar: null }, images: [] }
    ],
    _avgRating: 5,
    _reviewCount: 1
  },
  {
    id: "prod_2",
    name: "Sport Slim Silicone Band",
    slug: "sport-slim-silicone-band",
    shortDesc: "Ultra-lightweight sport band engineered for all-day comfort during any activity.",
    description: "The Sport Slim Silicone Band combines cutting-edge materials with an ultra-slim 2mm profile for barely-there comfort. Made from medical-grade fluoroelastomer, it resists sweat, UV rays, and daily wear while maintaining a soft, skin-friendly feel. The integrated quick-release pins allow tool-free swapping in seconds. Perfect for workouts, swimming, and everyday wear. Compatible with Apple Watch, Samsung Galaxy Watch, and all 20mm/22mm lug watches.",
    basePrice: 1299,
    salePrice: null,
    sku: "PS-SIL-001",
    strapType: "SILICONE",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    status: "ACTIVE",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
    metaTitle: "Sport Slim Silicone Band | Pro Straps",
    metaDescription: "Ultra-lightweight sport band.",
    images: [
      { id: "img_2_1", url: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80", alt: "Sport Slim", isPrimary: true, sortOrder: 0 },
      { id: "img_2_2", url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80", alt: "White Strap", isPrimary: false, sortOrder: 1 },
    ],
    variants: [
      { id: "var_2_1", sku: "var-2-1", color: "#1a1a1a", colorName: "Jet Black", width: "20mm", material: "Fluoroelastomer", price: 1299, salePrice: null, stock: 120, buckleColor: "Black", isActive: true, lowStockThreshold: 10 },
      { id: "var_2_2", sku: "var-2-2", color: "#f5f5f5", colorName: "Cloud White", width: "20mm", material: "Fluoroelastomer", price: 1299, salePrice: null, stock: 85, buckleColor: "Silver", isActive: true, lowStockThreshold: 10 },
    ],
    categories: [
      { categoryId: "cat_2", category: MOCK_CATEGORIES["silicone-bands"] },
      { categoryId: "cat_5", category: MOCK_CATEGORIES["sport-straps"] },
    ],
    collections: [
      { collectionId: "col_3", collection: MOCK_COLLECTIONS["sport"] },
    ],
    reviews: [],
    _avgRating: 0,
    _reviewCount: 0
  },
  {
    id: "prod_3",
    name: "Milanese Loop Stainless Steel",
    slug: "milanese-loop-stainless-steel",
    shortDesc: "Fluid stainless steel mesh that wraps your wrist in contemporary sophistication.",
    description: "The Milanese Loop Stainless Steel is a masterpiece of modern watch craftsmanship. Woven from over 100 individual 316L stainless steel links, it creates a fluid, breathable mesh that conforms naturally to your wrist. The magnetic closure provides a precise, adjustable fit without any clasps or buckles. Finished with an electro-polished surface that resists tarnishing and maintains its brilliant shine. Compatible with Apple Watch and traditional timepieces with 20mm or 22mm lugs.",
    basePrice: 3499,
    salePrice: 2999,
    sku: "PS-MET-001",
    strapType: "MILANESE",
    buckleType: "MAGNETIC",
    watchType: "BOTH",
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    status: "ACTIVE",
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
    metaTitle: "Milanese Loop Stainless Steel | Pro Straps",
    metaDescription: "Fluid stainless steel mesh loop.",
    images: [
      { id: "img_3_1", url: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80", alt: "Milanese Loop", isPrimary: true, sortOrder: 0 },
      { id: "img_3_2", url: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80", alt: "Silver Mesh", isPrimary: false, sortOrder: 1 },
    ],
    variants: [
      { id: "var_3_1", sku: "var-3-1", color: "#C0C0C0", colorName: "Silver", width: "20mm", material: "316L Stainless Steel", price: 3499, salePrice: 2999, stock: 30, buckleColor: "Silver", isActive: true, lowStockThreshold: 5 },
      { id: "var_3_2", sku: "var-3-2", color: "#B76E79", colorName: "Rose Gold", width: "20mm", material: "316L Stainless Steel", price: 3799, salePrice: 3299, stock: 22, buckleColor: "Rose Gold", isActive: true, lowStockThreshold: 5 },
    ],
    categories: [
      { categoryId: "cat_3", category: MOCK_CATEGORIES["metal-straps"] },
    ],
    collections: [
      { collectionId: "col_2", collection: MOCK_COLLECTIONS["premium"] },
    ],
    reviews: [],
    _avgRating: 0,
    _reviewCount: 0
  },
  {
    id: "prod_4",
    name: "NATO Nylon Military Strap",
    slug: "nato-nylon-military-strap",
    shortDesc: "Rugged military-grade nylon built to handle any adventure with timeless style.",
    description: "Born from military specifications, the NATO Nylon Military Strap offers unmatched durability and a clean, utilitarian aesthetic. Woven from premium 1680D ballistic nylon with heat-sealed edges to prevent fraying. The single-pass design keeps your watch secure even if a spring bar fails. Features a custom brushed stainless steel buckle and keepers. Available in a range of heritage-inspired colorways. Fits all 20mm and 22mm lug width watches.",
    basePrice: 899,
    salePrice: null,
    sku: "PS-NAT-001",
    strapType: "NATO",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    status: "ACTIVE",
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-01"),
    metaTitle: "NATO Nylon Military Strap | Pro Straps",
    metaDescription: "Rugged military-grade nylon strap.",
    images: [
      { id: "img_4_1", url: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80", alt: "NATO Strap", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_4_1", sku: "var-4-1", color: "#1B3A4B", colorName: "Navy Blue", width: "20mm", material: "1680D Ballistic Nylon", price: 899, salePrice: null, stock: 95, buckleColor: "Silver", isActive: true, lowStockThreshold: 10 },
      { id: "var_4_2", sku: "var-4-2", color: "#2D4A22", colorName: "Olive Green", width: "20mm", material: "1680D Ballistic Nylon", price: 899, salePrice: null, stock: 80, buckleColor: "Matte Black", isActive: true, lowStockThreshold: 10 },
    ],
    categories: [
      { categoryId: "cat_4", category: MOCK_CATEGORIES["nato-straps"] },
      { categoryId: "cat_10", category: MOCK_CATEGORIES["fabric-straps"] },
    ],
    collections: [
      { collectionId: "col_1", collection: MOCK_COLLECTIONS["essentials"] },
    ],
    reviews: [],
    _avgRating: 0,
    _reviewCount: 0
  },
  {
    id: "prod_5",
    name: "Heritage Crocodile Grain Leather",
    slug: "heritage-crocodile-grain-leather",
    shortDesc: "Exotic crocodile-embossed leather that brings a touch of luxury to any timepiece.",
    description: "The Heritage Crocodile Grain Leather Strap elevates your watch with the distinguished look of exotic leather. Featuring a precision-crafted crocodile grain pattern pressed into premium European calf leather, this strap delivers the luxury aesthetic at an accessible price point. The interior is lined with supple nubuck leather for exceptional comfort against the skin. Hand-finished edges and a signed butterfly clasp complete the premium experience.",
    basePrice: 3999,
    salePrice: 3499,
    sku: "PS-LEA-002",
    strapType: "LEATHER",
    buckleType: "BUTTERFLY",
    watchType: "TRADITIONAL",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    status: "ACTIVE",
    createdAt: new Date("2026-05-01"),
    updatedAt: new Date("2026-05-01"),
    metaTitle: "Heritage Crocodile Grain Leather | Pro Straps",
    metaDescription: "Exotic crocodile-embossed leather watch strap.",
    images: [
      { id: "img_5_1", url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80", alt: "Crocodile Leather", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_5_1", sku: "var-5-1", color: "#1a1a1a", colorName: "Onyx Black", width: "20mm", material: "Calf Leather (Croc Grain)", price: 3999, salePrice: 3499, stock: 15, buckleColor: "Gold", isActive: true, lowStockThreshold: 3 },
    ],
    categories: [
      { categoryId: "cat_1", category: MOCK_CATEGORIES["leather-straps"] },
      { categoryId: "cat_6", category: MOCK_CATEGORIES["luxury-straps"] },
    ],
    collections: [
      { collectionId: "col_2", collection: MOCK_COLLECTIONS["premium"] },
    ],
    reviews: [],
    _avgRating: 0,
    _reviewCount: 0
  },
  {
    id: "prod_6",
    name: "Rugged Rubber Dive Strap",
    slug: "rugged-rubber-dive-strap",
    shortDesc: "Professional-grade dive strap engineered for the depths with supreme surface grip.",
    description: "Designed for professional divers and adventure seekers, the Rugged Rubber Dive Strap is built to withstand extreme conditions. Made from FKM vulcanized rubber that resists saltwater, chemicals, and temperature extremes. The vented design allows water to flow freely for quick drying, while the textured surface provides exceptional grip even when wet. Features a robust stainless steel buckle with dive extension for wetsuit compatibility. Rated for depths up to 200 meters.",
    basePrice: 1899,
    salePrice: null,
    sku: "PS-RUB-001",
    strapType: "RUBBER",
    buckleType: "DEPLOYANT",
    watchType: "TRADITIONAL",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    status: "ACTIVE",
    createdAt: new Date("2026-06-01"),
    updatedAt: new Date("2026-06-01"),
    metaTitle: "Rugged Rubber Dive Strap | Pro Straps",
    metaDescription: "Professional FKM rubber dive strap.",
    images: [
      { id: "img_6_1", url: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80", alt: "Rubber Dive", isPrimary: true, sortOrder: 0 },
    ],
    variants: [
      { id: "var_6_1", sku: "var-6-1", color: "#1a1a1a", colorName: "Volcanic Black", width: "20mm", material: "FKM Vulcanized Rubber", price: 1899, salePrice: null, stock: 40, buckleColor: "Silver", isActive: true, lowStockThreshold: 5 },
    ],
    categories: [
      { categoryId: "cat_7", category: MOCK_CATEGORIES["rubber-straps"] },
      { categoryId: "cat_8", category: MOCK_CATEGORIES["dive-straps"] },
    ],
    collections: [
      { collectionId: "col_3", collection: MOCK_COLLECTIONS["sport"] },
    ],
    reviews: [],
    _avgRating: 0,
    _reviewCount: 0
  },
];

// ─── Query methods (In-memory implementations) ───────────────────────────

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

  let filtered = [...MOCK_PRODUCTS];

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
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const sliced = filtered.slice(skip, skip + limit);

  return { products: sliced, total };
});

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<ProductWithReviews | null> {
  const p = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return p || null;
});

export const getCategories = cache(async function getCategories(): Promise<Category[]> {
  return Object.values(MOCK_CATEGORIES);
});

export const getCollections = cache(async function getCollections(): Promise<Collection[]> {
  return Object.values(MOCK_COLLECTIONS);
});

export async function searchProducts(query: string): Promise<ProductWithDetails[]> {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  return MOCK_PRODUCTS.filter(
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
  let related = MOCK_PRODUCTS.filter((p) => p.id !== productId);
  if (categorySlug) {
    related = related.filter((p) =>
      p.categories.some((c) => c.category.slug === categorySlug)
    );
  }
  return related.slice(0, 4);
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function getProductCompatibilities(
  productId: string
): Promise<any[]> {
  return [
    {
      id: "comp_1",
      watchBrand: { id: "brand_1", name: "Apple", slug: "apple", logo: null },
      watchModel: { id: "model_1", name: "Apple Watch Ultra" },
      lugWidth: 22,
      notes: "Direct slide-in compatibility",
    },
    {
      id: "comp_2",
      watchBrand: { id: "brand_2", name: "Samsung", slug: "samsung", logo: null },
      watchModel: { id: "model_2", name: "Galaxy Watch 5 Pro" },
      lugWidth: 20,
      notes: "Requires quick-release spring bars",
    },
  ];
}

// ─── Additional methods to resolve TS compile errors ────────────────────

export async function getFeaturedProducts(): Promise<ProductWithDetails[]> {
  return MOCK_PRODUCTS.filter((p) => p.isFeatured);
}

export async function getBestsellerProducts(): Promise<ProductWithDetails[]> {
  return MOCK_PRODUCTS.filter((p) => p.isBestseller);
}

export async function getNewArrivalProducts(): Promise<ProductWithDetails[]> {
  return MOCK_PRODUCTS.filter((p) => p.isNewArrival);
}

export async function getWatchBrands(): Promise<{ id: string; name: string; slug: string }[]> {
  return [
    { id: "brand_1", name: "Apple", slug: "apple" },
    { id: "brand_2", name: "Samsung", slug: "samsung" },
  ];
}

export async function getProductReviews(productId: string): Promise<any[]> {
  const p = MOCK_PRODUCTS.find((prod) => prod.id === productId);
  return p?.reviews || [];
}