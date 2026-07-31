import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";
import type { ProductCardData } from "@/lib/shopify/schemas";

/**
 * Asymmetrisch PLP-grid: rijen van 2 en 3 afwisselend (op lg een
 * 6-koloms grid met een span-cyclus van [3,3,2,2,2]).
 */
const SPAN_CYCLE = [3, 3, 2, 2, 2] as const;

function sizesForSpan(span: number): string {
  return span === 3
    ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
    : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-6">
      {products.map((product, i) => {
        const span = SPAN_CYCLE[i % SPAN_CYCLE.length];
        return (
          <Reveal
            key={product.id}
            className={span === 3 ? "lg:col-span-3" : "lg:col-span-2"}
            delay={(i % SPAN_CYCLE.length) * 60}
          >
            <ProductCard
              product={product}
              sizes={sizesForSpan(span)}
              priority={i < 2}
            />
          </Reveal>
        );
      })}
    </div>
  );
}
