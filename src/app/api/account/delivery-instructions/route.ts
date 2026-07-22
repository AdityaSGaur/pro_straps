import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const defaultAddress = await db.address.findFirst({
      where: { userId: session.user.id, isDefault: true },
      select: { id: true, deliveryInstructions: true, label: true },
    });

    // Also get all unique delivery instructions
    const allAddresses = await db.address.findMany({
      where: { userId: session.user.id, deliveryInstructions: { not: null } },
      select: { id: true, label: true, deliveryInstructions: true },
    });

    return NextResponse.json({
      default: defaultAddress?.deliveryInstructions || "",
      defaultAddressId: defaultAddress?.id || null,
      defaultLabel: defaultAddress?.label || null,
      allInstructions: allAddresses.map((a) => ({
        id: a.id,
        label: a.label,
        instructions: a.deliveryInstructions,
      })),
    });
  } catch (error) {
    console.error("Delivery instructions GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { instructions, addressId } = await req.json();

    // Update the specified address or default address
    let targetId = addressId;
    if (!targetId) {
      const defaultAddr = await db.address.findFirst({
        where: { userId: session.user.id, isDefault: true },
        select: { id: true },
      });
      targetId = defaultAddr?.id;
    }

    if (!targetId) {
      return NextResponse.json({ error: "No address found. Please add an address first." }, { status: 400 });
    }

    const address = await db.address.findFirst({
      where: { id: targetId, userId: session.user.id },
    });
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await db.address.update({
      where: { id: targetId },
      data: { deliveryInstructions: instructions?.trim() || null },
    });

    return NextResponse.json({ success: true, instructions: instructions?.trim() || "" });
  } catch (error) {
    console.error("Delivery instructions PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
