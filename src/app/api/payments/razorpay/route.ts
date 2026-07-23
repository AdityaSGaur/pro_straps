import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    const body = await request.json();
    const { amount, currency = "INR", receipt } = body as {
      amount: number;
      currency?: string;
      receipt: string;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    let order;

    if (!key_id || !key_secret) {
      // Simulate Razorpay order creation when keys are missing
      order = {
        id: "order_mock_" + Math.random().toString(36).substr(2, 9),
        amount: Math.round(amount * 100),
        currency,
      };
    } else {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      // Razorpay expects amount in paise (smallest currency unit)
      const amountInPaise = Math.round(amount * 100);

      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes: {
          source: "prostraps-checkout",
        },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id || "mock_key_id",
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
