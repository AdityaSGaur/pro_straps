"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  LocationIcon,
  ClockIcon,
  CheckIcon,
} from "@/lib/icons";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

interface OrderType {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  user: { name: string | null; email: string; phone: string | null } | null;
  items: {
    id: string;
    productName: string;
    variantName: string | null;
    productImage: string | null;
    price: number;
    quantity: number;
    total: number;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
  } | null;
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string | null;
  } | null;
  statusHistory: {
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setOrder(data);
        setNewStatus(data.status);
        setAdminNotes(data.adminNotes || "");
      } catch {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Status updated");
      const data = await res.json();
      setOrder((prev) => prev ? { ...prev, status: data.status } : prev);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground">order not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" asChild>
          <Link href="/admin/orders"><ArrowLeftIcon size={16} /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold">
            order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="w-40 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="rounded-lg"
            onClick={handleStatusUpdate}
            disabled={saving || newStatus === order.status}
          >
            update status
          </Button>
        </div>
      </div>

      {/* Status & Payment */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className={`text-xs font-medium ${statusColors[order.status] || ""}`}>
          {order.status}
        </Badge>
        <Badge variant="secondary" className={`text-xs font-medium ${paymentColors[order.paymentStatus] || ""}`}>
          payment: {order.paymentStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">order items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">product</TableHead>
                    <TableHead className="text-xs">variant</TableHead>
                    <TableHead className="text-xs text-center">qty</TableHead>
                    <TableHead className="text-xs text-right">price</TableHead>
                    <TableHead className="text-xs text-right">total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.productImage && (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium">{item.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.variantName || "—"}
                      </TableCell>
                      <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Totals */}
              <div className="ml-auto max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">status history</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4 pl-6">
                <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-border" />
                {order.statusHistory.map((entry) => (
                  <div key={entry.id} className="relative flex gap-3">
                    <div className="absolute -left-6 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#CCFF00]">
                      <CheckIcon size={10} className="text-[#0A0A0A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{entry.status}</p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground">{entry.note}</p>
                      )}
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {order.statusHistory.length === 0 && (
                  <p className="text-xs text-muted-foreground">no status history yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">admin notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this order..."
                rows={3}
                className="rounded-lg"
              />
              <Button
                size="sm"
                className="rounded-lg"
                onClick={handleSaveNotes}
                disabled={saving}
              >
                save notes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.user ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon size={14} className="text-muted-foreground" />
                    {order.user.name || "Unknown"}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon size={14} className="text-muted-foreground" />
                    {order.user.email}
                  </div>
                  {order.user.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon size={14} className="text-muted-foreground" />
                      {order.user.phone}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Guest order</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                <span className="flex items-center gap-2">
                  <LocationIcon size={14} />
                  shipping address
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">no shipping address</p>
              )}
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">billing address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.billingAddress ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.billingAddress.name}</p>
                  <p className="text-muted-foreground">{order.billingAddress.street}</p>
                  <p className="text-muted-foreground">
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.postalCode}
                  </p>
                  <p className="text-muted-foreground">{order.billingAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">same as shipping</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}