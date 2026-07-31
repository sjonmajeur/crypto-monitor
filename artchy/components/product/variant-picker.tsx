"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { ProductDetail, ProductVariant } from "@/lib/shopify/schemas";
import { cn } from "@/lib/utils";

/**
 * Variant-selectie via losse optie-knoppen (maat/kleur), niet via één
 * dropdown met alle combinaties. Uitverkochte combinaties blijven
 * zichtbaar maar zijn niet bestelbaar.
 */
export function VariantPicker({ product }: { product: ProductDetail }) {
  const { addItem, pending } = useCart();

  const options = product.options.filter(
    (o) => !(o.name === "Title" && o.optionValues.length <= 1),
  );

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      options.map((o) => [o.name, o.optionValues[0]?.name ?? ""]),
    ),
  );

  const variantFor = (choice: Record<string, string>): ProductVariant | null =>
    product.variants.nodes.find((variant) =>
      variant.selectedOptions.every(
        (opt) => !(opt.name in choice) || choice[opt.name] === opt.value,
      ),
    ) ?? null;

  const activeVariant = useMemo(
    () => variantFor(selected) ?? product.variants.nodes[0] ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, product],
  );

  const soldOut = !activeVariant?.availableForSale;

  return (
    <div>
      {options.map((option) => (
        <fieldset key={option.name} className="mt-6">
          <legend className="label mb-2 text-ash">{option.name}</legend>
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((value) => {
              const active = selected[option.name] === value.name;
              const candidate = variantFor({
                ...selected,
                [option.name]: value.name,
              });
              const candidateSoldOut = !candidate?.availableForSale;
              return (
                <button
                  key={value.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    setSelected((prev) => ({
                      ...prev,
                      [option.name]: value.name,
                    }))
                  }
                  className={cn(
                    "border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-gold bg-gold text-coal"
                      : "border-line text-snow hover:border-gold",
                    candidateSoldOut && "line-through opacity-60",
                  )}
                >
                  {value.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-8 flex items-center gap-4">
        <p className="text-xl tabular-nums text-gold">
          {activeVariant ? formatPrice(activeVariant.price) : null}
        </p>
        {soldOut && <Badge variant="soldOut">Sold out</Badge>}
      </div>

      <Button
        className="mt-6 w-full sm:w-auto sm:min-w-64"
        disabled={pending || soldOut || !activeVariant}
        onClick={() => activeVariant && addItem(activeVariant.id)}
      >
        {soldOut ? "Sold out" : pending ? "Adding…" : "Add to cart"}
      </Button>
    </div>
  );
}
