"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  LocationIcon,
  CheckIcon,
  PhoneIcon,
} from "@/lib/icons";

type Address = {
  id: string; label: string | null; street: string; city: string; state: string;
  postalCode: string; country: string; phone: string | null;
  deliveryInstructions: string | null; isDefault: boolean;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  
  function emptyForm() {
    return {
      label: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
      deliveryInstructions: "",
      isDefault: false,
    };
  }
  
  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/account/addresses");
      const data = await res.json();
      if (Array.isArray(data)) setAddresses(data);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  
  function openAdd() {
    setEditId(null);
    setForm(emptyForm());
    setModalOpen(true);
  }
  
  function openEdit(addr: Address) {
    setEditId(addr.id);
    setForm({
      label: addr.label || "",
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || "India",
      phone: addr.phone || "",
      deliveryInstructions: addr.deliveryInstructions || "",
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  }
  
  async function handleSave() {
    if (!form.street.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/account/addresses/${editId}` : "/api/account/addresses";
      const res = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editId ? "Address updated" : "Address added");
        setModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  }
  
  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/account/addresses/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        fetchAddresses();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }
  
  async function setDefault(id: string) {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to update");
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">manage your shipping addresses</p>
        </div>
        <Button onClick={openAdd} size="sm" className="rounded-full gap-1.5">
          <PlusIcon size={16} />
          add
        </Button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">saved addresses</h2>
        <Button onClick={openAdd} size="sm" className="rounded-full gap-1.5">
          <PlusIcon size={16} />
          add new address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
          <LocationIcon size={40} className="text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-1">no saved addresses</h3>
          <p className="text-sm text-muted-foreground mb-4">Add a shipping address for faster checkout.</p>
          <Button onClick={openAdd} className="rounded-full gap-1.5">
            <PlusIcon size={16} />
            add your first address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="rounded-2xl border border-border/50 bg-card p-5 space-y-3 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {addr.label && (
                    <Badge variant="secondary" className="rounded-full text-[11px]">
                      {addr.label}
                    </Badge>
                  )}
                  {addr.isDefault && (
                    <Badge className="rounded-full bg-[#CCFF00] text-[#0A0A0A] text-[11px] border-0 font-semibold">
                      default
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                <p className="text-foreground leading-relaxed">{addr.street}</p>
                <p className="text-foreground">{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p className="text-foreground">{addr.country}</p>
                {addr.phone && (
                  <p className="text-muted-foreground flex items-center gap-1.5 mt-2">
                    <PhoneIcon size={12} />
                    {addr.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 h-8 px-3"
                  onClick={() => openEdit(addr)}
                >
                  <EditIcon size={12} />
                  edit
                </Button>
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 h-8 px-3"
                    onClick={() => setDefault(addr.id)}
                  >
                    <CheckIcon size={12} />
                    set default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1 h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => setDeleteId(addr.id)}
                >
                  <TrashIcon size={12} />
                  delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="lowercase">
              {editId ? "edit address" : "add new address"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-xs">label (e.g. home, office)</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="home"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street" className="text-xs">street address *</Label>
              <Textarea
                id="street"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="House/flat no., building, street"
                className="rounded-xl min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs">city *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-xs">state *</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-xs">postal code *</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs">phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-xs">delivery instructions</Label>
              <Textarea
                id="instructions"
                value={form.deliveryInstructions}
                onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })}
                placeholder="e.g. Leave at the security gate, ring the bell twice..."
                className="rounded-xl min-h-[60px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={form.isDefault}
                onCheckedChange={(checked) => setForm({ ...form, isDefault: !!checked })}
              />
              <Label htmlFor="isDefault" className="text-sm cursor-pointer">set as default address</Label>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving} className="rounded-full flex-1 h-10 text-sm font-semibold">
              {saving ? "saving..." : editId ? "update address" : "add address"}
            </Button>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-full h-10 px-6 text-sm">
              cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="lowercase">delete address?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The address will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-destructive text-white hover:bg-destructive/90"
            >
              delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
