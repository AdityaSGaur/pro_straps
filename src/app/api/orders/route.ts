import { NextResponse } from "next/server";
import { createOrder, getOrCreateUser } from "@/lib/file-db";

interface OrderItemInput {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  productImage: string;
  variantName: string;
  price: number;
  salePrice: number | null;
  quantity: number;
}

interface AddressInput {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode,
      notes,
      userId,
    } = body as {
      items: OrderItemInput[];
      shippingAddress: AddressInput;
      paymentMethod: string;
      couponCode?: string;
      notes?: string;
      userId?: string | null;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + (item.salePrice ?? item.price) * item.quantity,
      0
    );

    // Calculate discount from coupon (mock simple 10% coupon validation)
    let discount = 0;
    if (couponCode) {
      // Mock code check
      discount = Math.round(subtotal * 0.1);
    }

    // Calculate tax and shipping
    const tax = Math.round((subtotal - discount) * 0.18);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + tax + shipping;

    // Use file-db to persist the order
    let finalUserId = userId;
    if (!finalUserId && shippingAddress.email) {
      const user = getOrCreateUser(shippingAddress.email, shippingAddress.name);
      finalUserId = user.id;
    }

    const savedOrder = createOrder({
      userId: finalUserId || "guest",
      total,
      paymentMethod,
      shippingAddress,
      items,
    });

    return NextResponse.json({
      orderId: savedOrder.id,
      orderNumber: savedOrder.orderNumber,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}