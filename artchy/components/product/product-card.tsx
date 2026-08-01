import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/shopify/schemas";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductCardData;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Uniforme productkaart: beeld altijd 1:1 (object-cover, center),
 * titel maximaal 2 regels, prijs altijd onderaan op dezelfde plek.
 * Kaarten in een grid zijn hierdoor overal even hoog.
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
    <article className={cn("group relative h-full", className)}>
      <Link
        href={`/product/${product.handle}`}
        className="flex h-full flex-col border border-line bg-night transition-colors hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        aria-label={soldOut ? `${product.title} — sold out` : product.title}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText ?? product.title}
                fill
                sizes={sizes}
                priority={priority}
                className={cn(
                  "object-cover object-center transition-opacity duration-500 ease-out",
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
                    "object-cover object-center opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-within:opacity-100",
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

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm uppercase tracking-wide text-snow">
            {product.title}
          </h3>
          <p
            className={cn(
              "mt-auto pt-3 text-sm tabular-nums",
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
    <div className={cn("flex h-full flex-col border border-line", className)}>
      <div className="aspect-square w-full animate-pulse bg-night" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-4 w-2/3 animate-pulse bg-night" />
        <div className="mt-auto h-4 w-12 animate-pulse bg-night" />
      </div>
    </div>
  );
}
