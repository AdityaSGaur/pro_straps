import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  variants: { where: { isActive: true }, orderBy: { price: "asc" } },
  categories: { include: { category: true } },
  collections: { include: { collection: true } },
} satisfies Prisma.ProductInclude;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  // SQLite LIKE is case-insensitive for ASCII by default
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { name: { contains: query } },
        { shortDesc: { contains: query } },
        { description: { contains: query } },
        { strapType: { contains: query } },
        { sku: { contains: query } },
      ],
    },
    include: productInclude,
    take: 10,
  });

  return NextResponse.json({ products });
}