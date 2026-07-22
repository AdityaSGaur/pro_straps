import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  SHIPPED: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const paymentColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
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

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusFilter = params.status || "";
  const page = Number(params.page) || 1;
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (statusFilter) {
    where.status = statusFilter;
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const statuses = ["", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusLabels: Record<string, string> = {
    "": "All",
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">orders</h1>
        <p className="text-sm text-muted-foreground">{total} order{total !== 1 ? "s" : ""} total</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const isActive = (statusFilter || "") === s;
          return (
            <Link
              key={s}
              href={`/admin/orders${s ? `?status=${s}` : ""}`}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#CCFF00] text-[#0A0A0A] dark:bg-[#CCFF00] dark:text-[#0A0A0A]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {statusLabels[s]}
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">order</TableHead>
              <TableHead className="text-xs">customer</TableHead>
              <TableHead className="text-xs text-center">items</TableHead>
              <TableHead className="text-xs text-right">total</TableHead>
              <TableHead className="text-xs">status</TableHead>
              <TableHead className="text-xs">payment</TableHead>
              <TableHead className="text-xs">date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                  no orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer">
                  <TableCell className="text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-[#CCFF00] dark:hover:text-[#CCFF00]">
                      #{order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.user?.name || order.user?.email || "Guest"}
                  </TableCell>
                  <TableCell className="text-center text-sm">{order.items.length}</TableCell>
                  <TableCell className="text-right text-sm font-medium">
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
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-medium ${paymentColors[order.paymentStatus] || ""}`}
                    >
                      {order.paymentStatus}
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
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/orders?page=${page - 1}&status=${statusFilter}`}
            className={`rounded-lg border px-3 py-1.5 text-xs ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
          >
            previous
          </Link>
          <span className="text-xs text-muted-foreground">
            page {page} of {totalPages}
          </span>
          <Link
            href={`/admin/orders?page=${page + 1}&status=${statusFilter}`}
            className={`rounded-lg border px-3 py-1.5 text-xs ${page >= totalPages ? "pointer-events-none opacity-50" : ""}`}
          >
            next
          </Link>
        </div>
      )}
    </div>
  );
}