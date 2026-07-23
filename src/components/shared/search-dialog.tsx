"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon, XIcon, ArrowRightIcon, ClockIcon, TrendingUpIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  basePrice: number;
  salePrice: number | null;
  images: { url: string; alt: string | null; isPrimary: boolean }[];
}

export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches] = useState<string[]>(["leather", "silicone", "nato", "milanese"]);
  const [popularSearches] = useState<string[]>(["apple watch", "sport band", "premium leather", "best seller"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 pt-16">
          <SheetTitle className="sr-only">Search Products</SheetTitle>
        <p className="sr-only">Search for watch straps, materials, and brands</p>
          <div className="flex items-center gap-3">
            <SearchIcon size={20} className="text-muted-foreground flex-shrink-0" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search for straps, materials, brands..."
              className="border-0 shadow-none text-xl focus-visible:ring-0 px-1 h-12 py-3 placeholder:text-muted-foreground/60 text-foreground w-full bg-transparent dark:bg-transparent"
            />
            {query && (
              <button onClick={() => setQuery("")} className="p-1">
                <XIcon size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 border-2 border-lime border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                no results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                try searching for &ldquo;leather&rdquo; or &ldquo;sport&rdquo;
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-1">
                {results.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/products/${product.slug}`);
                    }}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-foreground/80">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.shortDesc}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {product.salePrice ? (
                        <div>
                          <span className="text-sm font-bold text-foreground">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through ml-1.5">
                            {formatPrice(product.basePrice)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold">
                          {formatPrice(product.basePrice)}
                        </span>
                      )}
                    </div>
                    <ArrowRightIcon size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && !loading && (
            <div className="space-y-8">
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    <ClockIcon size={14} />
                    recent searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularSearches.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    <TrendingUpIcon size={14} />
                    popular searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-lime/10 text-sm font-medium hover:bg-lime/20 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}