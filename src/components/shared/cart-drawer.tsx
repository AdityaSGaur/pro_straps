"use client";

import { useCartStore } from "@/stores/cart-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MinusIcon, PlusIcon, XIcon, ShoppingBagIcon, ArrowRightIcon } from "@/lib/icons";
import Image from "next/image";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, subtotal } =
    useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
            <ShoppingBagIcon size={16} />
            your cart
            {items.length > 0 && (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBagIcon size={32} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              your cart is empty
            </p>
            <Button
              variant="default"
              className="rounded-full bg-lime text-black hover:bg-lime-dark font-semibold"
              onClick={() => setCartOpen(false)}
              asChild
            >
              <Link href="/">start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variantName}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-full">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-muted rounded-full transition-colors"
                        >
                          <MinusIcon size={12} />
                        </button>
                        <span className="px-3 text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-muted rounded-full transition-colors"
                        >
                          <PlusIcon size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.salePrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">
                              {formatPrice(item.salePrice * item.quantity)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">subtotal</span>
                <span className="text-lg font-bold">
                  {formatPrice(items.reduce((sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                shipping & taxes calculated at checkout
              </p>
              <Button className="w-full rounded-full bg-lime text-black hover:bg-lime-dark font-semibold h-12 text-sm uppercase tracking-wider">
                proceed to checkout
                <ArrowRightIcon size={16} className="ml-2" />
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full text-sm"
                onClick={() => setCartOpen(false)}
              >
                continue shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}