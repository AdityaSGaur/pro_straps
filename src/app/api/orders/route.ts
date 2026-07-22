import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
      billingAddress?: AddressInput;
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

    // Calculate discount from coupon
    let discount = 0;
    let couponId: string | undefined;

    if (couponCode) {
      const coupon = await db.coupon.findFirst({
        where: { code: couponCode.toUpperCase(), isActive: true },
      });
      if (coupon) {
        const now = new Date();
        const dateValid =
          (!coupon.validFrom || coupon.validFrom <= now) &&
          (!coupon.validTo || coupon.validTo >= now);
        const minOrderValid =
          !coupon.minOrderValue || subtotal >= coupon.minOrderValue;

        if (dateValid && minOrderValid) {
          couponId = coupon.id;
          if (coupon.discountType === "PERCENTAGE") {
            discount = Math.round(
              (subtotal * coupon.discountValue) / 100
            );
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = Math.round(coupon.maxDiscount);
            }
          } else if (coupon.discountType === "FIXED") {
            discount = Math.round(coupon.discountValue);
            if (discount > subtotal) discount = Math.round(subtotal);
          }
        }
      }
    }

    // Calculate tax and shipping
    const tax = Math.round((subtotal - discount) * 0.18);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal - discount + tax + shipping;

    // Generate order number
    const orderNumber =
      "PS-" + Math.floor(100000 + Math.random() * 900000).toString();

    // Create order in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create shipping address
      const address = await tx.address.create({
        data: {
          label: "Order Address",
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || "India",
          phone: shippingAddress.phone,
          isDefault: false,
          userId: userId || undefined,
        },
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || undefined,
          status: "CONFIRMED",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
          subtotal,
          discount,
          tax,
          shipping,
          total,
          couponId,
          shippingAddressId: address.id,
          billingAddressId: address.id,
          notes,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          variantId: item.variantId || null,
          productName: item.productName,
          variantName: item.variantName || null,
          productImage: item.productImage || null,
          price: item.salePrice ?? item.price,
          quantity: item.quantity,
          total: (item.salePrice ?? item.price) * item.quantity,
        })),
      });

      // Create status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "CONFIRMED",
          note: "Order placed successfully",
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}