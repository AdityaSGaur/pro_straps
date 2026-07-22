import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      shortDesc,
      description,
      basePrice,
      salePrice,
      costPrice,
      sku,
      barcode,
      status,
      isFeatured,
      isNewArrival,
      isBestseller,
      strapType,
      buckleType,
      watchType,
      metaTitle,
      metaDescription,
      variants = [],
      images = [],
      categoryIds = [],
      collectionIds = [],
    } = body;

    const product = await db.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name,
          slug,
          shortDesc,
          description,
          basePrice: Number(basePrice),
          salePrice: salePrice ? Number(salePrice) : null,
          costPrice: costPrice ? Number(costPrice) : null,
          sku,
          barcode,
          status: status || "DRAFT",
          isFeatured: isFeatured || false,
          isNewArrival: isNewArrival || false,
          isBestseller: isBestseller || false,
          strapType,
          buckleType,
          watchType,
          metaTitle,
          metaDescription,
        },
      });

      // Create variants
      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: Record<string, unknown>) => ({
            productId: p.id,
            sku: v.sku as string,
            color: (v.color as string) || null,
            colorName: (v.colorName as string) || null,
            width: (v.width as string) || null,
            length: (v.length as string) || null,
            material: (v.material as string) || null,
            buckleColor: (v.buckleColor as string) || null,
            buckleFinish: (v.buckleFinish as string) || null,
            price: Number(v.price),
            salePrice: v.salePrice ? Number(v.salePrice) : null,
            stock: Number(v.stock) || 0,
            isActive: v.isActive !== false,
          })),
        });
      }

      // Create images
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: Record<string, unknown>, i: number) => ({
            productId: p.id,
            url: img.url as string,
            alt: (img.alt as string) || null,
            sortOrder: Number(img.sortOrder) ?? i,
            isPrimary: img.isPrimary === true || (i === 0 && !images.some((x: Record<string, unknown>) => x.isPrimary === true)),
          })),
        });
      }

      // Connect categories
      if (categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: p.id,
            categoryId,
          })),
        });
      }

      // Connect collections
      if (collectionIds.length > 0) {
        await tx.productCollection.createMany({
          data: collectionIds.map((collectionId: string) => ({
            productId: p.id,
            collectionId,
          })),
        });
      }

      return p;
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}