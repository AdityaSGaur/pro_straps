import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateUser, getUserOrders } from "@/lib/file-db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const months = parseInt(searchParams.get("months") || "24", 10);

    const user = getOrCreateUser(session.user.email, session.user.name);
    let orders = getUserOrders(user.id);

    const since = new Date();
    since.setMonth(since.getMonth() - months);

    // Filter by months in memory
    orders = orders.filter((o) => new Date(o.createdAt).getTime() >= since.getTime());

    // Filter by status in memory
    if (status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
