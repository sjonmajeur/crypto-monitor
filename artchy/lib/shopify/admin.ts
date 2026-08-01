import "server-only";
import { z } from "zod";

const DEFAULT_API_VERSION = "2025-07";

export class AdminConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminConfigError";
  }
}

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  );
}

/**
 * Admin API-client — uitsluitend voor de sandbox-features (/sandbox,
 * /order/bedankt) en nooit voor de storefront zelf. Token blijft
 * server-only.
 */
export async function adminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version =
    process.env.SHOPIFY_STOREFRONT_API_VERSION ?? DEFAULT_API_VERSION;

  if (!domain || !token) {
    throw new AdminConfigError(
      "Admin API niet geconfigureerd: zet SHOPIFY_STORE_DOMAIN en SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local.",
    );
  }

  const res = await fetch(
    `https://${domain}/admin/api/${version}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Admin API status ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };
  if (json.errors?.length) {
    throw new Error(
      `Admin API errors: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!json.data) {
    throw new Error("Admin API gaf geen data terug.");
  }
  return json.data;
}

const adminOrderSchema = z.object({
  id: z.string(),
  name: z.string(),
  test: z.boolean(),
  createdAt: z.string(),
  cancelledAt: z.string().nullable(),
  displayFinancialStatus: z.string().nullable(),
  statusPageUrl: z.string().nullable().catch(null),
  totalPriceSet: z.object({
    shopMoney: z.object({ amount: z.string(), currencyCode: z.string() }),
  }),
  lineItems: z.object({
    nodes: z.array(z.object({ title: z.string(), quantity: z.number() })),
  }),
});

export type AdminOrder = z.infer<typeof adminOrderSchema>;

export async function getRecentTestOrders(first = 10): Promise<AdminOrder[]> {
  const data = await adminFetch<unknown>({
    query: /* GraphQL */ `
      query RecentTestOrders($first: Int!) {
        orders(first: $first, reverse: true, query: "test:true") {
          nodes {
            id
            name
            test
            createdAt
            cancelledAt
            displayFinancialStatus
            statusPageUrl
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 10) {
              nodes {
                title
                quantity
              }
            }
          }
        }
      }
    `,
    variables: { first },
  });

  return z
    .object({ orders: z.object({ nodes: z.array(adminOrderSchema) }) })
    .parse(data).orders.nodes;
}

export async function getShopSandboxStatus(): Promise<{
  name: string;
  myshopifyDomain: string;
  partnerDevelopment: boolean;
  planDisplayName: string;
}> {
  const data = await adminFetch<unknown>({
    query: /* GraphQL */ `
      query ShopSandboxStatus {
        shop {
          name
          myshopifyDomain
          plan {
            partnerDevelopment
            displayName
          }
        }
      }
    `,
  });

  const parsed = z
    .object({
      shop: z.object({
        name: z.string(),
        myshopifyDomain: z.string(),
        plan: z.object({
          partnerDevelopment: z.boolean(),
          displayName: z.string(),
        }),
      }),
    })
    .parse(data);

  return {
    name: parsed.shop.name,
    myshopifyDomain: parsed.shop.myshopifyDomain,
    partnerDevelopment: parsed.shop.plan.partnerDevelopment,
    planDisplayName: parsed.shop.plan.displayName,
  };
}

/** Annuleert (indien nodig) en verwijdert een testorder. Nooit fulfillen. */
export async function cancelAndDeleteOrder(order: AdminOrder): Promise<void> {
  if (!order.test) {
    throw new Error(
      `Order ${order.name} is geen testorder — reset weigert eraan te komen.`,
    );
  }

  if (!order.cancelledAt) {
    await adminFetch<unknown>({
      query: /* GraphQL */ `
        mutation CancelOrder($orderId: ID!) {
          orderCancel(
            orderId: $orderId
            reason: OTHER
            refund: false
            restock: true
            notifyCustomer: false
          ) {
            userErrors: orderCancelUserErrors {
              message
            }
          }
        }
      `,
      variables: { orderId: order.id },
    });
  }

  await adminFetch<unknown>({
    query: /* GraphQL */ `
      mutation DeleteOrder($orderId: ID!) {
        orderDelete(orderId: $orderId) {
          userErrors {
            message
          }
        }
      }
    `,
    variables: { orderId: order.id },
  });
}

export type InventorySnapshot = Array<{
  variantId: string;
  inventoryItemId: string;
  locationId: string;
  available: number | null;
  sku: string | null;
  productTitle: string;
}>;

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
  const data = await adminFetch<unknown>({
    query: /* GraphQL */ `
      query InventorySnapshot {
        productVariants(first: 100) {
          nodes {
            id
            sku
            product {
              title
            }
            inventoryItem {
              id
              inventoryLevels(first: 5) {
                nodes {
                  location {
                    id
                  }
                  quantities(names: ["available"]) {
                    name
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    `,
  });

  const parsed = z
    .object({
      productVariants: z.object({
        nodes: z.array(
          z.object({
            id: z.string(),
            sku: z.string().nullable(),
            product: z.object({ title: z.string() }),
            inventoryItem: z.object({
              id: z.string(),
              inventoryLevels: z.object({
                nodes: z.array(
                  z.object({
                    location: z.object({ id: z.string() }),
                    quantities: z.array(
                      z.object({ name: z.string(), quantity: z.number() }),
                    ),
                  }),
                ),
              }),
            }),
          }),
        ),
      }),
    })
    .parse(data);

  return parsed.productVariants.nodes.flatMap((variant) =>
    variant.inventoryItem.inventoryLevels.nodes.map((level) => ({
      variantId: variant.id,
      inventoryItemId: variant.inventoryItem.id,
      locationId: level.location.id,
      available:
        level.quantities.find((q) => q.name === "available")?.quantity ?? null,
      sku: variant.sku,
      productTitle: variant.product.title,
    })),
  );
}

export async function setInventoryLevels(
  snapshot: InventorySnapshot,
): Promise<void> {
  const quantities = snapshot
    .filter((level) => level.available !== null)
    .map((level) => ({
      inventoryItemId: level.inventoryItemId,
      locationId: level.locationId,
      quantity: level.available as number,
    }));

  if (quantities.length === 0) return;

  await adminFetch<unknown>({
    query: /* GraphQL */ `
      mutation ResetInventory($input: InventorySetQuantitiesInput!) {
        inventorySetQuantities(input: $input) {
          userErrors {
            message
          }
        }
      }
    `,
    variables: {
      input: {
        name: "available",
        reason: "correction",
        ignoreCompareQuantity: true,
        quantities,
      },
    },
  });
}
