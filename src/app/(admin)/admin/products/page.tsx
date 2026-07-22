import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, PackageIcon } from "@/lib/icons";
import Image from "next/image";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  OUT_OF_STOCK: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  ARCHIVED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

const ITEMS_PER_PAGE = 20;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const statusFilter = params.status || "";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (statusFilter) {
    where.status = statusFilter;
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        variants: { select: { stock: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">products</h1>
          <p className="text-sm text-muted-foreground">
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button asChild className="rounded-lg">
          <Link href="/admin/products/new">
            <PlusIcon size={16} />
            add product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form className="relative flex-1" action="/admin/products">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            name="search"
            placeholder="Search products..."
            defaultValue={search}
            className="rounded-lg pl-9"
          />
        </form>
        <form action="/admin/products" method="get" className="flex gap-2">
          {search && <input type="hidden" name="search" value={search} />}
          <Select name="status" defaultValue={statusFilter}>
            <SelectTrigger className="w-full rounded-lg sm:w-44">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">product</TableHead>
              <TableHead className="text-xs">sku</TableHead>
              <TableHead className="text-xs text-right">price</TableHead>
              <TableHead className="text-xs text-right">stock</TableHead>
              <TableHead className="text-xs">status</TableHead>
              <TableHead className="text-xs text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                  no products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stock,
                  0
                );
                const primaryImage = product.images[0];
                const displayPrice = product.salePrice ?? product.basePrice;

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt || product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <PackageIcon size={16} className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[200px] truncate text-sm font-medium">
                          {product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatCurrency(displayPrice)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <span
                        className={
                          totalStock === 0
                            ? "text-red-500"
                            : totalStock <= 5
                              ? "text-yellow-500"
                              : ""
                        }
                      >
                        {totalStock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-medium ${statusColors[product.status] || ""}`}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <EditIcon size={14} />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <TrashIcon size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={page <= 1}
            asChild
          >
            <Link href={`/admin/products?page=${page - 1}&search=${search}&status=${statusFilter}`}>
              previous
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={page >= totalPages}
            asChild
          >
            <Link href={`/admin/products?page=${page + 1}&search=${search}&status=${statusFilter}`}>
              next
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}