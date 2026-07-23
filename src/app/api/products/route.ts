import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const collection = searchParams.get("collection") || undefined;
    const sort = searchParams.get("sort") || "newest";
    const q = searchParams.get("q") || undefined;
    const strapType = searchParams.get("strapType") || undefined;
    const priceMinVal = searchParams.get("priceMin");
    const priceMaxVal = searchParams.get("priceMax");
    const inStockVal = searchParams.get("inStock");
    const pageVal = searchParams.get("page");
    const limitVal = searchParams.get("limit");

    const priceMin = priceMinVal ? parseInt(priceMinVal, 10) : undefined;
    const priceMax = priceMaxVal ? parseInt(priceMaxVal, 10) : undefined;
    const inStock = inStockVal === "true";
    const page = pageVal ? parseInt(pageVal, 10) : 1;
    const limit = limitVal ? parseInt(limitVal, 10) : 12;

    const data = await getProducts({
      category,
      collection,
      sort,
      search: q,
      strapType,
      priceMin,
      priceMax,
      inStock: inStock || undefined,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch products API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}