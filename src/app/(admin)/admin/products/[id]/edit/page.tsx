"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  LoadingIcon,
} from "@/lib/icons";
import { toast } from "sonner";
import Link from "next/link";

interface Variant {
  sku: string;
  color: string;
  colorName: string;
  width: string;
  length: string;
  material: string;
  buckleColor: string;
  buckleFinish: string;
  price: string;
  salePrice: string;
  stock: string;
  isActive: boolean;
}

interface ImageItem {
  url: string;
  alt: string;
  isPrimary: boolean;
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const emptyVariant: Variant = {
  sku: "", color: "", colorName: "", width: "", length: "",
  material: "", buckleColor: "", buckleFinish: "", price: "",
  salePrice: "", stock: "0", isActive: true,
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [strapType, setStrapType] = useState("");
  const [buckleType, setBuckleType] = useState("");
  const [watchType, setWatchType] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([{ ...emptyVariant }]);
  const [images, setImages] = useState<ImageItem[]>([{ url: "", alt: "", isPrimary: false }]);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableCollections, setAvailableCollections] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [productRes, catRes, colRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch("/api/search?types=category"),
          fetch("/api/search?types=collection"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories) setAvailableCategories(catData.categories);
        }
        if (colRes.ok) {
          const colData = await colRes.json();
          if (colData.collections) setAvailableCollections(colData.collections);
        }

        if (!productRes.ok) throw new Error("Product not found");
        const product = await productRes.json();

        setName(product.name || "");
        setSlug(product.slug || "");
        setShortDesc(product.shortDesc || "");
        setDescription(product.description || "");
        setBasePrice(String(product.basePrice || ""));
        setSalePrice(product.salePrice ? String(product.salePrice) : "");
        setCostPrice(product.costPrice ? String(product.costPrice) : "");
        setSku(product.sku || "");
        setBarcode(product.barcode || "");
        setStatus(product.status || "DRAFT");
        setStrapType(product.strapType || "");
        setBuckleType(product.buckleType || "");
        setWatchType(product.watchType || "");
        setIsFeatured(product.isFeatured || false);
        setIsNewArrival(product.isNewArrival || false);
        setIsBestseller(product.isBestseller || false);
        setMetaTitle(product.metaTitle || "");
        setMetaDescription(product.metaDescription || "");
        setCategoryIds((product.categories || []).map((c: { categoryId: string }) => c.categoryId));
        setCollectionIds((product.collections || []).map((c: { collectionId: string }) => c.collectionId));

        if (product.variants?.length > 0) {
          setVariants(
            product.variants.map((v: Record<string, unknown>) => ({
              sku: (v.sku as string) || "",
              color: (v.color as string) || "",
              colorName: (v.colorName as string) || "",
              width: (v.width as string) || "",
              length: (v.length as string) || "",
              material: (v.material as string) || "",
              buckleColor: (v.buckleColor as string) || "",
              buckleFinish: (v.buckleFinish as string) || "",
              price: String(v.price || ""),
              salePrice: v.salePrice ? String(v.salePrice) : "",
              stock: String(v.stock || 0),
              isActive: v.isActive !== false,
            }))
          );
        }

