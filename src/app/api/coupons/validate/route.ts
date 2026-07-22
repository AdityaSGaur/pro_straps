import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, orderValue } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, discount: 0, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    if (typeof orderValue !== "number" || orderValue <= 0) {
      return NextResponse.json(
        { valid: false, discount: 0, message: "Valid order value is required" },
        { status: 400 }
      );
    }

    // Find coupon — SQLite is case-sensitive, so we try exact match first
    const coupon = await db.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
      },
    });

    if (!coupon) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: "Invalid coupon code",
      });
    }

    // Check date range
    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: "Coupon is not active yet",
      });
    }
    if (coupon.validTo && coupon.validTo < now) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: "Coupon has expired",
      });
    }

    // Check minimum order value
    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
      return NextResponse.json({
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue} required`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round((orderValue * coupon.discountValue) / 100);
      // Cap at max discount
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = Math.round(coupon.maxDiscount);
      }
    } else if (coupon.discountType === "FIXED") {
      discount = Math.round(coupon.discountValue);
      if (discount > orderValue) {
        discount = Math.round(orderValue);
      }
    } else if (coupon.discountType === "FREE_SHIPPING") {
      discount = 0; // Shipping is handled separately
      return NextResponse.json({
        valid: true,
        discount: 0,
        message: "Free shipping applied!",
        freeShipping: true,
      });
    }

    return NextResponse.json({
      valid: true,
      discount,
      message: `You save ₹${discount}!`,
      discountType: coupon.discountType,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, discount: 0, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}