import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      revenueResult,
      recentOrders,
      monthlyOrders,
    ] = await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      // Last 6 months of orders
      db.$queryRawUnsafe<
        { month: string; count: number }[]
      >(`
        SELECT
          strftime('%Y-%m', createdAt) as month,
          COUNT(*) as count
        FROM "Order"
        WHERE createdAt >= datetime('now', '-6 months')
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
      `),
    ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: revenueResult._sum.total ?? 0,
      recentOrders,
      monthlyOrders,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}