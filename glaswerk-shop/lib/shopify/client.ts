const DEFAULT_API_VERSION = "2025-07";

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

export class ShopifyApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

export function isShopifyConfigured(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

function getEndpoint(): { url: string; token: string } {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version =
    process.env.SHOPIFY_STOREFRONT_API_VERSION ?? DEFAULT_API_VERSION;

  if (!domain || !token) {
    throw new ShopifyConfigError(
      "Shopify is niet geconfigureerd: zet SHOPIFY_STORE_DOMAIN en SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local (zie .env.example).",
    );
  }

  return {
    url: `https://${domain}/api/${version}/graphql.json`,
    token,
  };
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

/**
 * Enige plek waar met de Storefront API wordt gepraat. Componenten praten
 * nooit direct met deze functie — alleen via de getypeerde functies in
 * lib/shopify/index.ts, die de response met zod valideren.
 */
export async function shopifyFetch<T>({
  query,
  variables,
  revalidate = 60,
}: {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number | false;
}): Promise<T> {
  const { url, token } = getEndpoint();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!res.ok) {
    throw new ShopifyApiError(
      `Storefront API antwoordde met status ${res.status}`,
      res.status,
    );
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyApiError(
      `Storefront API errors: ${json.errors.map((e) => e.message).join("; ")}`,
    );
  }

  if (!json.data) {
    throw new ShopifyApiError("Storefront API gaf geen data terug.");
  }

  return json.data;
}
