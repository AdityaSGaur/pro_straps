import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, description, image, banner, sortOrder, isActive } = body;

    const collection = await db.collection.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        banner: banner || null,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      },
    });
    return NextResponse.json(collection);
  } catch (error) {
    console.error("Failed to update collection:", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}