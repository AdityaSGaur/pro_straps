import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateUser, getUserAddresses, addAddress } from "@/lib/file-db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getOrCreateUser(session.user.email, session.user.name);
    const addresses = getUserAddresses(user.id);

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = getOrCreateUser(session.user.email, session.user.name);
    const body = await req.json();
    const { label, street, city, state, postalCode, country, phone, deliveryInstructions, isDefault } = body;

    if (!street?.trim() || !city?.trim() || !state?.trim() || !postalCode?.trim()) {
      return NextResponse.json({ error: "Street, city, state, and postal code are required" }, { status: 400 });
    }

    const newAddress = addAddress(user.id, {
      label: label?.trim() || null,
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country?.trim() || "India",
      phone: phone?.trim() || null,
      deliveryInstructions: deliveryInstructions?.trim() || null,
      isDefault: isDefault || false,
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Addresses POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
