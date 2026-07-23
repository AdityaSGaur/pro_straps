"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ProductCard } from "@/components/shared/product-card";
import { ProductWithDetails } from "@/lib/data";

type InfiniteProductGridProps = {
  initialProducts: ProductWithDetails[];
  total: number;
  limit: number;
  activeFilters: Record<string, string>;
  sort: string;
};

export function InfiniteProductGrid({
  initialProducts,
  total,
  limit,
  activeFilters,
  sort,
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialProducts.length < total);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Sync state with parent server component when filters/page resets
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialProducts.length < total);
    setLoading(false);
  }, [initialProducts, total]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      
      // Append filters
      Object.entries(activeFilters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });
      
      params.set("sort", sort);
      params.set("page", String(nextPage));
      params.set("limit", String(limit));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch next page");
      
      const data = await res.json();
      const newProducts = data.products || [];

      setProducts((prev) => {
        // Prevent duplicate products in edge cases
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = newProducts.filter((p: ProductWithDetails) => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

      setPage(nextPage);
      setHasMore(products.length + newProducts.length < total);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, activeFilters, sort, limit, total, products.length]);

  useEffect(() => {
    if (!hasMore) return;

    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Pre-fetch when 200px from viewport bottom
    );

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [loadMoreProducts, hasMore]);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loader indicator element */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-10 flex items-center justify-center">
          <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
