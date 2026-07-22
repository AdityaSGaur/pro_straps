import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const months = parseInt(searchParams.get("months") || "24", 10);

    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const where: Record<string, unknown> = {
      userId: session.user.id,
      createdAt: { gte: since },
    };

    if (status !== "ALL") {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
