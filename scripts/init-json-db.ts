import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

const PRODUCT_IMAGES: Record<string, string[]> = {
  "premium-leather-watch-strap": [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  ],
  "sport-slim-silicone-band": [
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
  ],
  "milanese-loop-stainless-steel": [
    "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80",
    "https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?w=800&q=80",
  ],
  "nato-nylon-military-strap": [
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  ],
  "heritage-crocodile-grain-leather": [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80",
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
  ],
  "rugged-rubber-dive-strap": [
    "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
  ],
  "canvas-woven-weekender-strap": [
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
  ],
  "ocean-blue-sport-band": [
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
  ],
  "midnight-black-leather-strap": [
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80",
    "https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?w=800&q=80",
  ],
  "rosegold-mesh-bracelet-band": [
    "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=800&q=80",
    "https://images.unsplash.com/photo-1526045478516-99145907023c?w=800&q=80",
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
  ],
  "terracotta-suede-watch-strap": [
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
  ],
  "arctic-white-silicone-band": [
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80",
  ],
};

const products = [
  {
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
    categories: ["leather-straps"],
    collections: ["essentials"],
    variants: [
      { color: "#1a1a1a", colorName: "Jet Black", width: "20mm", material: "Full-Grain Leather", price: 2499, salePrice: 1999, stock: 45, buckleColor: "Silver" },
      { color: "#8B4513", colorName: "Cognac Brown", width: "20mm", material: "Full-Grain Leather", price: 2499, salePrice: 1999, stock: 32, buckleColor: "Gold" },
      { color: "#D2691E", colorName: "Tan", width: "22mm", material: "Full-Grain Leather", price: 2699, salePrice: 2199, stock: 28, buckleColor: "Silver" },
      { color: "#1a1a1a", colorName: "Jet Black", width: "22mm", material: "Full-Grain Leather", price: 2699, salePrice: undefined, stock: 20, buckleColor: "Black" },
    ],
  },
  {
    name: "Sport Slim Silicone Band",
    slug: "sport-slim-silicone-band",
    shortDesc: "Ultra-lightweight sport band engineered for all-day comfort during any activity.",
    description: "The Sport Slim Silicone Band combines cutting-edge materials with an ultra-slim 2mm profile for barely-there comfort. Made from medical-grade fluoroelastomer, it resists sweat, UV rays, and daily wear while maintaining a soft, skin-friendly feel. The integrated quick-release pins allow tool-free swapping in seconds. Perfect for workouts, swimming, and everyday wear. Compatible with Apple Watch, Samsung Galaxy Watch, and all 20mm/22mm lug watches.",
    basePrice: 1299,
    sku: "PS-SIL-001",
    strapType: "SILICONE",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    categories: ["silicone-bands", "sport-straps"],
    collections: ["sport"],
    variants: [
      { color: "#1a1a1a", colorName: "Jet Black", width: "20mm", material: "Fluoroelastomer", price: 1299, stock: 120, buckleColor: "Black" },
      { color: "#f5f5f5", colorName: "Cloud White", width: "20mm", material: "Fluoroelastomer", price: 1299, stock: 85, buckleColor: "Silver" },
      { color: "#FF6B6B", colorName: "Coral Pink", width: "22mm", material: "Fluoroelastomer", price: 1399, stock: 60, buckleColor: "Silver" },
      { color: "#4ECDC4", colorName: "Ocean Teal", width: "20mm", material: "Fluoroelastomer", price: 1299, stock: 75, buckleColor: "Black" },
    ],
  },
  {
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
    categories: ["metal-straps"],
    collections: ["premium"],
    variants: [
      { color: "#C0C0C0", colorName: "Silver", width: "20mm", material: "316L Stainless Steel", price: 3499, salePrice: 2999, stock: 30, buckleColor: "Silver" },
      { color: "#B76E79", colorName: "Rose Gold", width: "20mm", material: "316L Stainless Steel", price: 3799, salePrice: 3299, stock: 22, buckleColor: "Rose Gold" },
      { color: "#1a1a1a", colorName: "Gunmetal Black", width: "22mm", material: "316L Stainless Steel", price: 3699, salePrice: undefined, stock: 18, buckleColor: "Black" },
    ],
  },
  {
    name: "NATO Nylon Military Strap",
    slug: "nato-nylon-military-strap",
    shortDesc: "Rugged military-grade nylon built to handle any adventure with timeless style.",
    description: "Born from military specifications, the NATO Nylon Military Strap offers unmatched durability and a clean, utilitarian aesthetic. Woven from premium 1680D ballistic nylon with heat-sealed edges to prevent fraying. The single-pass design keeps your watch secure even if a spring bar fails. Features a custom brushed stainless steel buckle and keepers. Available in a range of heritage-inspired colorways. Fits all 20mm and 22mm lug width watches.",
    basePrice: 899,
    sku: "PS-NAT-001",
    strapType: "NATO",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    categories: ["fabric-straps", "nato-straps"],
    collections: ["essentials"],
    variants: [
      { color: "#1B3A4B", colorName: "Navy Blue", width: "20mm", material: "1680D Ballistic Nylon", price: 899, stock: 95, buckleColor: "Silver" },
      { color: "#2D4A22", colorName: "Olive Green", width: "20mm", material: "1680D Ballistic Nylon", price: 899, stock: 80, buckleColor: "Matte Black" },
      { color: "#8B0000", colorName: "Burgundy Red", width: "22mm", material: "1680D Ballistic Nylon", price: 999, stock: 65, buckleColor: "Gold" },
      { color: "#1a1a1a", colorName: "Stealth Black", width: "20mm", material: "1680D Ballistic Nylon", price: 899, stock: 110, buckleColor: "Black" },
    ],
  },
  {
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
    categories: ["leather-straps", "luxury-straps"],
    collections: ["premium"],
    variants: [
      { color: "#1a1a1a", colorName: "Onyx Black", width: "20mm", material: "Calf Leather (Croc Grain)", price: 3999, salePrice: 3499, stock: 15, buckleColor: "Gold" },
      { color: "#8B4513", colorName: "Espresso Brown", width: "22mm", material: "Calf Leather (Croc Grain)", price: 4299, salePrice: 3799, stock: 12, buckleColor: "Gold" },
    ],
  },
  {
    name: "Rugged Rubber Dive Strap",
    slug: "rugged-rubber-dive-strap",
    shortDesc: "Professional-grade dive strap engineered for the depths with supreme surface grip.",
    description: "Designed for professional divers and adventure seekers, the Rugged Rubber Dive Strap is built to withstand extreme conditions. Made from FKM vulcanized rubber that resists saltwater, chemicals, and temperature extremes. The vented design allows water to flow freely for quick drying, while the textured surface provides exceptional grip even when wet. Features a robust stainless steel buckle with dive extension for wetsuit compatibility. Rated for depths up to 200 meters.",
    basePrice: 1899,
    sku: "PS-RUB-001",
    strapType: "RUBBER",
    buckleType: "DEPLOYANT",
    watchType: "TRADITIONAL",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    categories: ["rubber-straps", "dive-straps"],
    collections: ["sport"],
    variants: [
      { color: "#1a1a1a", colorName: "Volcanic Black", width: "20mm", material: "FKM Vulcanized Rubber", price: 1899, stock: 40, buckleColor: "Silver" },
      { color: "#1B3A4B", colorName: "Deep Ocean Blue", width: "22mm", material: "FKM Vulcanized Rubber", price: 1999, stock: 35, buckleColor: "Black" },
    ],
  },
  {
    name: "Canvas Woven Weekender Strap",
    slug: "canvas-woven-weekender-strap",
    shortDesc: "Relaxed woven canvas perfect for weekend adventures and casual everyday style.",
    description: "The Canvas Woven Weekender Strap brings a relaxed, approachable style to your watch collection. Hand-woven from premium organic cotton canvas with a reinforced core for structural integrity. The natural fiber breathes beautifully in warm weather and develops a unique character with wear. Paired with vegetable-tanned leather accents and a brushed steel buckle. Ideal for casual watches, field watches, and weekend wear.",
    basePrice: 1099,
    sku: "PS-FAB-001",
    strapType: "FABRIC",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    categories: ["fabric-straps", "casual-straps"],
    collections: ["essentials"],
    variants: [
      { color: "#D2B48C", colorName: "Natural Khaki", width: "20mm", material: "Organic Cotton Canvas", price: 1099, stock: 55, buckleColor: "Silver" },
      { color: "#4682B4", colorName: "Denim Blue", width: "20mm", material: "Organic Cotton Canvas", price: 1099, stock: 48, buckleColor: "Matte Black" },
      { color: "#556B2F", colorName: "Forest Green", width: "22mm", material: "Organic Cotton Canvas", price: 1199, stock: 38, buckleColor: "Bronze" },
    ],
  },
  {
    name: "Ocean Blue Sport Band",
    slug: "ocean-blue-sport-band",
    shortDesc: "Vibrant ocean-inspired sport band that makes a bold statement on every wrist.",
    description: "Make waves with the Ocean Blue Sport Band, a vibrant addition to our sport collection. Featuring a gradient design that transitions from deep navy to brilliant azure, this band captures the essence of the open ocean. Made from our signature fluoroelastomer with a soft-touch inner surface for all-day comfort. The sport profile is slim yet durable, perfect for both workouts and weekend outings. Quick-release pins included for effortless swapping.",
    basePrice: 1399,
    sku: "PS-SIL-002",
    strapType: "SILICONE",
    buckleType: "PIN",
    watchType: "SMART",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    categories: ["silicone-bands", "sport-straps"],
    collections: ["sport", "new-arrivals"],
    variants: [
      { color: "#0077B6", colorName: "Deep Ocean", width: "20mm", material: "Fluoroelastomer", price: 1399, stock: 70, buckleColor: "Silver" },
      { color: "#00B4D8", colorName: "Shoreline Cyan", width: "20mm", material: "Fluoroelastomer", price: 1399, stock: 55, buckleColor: "Black" },
    ],
  },
  {
    name: "Midnight Black Leather Strap",
    slug: "midnight-black-leather-strap",
    shortDesc: "The quintessential black leather strap — refined, versatile, and endlessly stylish.",
    description: "Every watch collection deserves a go-to black leather strap, and the Midnight Black delivers in spades. Crafted from premium French calfskin with a smooth, satin-like finish that exudes sophistication. The edges are hand-painted and burnished to a mirror-like sheen. Equipped with a custom-made 316L stainless steel pin buckle with a brushed finish. This is the strap you reach for when you need to make an impression. Fits all 20mm and 22mm lug watches.",
    basePrice: 2299,
    sku: "PS-LEA-003",
    strapType: "LEATHER",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    categories: ["leather-straps"],
    collections: ["essentials"],
    variants: [
      { color: "#0a0a0a", colorName: "Midnight Black", width: "20mm", material: "French Calfskin", price: 2299, stock: 65, buckleColor: "Silver" },
      { color: "#0a0a0a", colorName: "Midnight Black", width: "22mm", material: "French Calfskin", price: 2499, stock: 50, buckleColor: "Black" },
    ],
  },
  {
    name: "Rose Gold Mesh Bracelet Band",
    slug: "rosegold-mesh-bracelet-band",
    shortDesc: "Warm rose gold mesh that transforms any smartwatch into a fashion statement.",
    description: "The Rose Gold Mesh Bracelet Band is where technology meets high fashion. Featuring an intricate stainless steel mesh with a warm, rose gold PVD coating that complements both silver and gold watch cases. The adjustable magnetic clasp ensures a perfect fit for any wrist size, while the lightweight design makes it comfortable for all-day wear. A stunning upgrade for Apple Watch, Samsung Galaxy Watch, or any 20mm lug timepiece.",
    basePrice: 3299,
    salePrice: 2799,
    sku: "PS-MET-002",
    strapType: "MILANESE",
    buckleType: "MAGNETIC",
    watchType: "SMART",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    categories: ["metal-straps", "fashion-straps"],
    collections: ["premium", "new-arrivals"],
    variants: [
      { color: "#B76E79", colorName: "Rose Gold", width: "20mm", material: "316L Stainless Steel (PVD)", price: 3299, salePrice: 2799, stock: 25, buckleColor: "Rose Gold" },
    ],
  },
  {
    name: "Terracotta Suede Watch Strap",
    slug: "terracotta-suede-watch-strap",
    shortDesc: "Warm terracotta suede that brings an artisanal, Mediterranean flair to your wrist.",
    description: "Inspired by the warm tones of the Italian Riviera, the Terracotta Suede Watch Strap adds a splash of artisanal character to any watch. Made from premium Italian suede with a velvety nap that feels luxurious against the skin. The warm terracotta hue pairs beautifully with bronze, gold, and vintage-style watches. Hand-stitched with contrasting thread for a touch of craftsmanship. Includes a matching suede keeper and a brushed bronze buckle.",
    basePrice: 1799,
    sku: "PS-LEA-004",
    strapType: "LEATHER",
    buckleType: "PIN",
    watchType: "TRADITIONAL",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    categories: ["leather-straps", "casual-straps"],
    collections: ["new-arrivals"],
    variants: [
      { color: "#CC5500", colorName: "Terracotta", width: "20mm", material: "Italian Suede", price: 1799, stock: 30, buckleColor: "Bronze" },
    ],
  },
  {
    name: "Arctic White Silicone Band",
    slug: "arctic-white-silicone-band",
    shortDesc: "Clean, crisp arctic white silicone that brightens up any watch dial.",
    description: "The Arctic White Silicone Band brings a clean, modern aesthetic to your wrist. Made from our premium medical-grade fluoroelastomer, it resists yellowing and maintains its brilliant white color even after extended wear. The soft-touch interior prevents skin irritation during active use, while the exterior has a subtle matte texture that hides fingerprints. Includes quick-release spring bars and is compatible with all major smartwatch and traditional watch brands.",
    basePrice: 1299,
    sku: "PS-SIL-003",
    strapType: "SILICONE",
    buckleType: "PIN",
    watchType: "BOTH",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    categories: ["silicone-bands"],
    collections: ["new-arrivals"],
    variants: [
      { color: "#F5F5F5", colorName: "Arctic White", width: "20mm", material: "Fluoroelastomer", price: 1299, stock: 90, buckleColor: "White" },
      { color: "#F5F5F5", colorName: "Arctic White", width: "22mm", material: "Fluoroelastomer", price: 1399, stock: 60, buckleColor: "Silver" },
    ],
  },
];

