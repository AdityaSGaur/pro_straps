import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { createdAt: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        categories: { include: { category: true } },
        collections: { include: { collection: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await db.$transaction(async (tx) => {
      // Update product
      const p = await tx.product.update({
        where: { id },
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

      // Delete existing variants and recreate
      await tx.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: Record<string, unknown>) => ({
            productId: id,
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

      // Delete existing images and recreate
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((img: Record<string, unknown>, i: number) => ({
            productId: id,
            url: img.url as string,
            alt: (img.alt as string) || null,
            sortOrder: Number(img.sortOrder) ?? i,
            isPrimary: img.isPrimary === true || (i === 0 && !images.some((x: Record<string, unknown>) => x.isPrimary === true)),
          })),
        });
      }

      // Delete existing category links and recreate
      await tx.productCategory.deleteMany({ where: { productId: id } });
      if (categoryIds.length > 0) {
        await tx.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: id,
            categoryId,
          })),
        });
      }

      // Delete existing collection links and recreate
      await tx.productCollection.deleteMany({ where: { productId: id } });
      if (collectionIds.length > 0) {
        await tx.productCollection.createMany({
          data: collectionIds.map((collectionId: string) => ({
            productId: id,
            collectionId,
          })),
        });
      }

      return p;
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}