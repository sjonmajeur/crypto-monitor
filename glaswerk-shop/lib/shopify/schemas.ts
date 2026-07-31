import { z } from "zod";

export const moneySchema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const imageSchema = z.object({
  url: z.string(),
  altText: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

/**
 * De velden die de product card nodig heeft. PDP-schema's (varianten,
 * beschrijving, maatinfo) komen in stap 3 hier bij.
 */
export const productCardSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  featuredImage: imageSchema.nullable(),
  images: z.object({
    nodes: z.array(imageSchema),
  }),
  priceRange: z.object({
    minVariantPrice: moneySchema,
  }),
  compareAtPriceRange: z.object({
    minVariantPrice: moneySchema,
  }),
});

export const productsQuerySchema = z.object({
  products: z.object({
    nodes: z.array(productCardSchema),
  }),
});

export type Money = z.infer<typeof moneySchema>;
export type ShopifyImage = z.infer<typeof imageSchema>;
export type ProductCardData = z.infer<typeof productCardSchema>;
