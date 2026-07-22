import { db } from "@/lib/db";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarIcon, TrashIcon, CheckIcon, CloseIcon } from "@/lib/icons";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

async function toggleApproval(id: string, isApproved: boolean) {
  "use server";
  await db.review.update({ where: { id }, data: { isApproved: !isApproved } });
}

async function deleteReview(id: string) {
  "use server";
  await db.review.delete({ where: { id } });
}

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">reviews</h1>
        <p className="text-sm text-muted-foreground">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">product</TableHead>
              <TableHead className="text-xs">reviewer</TableHead>
              <TableHead className="text-xs text-center">rating</TableHead>
              <TableHead className="text-xs">title</TableHead>
              <TableHead className="text-xs text-center">verified</TableHead>
              <TableHead className="text-xs text-center">approved</TableHead>
              <TableHead className="text-xs text-center">helpful</TableHead>
              <TableHead className="text-xs">date</TableHead>
              <TableHead className="text-xs text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-sm text-muted-foreground">
                  no reviews yet
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Link
                      href={`/products/${review.product.slug}`}
                      className="max-w-[150px] truncate text-sm font-medium hover:text-[#CCFF00]"
                    >
                      {review.product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {review.user?.name || review.user?.email || "Anonymous"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-[#CCFF00] text-[#CCFF00]"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm">
                    {review.title || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {review.isVerified ? (
                      <CheckIcon size={14} className="mx-auto text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={review.isApproved ? "default" : "secondary"}
                      className="text-[10px] rounded-lg"
                    >
                      {review.isApproved ? "approved" : "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {review.helpfulCount}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <form action={toggleApproval.bind(null, review.id, review.isApproved)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title={review.isApproved ? "Reject" : "Approve"}
                        >
                          {review.isApproved ? (
                            <CloseIcon size={14} className="text-yellow-500" />
                          ) : (
                            <CheckIcon size={14} className="text-green-500" />
                          )}
                        </Button>
                      </form>
                      <form action={deleteReview.bind(null, review.id)}>
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <TrashIcon size={14} />
                        </Button>
                      </form>
                    </div>
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