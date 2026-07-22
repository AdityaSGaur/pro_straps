import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUpIcon,
  ShoppingBagIcon,
  PackageIcon,
  UserIcon,
} from "@/lib/icons";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SHIPPED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalCustomers, revenueResult, recentOrders, monthlyOrders] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      db.$queryRaw<{ month: string; count: number }[]>`
        SELECT
          strftime('%Y-%m', createdAt) as month,
          COUNT(*) as count
        FROM "Order"
        WHERE createdAt >= datetime('now', '-6 months')
        GROUP BY strftime('%Y-%m', createdAt)
        ORDER BY month ASC
      `,
    ]);

  const totalRevenue = revenueResult._sum.total ?? 0;
  const maxOrders = Math.max(...monthlyOrders.map((m) => m.count), 1);

  // Generate last 6 months labels for chart
  const monthLabels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthLabels.push(d.toLocaleString("en-IN", { month: "short" }));
  }

  // Map actual data to chart bars
  const chartData = monthLabels.map((label, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - idx), 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const found = monthlyOrders.find((m) => m.month === monthKey);
    return { label, count: found?.count ?? 0 };
  });

  const statCards = [
    {
      title: "total revenue",
      value: formatCurrency(totalRevenue),
      icon: TrendingUpIcon,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "total orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBagIcon,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "total products",
      value: totalProducts.toLocaleString(),
      icon: PackageIcon,
      change: "+3",
      changeType: "neutral" as const,
    },
    {
      title: "total customers",
      value: totalCustomers.toLocaleString(),
      icon: UserIcon,
      change: "+5.1%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">dashboard</h1>
        <p className="text-sm text-muted-foreground">
          overview of your store performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <span
                  className={
                    card.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }
                >
                  {card.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Bar Chart */}
        <Card className="rounded-xl lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">orders this year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-3">
              {chartData.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-[#CCFF00] transition-all dark:bg-[#CCFF00]"
                    style={{
                      height: `${Math.max((item.count / maxOrders) * 160, 4)}px`,
                      minHeight: item.count > 0 ? "4px" : "2px",
                      backgroundColor: item.count > 0 ? "#CCFF00" : "var(--border)",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="rounded-xl lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">recent orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">order</TableHead>
                  <TableHead className="text-xs">customer</TableHead>
                  <TableHead className="text-xs text-right">total</TableHead>
                  <TableHead className="text-xs">status</TableHead>
                  <TableHead className="text-xs">date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      no orders yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer">
                      <TableCell className="text-xs font-medium">
                        #{order.orderNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        {order.user?.name || order.user?.email || "Guest"}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-medium ${statusColors[order.status] || ""}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}