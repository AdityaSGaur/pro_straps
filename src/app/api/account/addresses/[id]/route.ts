import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { label, street, city, state, postalCode, country, phone, deliveryInstructions, isDefault } = body;

    const existing = await db.address.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isDefault && !existing.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updateData: Record<string, string | boolean | null> = {};
    if (label !== undefined) updateData.label = label?.trim() || null;
    if (street !== undefined) updateData.street = street.trim();
    if (city !== undefined) updateData.city = city.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (postalCode !== undefined) updateData.postalCode = postalCode.trim();
    if (country !== undefined) updateData.country = country?.trim() || "India";
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (deliveryInstructions !== undefined) updateData.deliveryInstructions = deliveryInstructions?.trim() || null;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    const address = await db.address.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("Address PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await db.address.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await db.address.delete({ where: { id } });

    // If deleted address was default, set the most recent as default
    if (existing.isDefault) {
      const nextDefault = await db.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
      if (nextDefault) {
        await db.address.update({ where: { id: nextDefault.id }, data: { isDefault: true } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
