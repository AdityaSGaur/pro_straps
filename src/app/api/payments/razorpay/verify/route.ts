import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      orderData: {
        items: {
          id: string;
          productId: string;
          variantId: string;
          productName: string;
          productImage: string;
          variantName: string;
          price: number;
          salePrice: number | null;
          quantity: number;
        }[];
        shippingAddress: {
          name: string;
          email: string;
          phone: string;
          street: string;
          city: string;
          state: string;
          postalCode: string;
          country: string;
        };
        paymentMethod: string;
        couponCode?: string;
        notes?: string;
        userId?: string | null;
        subtotal: number;
        discount: number;
        tax: number;
        shipping: number;
        total: number;
        couponId?: string;
      };
    };

    // 1. Verify the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed — invalid signature" },
        { status: 400 }
      );
    }

    // 2. Signature is valid — create the order
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
      userId,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      couponId,
    } = orderData;

    const orderNumber =
      "PS-" + Math.floor(100000 + Math.random() * 900000).toString();

    const order = await db.$transaction(async (tx) => {
      // Find or create effective user ID for address association
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        let guestUser = await tx.user.findFirst({
          where: { email: shippingAddress.email || "guest@prostraps.com" },
        });
        if (!guestUser) {
          guestUser = await tx.user.create({
            data: {
              email:
                shippingAddress.email ||
                `guest_${Date.now()}@prostraps.com`,
              name: shippingAddress.name || "Guest Customer",
              phone: shippingAddress.phone,
              role: "CUSTOMER",
            },
          });
        }
        effectiveUserId = guestUser.id;
      }

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
          userId: effectiveUserId,
        },
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: userId || undefined,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
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

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: "RAZORPAY",
          transactionId: razorpay_payment_id,
          amount: total,
          status: "COMPLETED",
          metadata: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentMethod,
          }),
        },
      });

      // Create status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          status: "CONFIRMED",
          note: `Order placed — paid via Razorpay (${razorpay_payment_id})`,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment and create order" },
      { status: 500 }
    );
  }
}