const CATEGORIES = [
  { name: "Leather Straps", slug: "leather-straps", description: "Premium leather straps crafted from the finest materials" },
  { name: "Silicone Bands", slug: "silicone-bands", description: "Comfortable, durable sport bands for active lifestyles" },
  { name: "Metal Straps", slug: "metal-straps", description: "Stainless steel, milanese, and mesh bracelet bands" },
  { name: "NATO Straps", slug: "nato-straps", description: "Military-inspired nylon straps for any adventure" },
  { name: "Fabric Straps", slug: "fabric-straps", description: "Canvas, woven, and textile straps for casual style" },
  { name: "Rubber Straps", slug: "rubber-straps", description: "Professional-grade rubber for diving and sports" },
  { name: "Sport Straps", slug: "sport-straps", description: "Performance bands for workouts and active wear" },
  { name: "Luxury Straps", slug: "luxury-straps", description: "Exotic and premium straps for fine timepieces" },
  { name: "Fashion Straps", slug: "fashion-straps", description: "Statement straps that elevate your personal style" },
  { name: "Casual Straps", slug: "casual-straps", description: "Relaxed everyday straps for effortless style" },
  { name: "Dive Straps", slug: "dive-straps", description: "Water-resistant straps built for underwater exploration" },
];

const COLLECTIONS = [
  { name: "Essentials", slug: "essentials", description: "Timeless staples every watch collection needs" },
  { name: "Premium", slug: "premium", description: "Luxurious materials and exceptional craftsmanship" },
  { name: "Sport", slug: "sport", description: "Performance-driven bands for active lifestyles" },
  { name: "New Arrivals", slug: "new-arrivals", description: "The latest additions to the Pro Straps collection" },
];

