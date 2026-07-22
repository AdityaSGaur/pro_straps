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

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const customerData = customers.map((c) => {
    const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
    return { ...c, totalSpent };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">customers</h1>
        <p className="text-sm text-muted-foreground">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">name</TableHead>
              <TableHead className="text-xs">email</TableHead>
              <TableHead className="text-xs">phone</TableHead>
              <TableHead className="text-xs text-center">orders</TableHead>
              <TableHead className="text-xs text-right">total spent</TableHead>
              <TableHead className="text-xs">joined</TableHead>
              <TableHead className="text-xs">status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                  no customers yet
                </TableCell>
              </TableRow>
            ) : (
              customerData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-sm font-medium">
                    {customer.name || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.phone || "—"}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {customer._count.orders}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(customer.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.isActive ? "default" : "secondary"}
                      className="text-[10px] rounded-lg"
                    >
                      {customer.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}