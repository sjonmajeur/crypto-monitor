"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, X } from "lucide-react";

import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

/**
 * Sticky mini-cart drawer — geen losse cartpagina. Checkout is een harde
 * redirect naar cart.checkoutUrl (de echte Shopify checkout); we bouwen
 * geen eigen checkout of betaalflow.
 */
export function CartDrawer() {
  const { cart, open, pending, setOpen, updateLine, removeLine } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  const lines = cart?.lines.nodes ?? [];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-coal/70"
        onClick={() => setOpen(false)}
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-coal"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl uppercase text-snow">
            Cart{cart ? ` (${cart.totalQuantity})` : ""}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close cart"
            className="text-snow hover:text-gold"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm text-ash">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="label text-gold hover:text-snow"
              >
                Go to the shop
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden border border-line bg-night">
                    {line.merchandise.image && (
                      <Image
                        src={line.merchandise.image.url}
                        alt={
                          line.merchandise.image.altText ??
                          line.merchandise.product.title
                        }
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/product/${line.merchandise.product.handle}`}
                        onClick={() => setOpen(false)}
                        className="text-sm uppercase tracking-wide text-snow hover:text-gold"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      <p className="shrink-0 text-sm tabular-nums text-gold">
                        {formatPrice(line.cost.totalAmount)}
                      </p>
                    </div>
                    {line.merchandise.title !== "Default Title" && (
                      <p className="mt-0.5 text-xs text-ash">
                        {line.merchandise.selectedOptions
                          .map((o) => `${o.name}: ${o.value}`)
                          .join(" · ")}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-line">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                          disabled={pending}
                          onClick={() => updateLine(line.id, line.quantity - 1)}
                          className="p-1.5 text-snow hover:text-gold disabled:opacity-50"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="min-w-8 text-center text-sm tabular-nums text-snow">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                          disabled={pending}
                          onClick={() => updateLine(line.id, line.quantity + 1)}
                          className="p-1.5 text-snow hover:text-gold disabled:opacity-50"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => removeLine(line.id)}
                        className="label text-ash hover:text-gold disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && lines.length > 0 && (
          <div className="border-t border-line px-6 py-4">
            <div className="flex items-baseline justify-between">
              <p className="label text-ash">Total</p>
              <p className="text-lg tabular-nums text-snow">
                {formatPrice(cart.cost.totalAmount)}
              </p>
            </div>
            <p className="mt-1 text-xs text-ash">
              Shipping and taxes calculated at checkout.
            </p>
            {process.env.NEXT_PUBLIC_SANDBOX === "true" && (
              <div className="mt-3 border border-gold/50 bg-night p-3 text-xs text-ash">
                <p className="font-medium text-gold">
                  Testomgeving — er wordt niets echt afgeschreven.
                </p>
                <p className="mt-1">
                  Betaal in de checkout met kaartnummer{" "}
                  <code className="text-snow">1</code>, een vervaldatum in de
                  toekomst en elke CVV (Bogus Gateway).
                </p>
              </div>
            )}
            <a href={cart.checkoutUrl} className="mt-4 block">
              <Button className="w-full" disabled={pending}>
                Checkout
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