const WATCH_BRANDS = [
  { name: "Apple Watch", slug: "apple-watch" },
  { name: "Samsung Galaxy Watch", slug: "samsung-galaxy-watch" },
  { name: "Garmin", slug: "garmin" },
  { name: "Fossil", slug: "fossil" },
  { name: "Casio", slug: "casio" },
  { name: "Titan", slug: "titan" },
  { name: "Noise", slug: "noise" },
  { name: "Boat", slug: "boat" },
  { name: "Amazfit", slug: "amazfit" },
  { name: "Traditional Watches", slug: "traditional-watches" },
  { name: "Other Brands", slug: "other-brands" },
];

const REVIEWS = [
  { rating: 5, title: "Absolutely stunning quality", body: "The leather quality is exceptional. You can feel the craftsmanship the moment you hold it. The patina is already developing beautifully after just two weeks of daily wear. Worth every rupee.", author: "Rahul Sharma", verified: true },
  { rating: 5, title: "Perfect fit for my Apple Watch", body: "Finally found a strap that matches the quality of my Apple Watch Ultra. The silicone is incredibly soft and the quick-release mechanism works flawlessly. Will be buying more colors.", author: "Priya Patel", verified: true },
  { rating: 4, title: "Great strap, minor packaging issue", body: "The milanese loop is gorgeous and feels premium on the wrist. The magnetic closure is very secure. Only gave 4 stars because the box arrived slightly damaged, but the product itself is flawless.", author: "Amit Verma", verified: true },
  { rating: 5, title: "Best NATO strap I have owned", body: "I have tried dozens of NATO straps from various brands, and this one stands out. The nylon quality is noticeably thicker and the edges are perfectly sealed. The hardware is also top-notch.", author: "Sneha Reddy", verified: true },
  { rating: 5, title: "Luxury feel at a reasonable price", body: "The crocodile grain leather looks and feels like straps costing three times as much. The butterfly clasp mechanism is smooth and secure. Gets compliments every time I wear it to the office.", author: "Vikram Mehta", verified: true },
  { rating: 4, title: "Comfortable for all-day wear", body: "Wore this sport band for a 12-hour shift without any discomfort. The ventilation channels really help. Color hasn't faded after multiple washes either. Very impressed.", author: "Ananya Gupta", verified: true },
];

