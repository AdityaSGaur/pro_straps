import { db } from "../src/lib/db";

async function main() {
  const categories = await db.category.findMany({
    include: { products: { include: { product: true } } }
  });
  console.log("DB Categories:", categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c.products.length
  })));

  const products = await db.product.findMany({
    include: { categories: { include: { category: true } } }
  });
  console.log("DB Products:", products.map(p => ({
    name: p.name,
    slug: p.slug,
    categories: p.categories.map(pc => pc.category.slug)
  })));
}

main().catch(console.error).finally(() => db.$disconnect());
