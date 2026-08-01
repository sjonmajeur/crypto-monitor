import { z } from "zod";

import { shopifyFetch, isShopifyConfigured } from "./client";
import {
  productByHandleQuerySchema,
  productsQuerySchema,
  type ProductCardData,
  type ProductDetail,
} from "./schemas";
import { GET_PRODUCTS_QUERY } from "./queries/products";
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_RELATED_PRODUCTS_QUERY,
} from "./queries/product-detail";

export { isShopifyConfigured } from "./client";
export { ShopifyConfigError, ShopifyApiError } from "./client";
export type {
  ProductCardData,
  ProductDetail,
  ProductVariant,
  Cart,
  CartLine,
  Money,
  ShopifyImage,
} from "./schemas";

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

export async function getProductByHandle(
  handle: string,
): Promise<ProductDetail | null> {
  const data = await shopifyFetch<unknown>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return productByHandleQuerySchema.parse(data).product;
}

export async function getRelatedProducts(
  product: ProductDetail,
  first = 3,
): Promise<ProductCardData[]> {
  const query = product.productType
    ? `product_type:'${product.productType.replaceAll("'", "")}'`
    : undefined;
  const data = await shopifyFetch<unknown>({
    query: GET_RELATED_PRODUCTS_QUERY,
    variables: { query, first: first + 1 },
  });
  return productsQuerySchema
    .parse(data)
    .products.nodes.filter((p) => p.id !== product.id)
    .slice(0, first);
}

/** Eerste beschikbare variant van maximaal drie producten, voor demo-items. */
export async function getDemoVariantIds(max = 3): Promise<string[]> {
  const data = await shopifyFetch<unknown>({
    query: /* GraphQL */ `
      query DemoVariants {
        products(first: 10) {
          nodes {
            variants(first: 1) {
              nodes {
                id
                availableForSale
              }
            }
          }
        }
      }
    `,
    revalidate: false,
  });

  const parsed = z
    .object({
      products: z.object({
        nodes: z.array(
          z.object({
            variants: z.object({
              nodes: z.array(
                z.object({ id: z.string(), availableForSale: z.boolean() }),
              ),
            }),
          }),
        ),
      }),
    })
    .parse(data);

  return parsed.products.nodes
    .flatMap((p) => p.variants.nodes)
    .filter((v) => v.availableForSale)
    .slice(0, max)
    .map((v) => v.id);
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