        if (product.images?.length > 0) {
          setImages(
            product.images.map((img: Record<string, unknown>) => ({
              url: (img.url as string) || "",
              alt: (img.alt as string) || "",
              isPrimary: (img.isPrimary as boolean) || false,
            }))
          );
        }
      } catch {
        toast.error("Failed to load product");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const addVariant = () => setVariants([...variants, { ...emptyVariant, sku: `${sku}-V${variants.length + 1}` }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof Variant, value: string | boolean) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImage = () => setImages([...images, { url: "", alt: "", isPrimary: false }]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, field: keyof ImageItem, value: string | boolean) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "isPrimary" && value === true) {
      updated.forEach((img, i) => {
        if (i !== index) updated[i] = { ...updated[i], isPrimary: false };
      });
    }
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, slug, shortDesc, description,
          basePrice: Number(basePrice),
          salePrice: salePrice ? Number(salePrice) : null,
          costPrice: costPrice ? Number(costPrice) : null,
          sku, barcode, status, isFeatured, isNewArrival, isBestseller,
          strapType: strapType || null,
          buckleType: buckleType || null,
          watchType: watchType || null,
          metaTitle, metaDescription,
          variants: variants.filter((v) => v.sku),
          images: images.filter((img) => img.url),
          categoryIds, collectionIds,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingIcon size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" asChild>
          <Link href="/admin/products"><ArrowLeftIcon size={16} /></Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl font-bold">edit product</h1>
          <p className="text-sm text-muted-foreground">update product details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="space-y-4 rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">basic information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">product name *</Label>
              <Input id="name" value={name} onChange={(e) => { setName(e.target.value); }} placeholder="Premium Leather Strap" required className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">sku *</Label>
              <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required className="rounded-lg" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="shortDesc">short description</Label>
              <Input id="shortDesc" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="rounded-lg" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="rounded-lg" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4 rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">pricing</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>base price (₹) *</Label>
              <Input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required min="0" step="0.01" className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label>sale price (₹)</Label>
              <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} min="0" step="0.01" className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label>cost price (₹)</Label>
              <Input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} min="0" step="0.01" className="rounded-lg" />
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="space-y-4 rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">product details</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>strap type</Label>
              <Select value={strapType} onValueChange={setStrapType}>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEATHER">Leather</SelectItem>
                  <SelectItem value="SILICONE">Silicone</SelectItem>
                  <SelectItem value="METAL">Metal</SelectItem>
                  <SelectItem value="NATO">NATO</SelectItem>
                  <SelectItem value="RUBBER">Rubber</SelectItem>
                  <SelectItem value="FABRIC">Fabric</SelectItem>
                  <SelectItem value="MILANESE">Milanese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>buckle type</Label>
              <Select value={buckleType} onValueChange={setBuckleType}>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIN">Pin</SelectItem>
                  <SelectItem value="DEPLOYANT">Deployant</SelectItem>
                  <SelectItem value="BUTTERFLY">Butterfly</SelectItem>
                  <SelectItem value="MAGNETIC">Magnetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>watch type</Label>
              <Select value={watchType} onValueChange={setWatchType}>
                <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SMART">Smart</SelectItem>
                  <SelectItem value="TRADITIONAL">Traditional</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 sm:max-w-xs">
            <Label>barcode</Label>
            <Input value={barcode} onChange={(e) => setBarcode(e.target.value)} className="rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="isFeatured" />
              <Label htmlFor="isFeatured" className="cursor-pointer">featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isNewArrival} onCheckedChange={setIsNewArrival} id="isNewArrival" />
              <Label htmlFor="isNewArrival" className="cursor-pointer">new arrival</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isBestseller} onCheckedChange={setIsBestseller} id="isBestseller" />
              <Label htmlFor="isBestseller" className="cursor-pointer">bestseller</Label>
            </div>
          </div>
        </section>

        {/* Categories & Collections */}
        <section className="space-y-4 rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">categories & collections</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>categories</Label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border p-3">
                {availableCategories.length === 0 && <span className="text-xs text-muted-foreground">No categories</span>}
                {availableCategories.map((cat) => (
                  <Badge key={cat.id} variant={categoryIds.includes(cat.id) ? "default" : "outline"} className="cursor-pointer rounded-lg" onClick={() => setCategoryIds((p) => p.includes(cat.id) ? p.filter((c) => c !== cat.id) : [...p, cat.id])}>
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>collections</Label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-lg border p-3">
                {availableCollections.length === 0 && <span className="text-xs text-muted-foreground">No collections</span>}
                {availableCollections.map((col) => (
                  <Badge key={col.id} variant={collectionIds.includes(col.id) ? "default" : "outline"} className="cursor-pointer rounded-lg" onClick={() => setCollectionIds((p) => p.includes(col.id) ? p.filter((c) => c !== col.id) : [...p, col.id])}>
                    {col.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">variants</h2>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addVariant}>
              <PlusIcon size={14} /> add variant
            </Button>
          </div>
          <div className="space-y-4">
            {variants.map((variant, idx) => (
              <div key={idx} className="relative rounded-lg border p-4">
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 text-red-500 hover:text-red-600" onClick={() => removeVariant(idx)} disabled={variants.length === 1}>
                  <TrashIcon size={14} />
                </Button>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { key: "sku" as const, label: "sku *", required: true },
                    { key: "color" as const, label: "color" },
                    { key: "colorName" as const, label: "color name" },
                    { key: "material" as const, label: "material" },
                    { key: "width" as const, label: "width" },
                    { key: "length" as const, label: "length" },
                    { key: "buckleColor" as const, label: "buckle color" },
                    { key: "buckleFinish" as const, label: "buckle finish" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label className="text-xs">{field.label}</Label>
                      <Input
                        value={variant[field.key]}
                        onChange={(e) => updateVariant(idx, field.key, e.target.value)}
                        required={field.required}
                        className="rounded-lg"
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label className="text-xs">price (₹) *</Label>
                    <Input type="number" value={variant.price} onChange={(e) => updateVariant(idx, "price", e.target.value)} min="0" required className="rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">sale price (₹)</Label>
                    <Input type="number" value={variant.salePrice} onChange={(e) => updateVariant(idx, "salePrice", e.target.value)} min="0" className="rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">stock</Label>
                    <Input type="number" value={variant.stock} onChange={(e) => updateVariant(idx, "stock", e.target.value)} min="0" className="rounded-lg" />
                  </div>
                  <div className="flex items-end pb-1">
                    <div className="flex items-center gap-2">
                      <Switch checked={variant.isActive} onCheckedChange={(v) => updateVariant(idx, "isActive", v)} />
                      <Label className="text-xs">active</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">images</h2>
            <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addImage}>
              <PlusIcon size={14} /> add image
            </Button>
          </div>
          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {img.url && (
                    <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input value={img.url} onChange={(e) => updateImage(idx, "url", e.target.value)} placeholder="Image URL" className="rounded-lg" />
                  <Input value={img.alt} onChange={(e) => updateImage(idx, "alt", e.target.value)} placeholder="Alt text" className="rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs">
                    <input type="radio" name="primaryImage" checked={img.isPrimary} onChange={() => updateImage(idx, "isPrimary", true)} className="accent-[#CCFF00]" />
                    primary
                  </label>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => removeImage(idx)} disabled={images.length === 1}>
                    <TrashIcon size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section className="space-y-4 rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">seo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>meta title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta title" className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label>meta description</Label>
              <Input value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Meta description" className="rounded-lg" />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="rounded-lg">
            {saving ? "saving..." : "save changes"}
          </Button>
          <Button type="button" variant="outline" className="rounded-lg" asChild>
            <Link href="/admin/products">cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}