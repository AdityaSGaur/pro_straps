"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  GridIcon,
} from "@/lib/icons";
import { toast } from "sonner";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  sortOrder: number;
  isActive: boolean;
  _count: { products: number };
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  banner: "",
  sortOrder: "0",
  isActive: true,
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadCollections = async () => {
    try {
      const res = await fetch("/api/search?types=collection");
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCollections(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (col: Collection) => {
    setEditingId(col.id);
    setForm({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      image: col.image || "",
      banner: col.banner || "",
      sortOrder: String(col.sortOrder),
      isActive: col.isActive,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const body = { ...form, sortOrder: Number(form.sortOrder) };
      if (editingId) {
        const res = await fetch(`/api/collections/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success("Collection updated");
      } else {
        const res = await fetch("/api/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error();
        toast.success("Collection created");
      }
      setDialogOpen(false);
      loadCollections();
    } catch {
      toast.error("Failed to save collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await fetch(`/api/collections/${id}`, { method: "DELETE" });
      toast.success("Collection deleted");
      loadCollections();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (col: Collection) => {
    try {
      await fetch(`/api/collections/${col.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...col, isActive: !col.isActive }),
      });
      loadCollections();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">collections</h1>
          <p className="text-sm text-muted-foreground">
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={openNew} className="rounded-lg">
          <PlusIcon size={16} />
          add collection
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">name</TableHead>
              <TableHead className="text-xs">slug</TableHead>
              <TableHead className="text-xs text-right">products</TableHead>
              <TableHead className="text-xs">sort order</TableHead>
              <TableHead className="text-xs">status</TableHead>
              <TableHead className="text-xs text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  loading...
                </TableCell>
              </TableRow>
            ) : collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <GridIcon size={24} className="mx-auto mb-2 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">no collections yet</span>
                </TableCell>
              </TableRow>
            ) : (
              collections.map((col) => (
                <TableRow key={col.id}>
                  <TableCell className="text-sm font-medium">{col.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{col.slug}</TableCell>
                  <TableCell className="text-right text-sm">{col._count.products}</TableCell>
                  <TableCell className="text-sm">{col.sortOrder}</TableCell>
                  <TableCell>
                    <Badge
                      variant={col.isActive ? "default" : "secondary"}
                      className="cursor-pointer rounded-lg text-[10px]"
                      onClick={() => toggleActive(col)}
                    >
                      {col.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(col)}>
                        <EditIcon size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(col.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-semibold">
              {editingId ? "edit collection" : "new collection"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Collection name"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="collection-slug"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>image url</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>banner url</Label>
              <Input
                value={form.banner}
                onChange={(e) => setForm({ ...form, banner: e.target.value })}
                placeholder="https://..."
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>sort order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label className="cursor-pointer">active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" className="rounded-lg" onClick={() => setDialogOpen(false)}>
                cancel
              </Button>
              <Button className="rounded-lg" onClick={handleSave} disabled={!form.name}>
                {editingId ? "update" : "create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}