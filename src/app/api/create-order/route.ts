import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { amount, currency = "INR", receipt } = body as {
      amount: number; // in paise
      currency?: string;
      receipt: string;
    };

    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    // Minimum amount: 100 paise
    if (typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (1 INR)" },
        { status: 400 }
      );
    }

    let order;

    if (!key_id || !key_secret) {
      // Simulate Razorpay order creation when keys are missing
      order = {
        id: "order_mock_" + Math.random().toString(36).substr(2, 9),
        amount,
        currency,
      };
    } else {
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      });

      order = await razorpay.orders.create({
        amount,
        currency,
        receipt,
        notes: {
          source: "prostraps-checkout",
        },
      });
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { error: error.description || error.message || "Failed to create payment order" },
      { status }
    );
  }
}
