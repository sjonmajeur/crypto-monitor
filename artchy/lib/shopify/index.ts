import { shopifyFetch, isShopifyConfigured } from "./client";
import { productsQuerySchema, type ProductCardData } from "./schemas";
import { GET_PRODUCTS_QUERY } from "./queries/products";

export { isShopifyConfigured } from "./client";
export { ShopifyConfigError, ShopifyApiError } from "./client";
export type { ProductCardData, Money, ShopifyImage } from "./schemas";

export async function getProducts({
  first = 12,
  sortKey = "CREATED_AT",
  reverse = true,
}: {
  first?: number;
  sortKey?: "TITLE" | "PRICE" | "CREATED_AT" | "BEST_SELLING";
  reverse?: boolean;
} = {}): Promise<ProductCardData[]> {
  const data = await shopifyFetch<unknown>({
    query: GET_PRODUCTS_QUERY,
    variables: { first, sortKey, reverse },
  });

  return productsQuerySchema.parse(data).products.nodes;
}

export function shopifyStatus():
  | { configured: true }
  | { configured: false; reason: string } {
  if (isShopifyConfigured()) return { configured: true };
  return {
    configured: false,
    reason:
      "SHOPIFY_STORE_DOMAIN en/of SHOPIFY_STOREFRONT_ACCESS_TOKEN ontbreken in .env.local",
  };
}
