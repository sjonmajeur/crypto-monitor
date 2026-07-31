import type { ProductCardData } from "./shopify/schemas";

export type SortOption = "nieuw" | "prijs-op" | "prijs-af";

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "nieuw", label: "Newest" },
  { value: "prijs-op", label: "Price: low – high" },
  { value: "prijs-af", label: "Price: high – low" },
];

export type CollectionFilters = {
  type?: string;
  inhoud?: string;
  sort: SortOption;
};

const VOLUME_OPTION_NAME = /^(inhoud|volume|capacity)$/i;
const VOLUME_VALUE = /^(\d+(?:[.,]\d+)?)\s*(ml|cl|l)$/i;

/** "35 cl" → 350, "0,5 l" → 500, "250ml" → 250. Niet-volume → null. */
export function parseVolumeMl(value: string): number | null {
  const match = value.trim().match(VOLUME_VALUE);
  if (!match) return null;
  const amount = Number.parseFloat(match[1].replace(",", "."));
  const unit = match[2].toLowerCase();
  if (unit === "ml") return amount;
  if (unit === "cl") return amount * 10;
  return amount * 1000;
}

/**
 * Volumes van een product, in ml. Bron: de productoptie "Inhoud"/"Volume",
 * met tags als fallback (bijv. tag "350ml").
 */
export function productVolumesMl(product: ProductCardData): number[] {
  const fromOptions = product.options
    .filter((o) => VOLUME_OPTION_NAME.test(o.name))
    .flatMap((o) => o.optionValues.map((v) => parseVolumeMl(v.name)));

  const values = fromOptions.filter((v): v is number => v !== null);
  if (values.length > 0) return [...new Set(values)];

  const fromTags = product.tags
    .map(parseVolumeMl)
    .filter((v): v is number => v !== null);
  return [...new Set(fromTags)];
}

/** Beschikbare filterwaarden, afgeleid uit de echte catalogus. */
export function deriveFilterOptions(products: ProductCardData[]): {
  types: string[];
  volumesMl: number[];
} {
  const types = [
    ...new Set(products.map((p) => p.productType).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b, "nl"));

  const volumesMl = [...new Set(products.flatMap(productVolumesMl))].sort(
    (a, b) => a - b,
  );

  return { types, volumesMl };
}

export function applyCollectionFilters(
  products: ProductCardData[],
  filters: CollectionFilters,
): ProductCardData[] {
  let result = products;

  if (filters.type) {
    result = result.filter((p) => p.productType === filters.type);
  }

  if (filters.inhoud) {
    const wanted = Number.parseInt(filters.inhoud, 10);
    if (!Number.isNaN(wanted)) {
      result = result.filter((p) => productVolumesMl(p).includes(wanted));
    }
  }

  // Fetch-volgorde is nieuwste eerst; "nieuw" laat die intact.
  if (filters.sort === "prijs-op" || filters.sort === "prijs-af") {
    const direction = filters.sort === "prijs-op" ? 1 : -1;
    result = [...result].sort(
      (a, b) =>
        direction *
        (Number.parseFloat(a.priceRange.minVariantPrice.amount) -
          Number.parseFloat(b.priceRange.minVariantPrice.amount)),
    );
  }

  return result;
}

export function parseSort(value: string | undefined): SortOption {
  return value === "prijs-op" || value === "prijs-af" ? value : "nieuw";
}

export function formatVolumeMl(ml: number): string {
  return `${ml} ml`;
}