async function seed() {
  console.log("🌱 Seeding JSON Database...\n");

  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load existing data if it exists
  let existingDb: any = { users: [], addresses: [], orders: [] };
  if (fs.existsSync(DB_FILE)) {
    try {
      existingDb = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch {
      // ignore
    }
  }

  const categoryMap = new Map<string, string>();
  const categoriesList = CATEGORIES.map((cat, i) => {
    const id = `cat_${i + 1}`;
    categoryMap.set(cat.slug, id);
    return {
      id,
      ...cat,
      image: null,
      parentId: null,
      sortOrder: i,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const collectionMap = new Map<string, string>();
  const collectionsList = COLLECTIONS.map((col, i) => {
    const id = `col_${i + 1}`;
    collectionMap.set(col.slug, id);
    return {
      id,
      ...col,
      image: null,
      banner: null,
      sortOrder: i,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const brandMap = new Map<string, string>();
  const brandsList = WATCH_BRANDS.map((brand, i) => {
    const id = `brand_${i + 1}`;
    brandMap.set(brand.slug, id);
    return {
      id,
      ...brand,
      logo: null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  });

  const productsList: any[] = [];
  const variantsList: any[] = [];
  const imagesList: any[] = [];
  const productCategoriesList: any[] = [];
  const productCollectionsList: any[] = [];
  const compatibilitiesList: any[] = [];

  products.forEach((p, index) => {
    const pId = `prod_${index + 1}`;
    productsList.push({
      id: pId,
      name: p.name,
      slug: p.slug,
      shortDesc: p.shortDesc,
      description: p.description,
      basePrice: p.basePrice,
      salePrice: p.salePrice ?? null,
      costPrice: null,
      sku: p.sku,
      barcode: null,
      status: "ACTIVE",
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      isBestseller: p.isBestseller,
      strapType: p.strapType,
      buckleType: p.buckleType,
      watchType: p.watchType,
      metaTitle: `${p.name} | Pro Straps`,
      metaDescription: p.shortDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Variants
    p.variants.forEach((v: any, vIndex) => {
      variantsList.push({
        id: `var_${index + 1}_${vIndex + 1}`,
        productId: pId,
        sku: `${p.sku}-V${vIndex + 1}`,
        color: v.color,
        colorName: v.colorName,
        width: v.width,
        length: null,
        material: v.material,
        buckleColor: v.buckleColor,
        buckleFinish: null,
        price: v.price,
        salePrice: v.salePrice ?? null,
        stock: v.stock,
        reservedStock: 0,
        lowStockThreshold: 5,
        weight: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    // Images
    const imgUrls = PRODUCT_IMAGES[p.slug] || PRODUCT_IMAGES["premium-leather-watch-strap"];
    imgUrls.forEach((url, i) => {
      imagesList.push({
        id: `img_${index + 1}_${i + 1}`,
        productId: pId,
        url,
        alt: `${p.name} - Image ${i + 1}`,
        sortOrder: i,
        isPrimary: i === 0,
        createdAt: new Date().toISOString(),
      });
    });

    // Relations
    p.categories.forEach(catSlug => {
      const cId = categoryMap.get(catSlug);
      if (cId) {
        productCategoriesList.push({
          productId: pId,
          categoryId: cId,
        });
      }
    });

    p.collections.forEach(colSlug => {
      const colId = collectionMap.get(colSlug);
      if (colId) {
        productCollectionsList.push({
          productId: pId,
          collectionId: colId,
        });
      }
    });

    // Compatibility
    const compatBrands = [brandMap.get("apple-watch")!, brandMap.get("traditional-watches")!];
    if (p.watchType === "SMART") {
      compatBrands.push(brandMap.get("samsung-galaxy-watch")!, brandMap.get("garmin")!);
    }
    compatBrands.forEach((bId, bIdx) => {
      if (bId) {
        compatibilitiesList.push({
          id: `comp_${index + 1}_${bIdx + 1}`,
          productId: pId,
          watchBrandId: bId,
          watchModelId: null,
          lugWidth: p.variants[0]?.width ? parseInt(p.variants[0].width) : 20,
          notes: "Compatible with standard models",
          createdAt: new Date().toISOString(),
        });
      }
    });
  });

  // Reviews
  const reviewsList = REVIEWS.map((r, i) => {
    const pId = productsList[i % productsList.length].id;
    return {
      id: `rev_${i + 1}`,
      productId: pId,
      userId: null,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isVerified: r.verified,
      isApproved: true,
      helpfulCount: Math.floor(Math.random() * 25) + 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Coupons
  const couponsList = [
    {
      id: "cp_1",
      code: "WELCOME20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 999,
      maxDiscount: 1000,
      validFrom: null,
      validTo: null,
      usageLimit: 500,
      perUserLimit: 1,
      isFirstOrder: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cp_2",
      code: "PROSTRAPS15",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minOrderValue: 1499,
      maxDiscount: 750,
      validFrom: null,
      validTo: null,
      usageLimit: 1000,
      perUserLimit: 2,
      isFirstOrder: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const dbData = {
    users: existingDb.users || [],
    addresses: existingDb.addresses || [],
    orders: existingDb.orders || [],
    categories: categoriesList,
    collections: collectionsList,
    watchBrands: brandsList,
    watchModels: [],
    products: productsList,
    productVariants: variantsList,
    productImages: imagesList,
    productCategories: productCategoriesList,
    productCollections: productCollectionsList,
    productCompatibilities: compatibilitiesList,
    reviews: reviewsList,
    coupons: couponsList,
    payments: existingDb.payments || [],
    orderItems: existingDb.orderItems || [],
    orderStatusHistories: existingDb.orderStatusHistories || [],
    couponUsages: existingDb.couponUsages || [],
    customizations: existingDb.customizations || [],
    newsletterSubscribers: existingDb.newsletterSubscribers || [],
    siteSettings: existingDb.siteSettings || [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), "utf-8");
  console.log("✅ Seed completed successfully! db.json updated.");
  console.log(`📊 Statistics:
   - Users: ${dbData.users.length}
   - Categories: ${dbData.categories.length}
   - Collections: ${dbData.collections.length}
   - Products: ${dbData.products.length}
   - Variants: ${dbData.productVariants.length}
   - Images: ${dbData.productImages.length}
   - Reviews: ${dbData.reviews.length}
   - Coupons: ${dbData.coupons.length}`);
}

seed().catch(console.error);
