"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  TagIcon,
} from "@/lib/icons";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  validFrom: string | null;
  validTo: string | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  isFirstOrder: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { orders: number; usages: number };
}

const emptyForm = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  validFrom: "",
  validTo: "",
  usageLimit: "",
  perUserLimit: "",
  isFirstOrder: false,
  isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || data || []);
      }
    } catch {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      validFrom: coupon.validFrom ? coupon.validFrom.split("T")[0] : "",
      validTo: coupon.validTo ? coupon.validTo.split("T")[0] : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      perUserLimit: coupon.perUserLimit ? String(coupon.perUserLimit) : "",
      isFirstOrder: coupon.isFirstOrder,
      isActive: coupon.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const body = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : null,
        validFrom: form.validFrom || null,
        validTo: form.validTo || null,
      };

      if (editingId) {
        const res = await fetch(`/api/coupons/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success("Coupon updated");
      } else {
        const res = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success("Coupon created");
      }
      setDialogOpen(false);
      loadCoupons();
    } catch {
      toast.error("Failed to save coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      toast.success("Coupon deleted");
      loadCoupons();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await fetch(`/api/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
      });
      loadCoupons();
    } catch {
      toast.error("Failed to update");
    }
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === "FREE_SHIPPING") return "Free Shipping";
    if (type === "PERCENTAGE") return `${value}%`;
    return `₹${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">coupons</h1>
          <p className="text-sm text-muted-foreground">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} className="rounded-lg">
          <PlusIcon size={16} />
          add coupon
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">code</TableHead>
              <TableHead className="text-xs">discount</TableHead>
              <TableHead className="text-xs text-right">min order</TableHead>
              <TableHead className="text-xs">usage</TableHead>
              <TableHead className="text-xs">valid</TableHead>
              <TableHead className="text-xs">status</TableHead>
              <TableHead className="text-xs text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                  loading...
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <TagIcon size={24} className="mx-auto mb-2 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">no coupons yet</span>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono text-sm font-bold uppercase">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDiscount(coupon.discountType, coupon.discountValue)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {coupon._count.usages}
                    {coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {coupon.validFrom
                      ? `${new Date(coupon.validFrom).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
                      : "—"}
                    {" → "}
                    {coupon.validTo
                      ? `${new Date(coupon.validTo).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coupon.isActive ? "default" : "secondary"}
                      className="cursor-pointer rounded-lg text-[10px]"
                      onClick={() => toggleActive(coupon)}
                    >
                      {coupon.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(coupon)}>
                        <EditIcon size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(coupon.id)}>
                        <TrashIcon size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              {editingId ? "edit coupon" : "new coupon"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>coupon code *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  className="rounded-lg font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>discount type</Label>
                <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount</SelectItem>
                    <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.discountType !== "FREE_SHIPPING" && (
              <div className="space-y-2">
                <Label>discount value *</Label>
                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "PERCENTAGE" ? "20" : "500"}
                  min="0"
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>min order value (₹)</Label>
                <Input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                  placeholder="1000"
                  min="0"
                  className="rounded-lg"
                />
              </div>
              {form.discountType === "PERCENTAGE" && (
                <div className="space-y-2">
                  <Label>max discount (₹)</Label>
                  <Input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    placeholder="2000"
                    min="0"
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>valid from</Label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>valid to</Label>
                <Input
                  type="date"
                  value={form.validTo}
                  onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>total usage limit</Label>
                <Input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="Unlimited"
                  min="0"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>per user limit</Label>
                <Input
                  type="number"
                  value={form.perUserLimit}
                  onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })}
                  placeholder="Unlimited"
                  min="0"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.isFirstOrder} onCheckedChange={(v) => setForm({ ...form, isFirstOrder: v })} />
                <Label className="cursor-pointer">first order only</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                <Label className="cursor-pointer">active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="rounded-lg" onClick={() => setDialogOpen(false)}>
                cancel
              </Button>
              <Button className="rounded-lg" onClick={handleSave} disabled={!form.code || !form.discountValue}>
                {editingId ? "update" : "create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}