import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";
import type { ProductCardData } from "@/lib/shopify/schemas";

/**
 * Uniform productgrid: 3 kolommen op desktop, 2 op tablet, 1 op
 * mobiel, vaste gap. Alle kaarten even hoog (grid-stretch + kaarten
 * met vaste beeldratio en gepinde prijs).
 */
export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <Reveal key={product.id} className="h-full">
          <ProductCard product={product} priority={i < 3} />
        </Reveal>
      ))}
    </div>
  );
}
