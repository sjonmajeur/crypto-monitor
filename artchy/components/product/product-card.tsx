import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/shopify/schemas";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductCardData;
  /**
   * Beeldbreedte per breakpoint voor next/image. Default past bij het
   * asymmetrische PLP-grid (rijen van 2 en 3).
   */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Product card voor de shop-PLP en uitgelichte secties, in ARTCHY-stijl.
 *
 * - Hover: crossfade naar de tweede productfoto (geen scale)
 * - Uitverkocht: zichtbaar met badge, gedempt beeld — niet verborgen
 * - Volledig server component; hover en focus zijn puur CSS
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: ProductCardProps) {
  const primaryImage = product.featuredImage ?? product.images.nodes[0] ?? null;
  const secondaryImage =
    product.images.nodes.find((img) => img.url !== primaryImage?.url) ?? null;

  const soldOut = !product.availableForSale;
  const price = formatPrice(product.priceRange.minVariantPrice);

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/product/${product.handle}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label={soldOut ? `${product.title} — sold out` : product.title}
      >
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-night">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.title}
                fill
                sizes={sizes}
                priority={priority}
                className={cn(
                  "object-cover transition-opacity duration-500 ease-out",
                  secondaryImage &&
                    "group-hover:opacity-0 group-focus-within:opacity-0",
                  soldOut && "opacity-50",
                )}
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage.url}
                  alt=""
                  aria-hidden
                  fill
                  sizes={sizes}
                  className={cn(
                    "object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
                    soldOut && "group-hover:opacity-50",
                  )}
                />
              )}
            </>
          ) : (
            <div
              className="flex h-full items-center justify-center text-sm text-ash"
              role="img"
              aria-label={`${product.title} — image coming soon`}
            >
              Image coming soon
            </div>
          )}

          {soldOut && (
            <Badge variant="soldOut" className="absolute left-3 top-3">
              Sold out
            </Badge>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-4 pt-3">
          <h3 className="text-base uppercase tracking-wide text-snow">
            {product.title}
          </h3>
          <p
            className={cn(
              "shrink-0 text-sm tabular-nums",
              soldOut ? "text-ash" : "text-gold",
            )}
          >
            {price}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="aspect-[4/5] animate-pulse border border-line bg-night" />
      <div className="flex items-baseline justify-between gap-4 pt-3">
        <div className="h-5 w-2/3 animate-pulse bg-night" />
        <div className="h-4 w-12 animate-pulse bg-night" />
      </div>
    </div>
  );
}
