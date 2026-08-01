import type { ProductCardData, ProductDetail } from "@/lib/shopify/schemas";

/**
 * Demo-catalogus — alleen actief wanneer SHOPIFY_STOREFRONT_ACCESS_TOKEN
 * ontbreekt (zie lib/shopify/index.ts). Zodra echte Shopify-keys er
 * zijn, wordt dit bestand nergens meer gebruikt.
 */

const IMAGE_URL =
  "https://cdn.shopify.com/s/files/1/1021/7344/2431/files/middel.jpg";

const image = {
  url: IMAGE_URL,
  altText: "Love you — graffiti-hand artwork",
  width: null,
  height: null,
};

function demoProduct(slug: string, artist: string): ProductDetail {
  return {
    id: `gid://shopify/Product/demo-${slug}`,
    handle: `love-you-${slug}`,
    title: `Love you — ${artist}`,
    availableForSale: true,
    productType: slug,
    tags: ["demo"],
    descriptionHtml: `<p>Limited “Love you” drop by ${artist}. Wearable art — once it's gone, it never returns.</p><p><em>Demo product: in deze omgeving wordt niets echt besteld.</em></p>`,
    vendor: "ARTCHY",
    seo: { title: null, description: null },
    options: [{ name: "Title", optionValues: [{ name: "Default Title" }] }],
    featuredImage: image,
    images: { nodes: [image] },
    variants: {
      nodes: [
        {
          id: `gid://shopify/ProductVariant/demo-${slug}`,
          title: "Default Title",
          availableForSale: true,
          price: { amount: "3.00", currencyCode: "EUR" },
          compareAtPrice: null,
          selectedOptions: [{ name: "Title", value: "Default Title" }],
          image,
        },
      ],
    },
    priceRange: {
      minVariantPrice: { amount: "3.00", currencyCode: "EUR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "0.00", currencyCode: "EUR" },
    },
  };
}

export const DEMO_PRODUCTS: ProductDetail[] = [
  demoProduct("josh", "Josh"),
  demoProduct("taji", "Taji"),
  demoProduct("brass", "Brass"),
];

export function demoProductCards(): ProductCardData[] {
  return DEMO_PRODUCTS;
}

export function demoProductByHandle(handle: string): ProductDetail | null {
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

export function demoVariantById(variantId: string) {
  for (const product of DEMO_PRODUCTS) {
    const variant = product.variants.nodes.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}
