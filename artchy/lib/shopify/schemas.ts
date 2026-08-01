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
export const productOptionSchema = z.object({
  name: z.string(),
  optionValues: z.array(z.object({ name: z.string() })),
});

export const productCardSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  productType: z.string(),
  tags: z.array(z.string()),
  options: z.array(productOptionSchema),
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

export const variantSchema = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  price: moneySchema,
  compareAtPrice: moneySchema.nullable(),
  selectedOptions: z.array(z.object({ name: z.string(), value: z.string() })),
  image: imageSchema.nullable(),
});

export const productDetailSchema = productCardSchema.extend({
  descriptionHtml: z.string(),
  vendor: z.string(),
  seo: z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
  }),
  images: z.object({
    nodes: z.array(imageSchema),
  }),
  variants: z.object({
    nodes: z.array(variantSchema),
  }),
});

export const productByHandleQuerySchema = z.object({
  product: productDetailSchema.nullable(),
});

export const cartLineSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  cost: z.object({
    totalAmount: moneySchema,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    availableForSale: z.boolean(),
    selectedOptions: z.array(
      z.object({ name: z.string(), value: z.string() }),
    ),
    image: imageSchema.nullable(),
    product: z.object({
      handle: z.string(),
      title: z.string(),
    }),
    price: moneySchema,
  }),
});

export const cartSchema = z.object({
  id: z.string(),
  checkoutUrl: z.string(),
  totalQuantity: z.number(),
  cost: z.object({
    subtotalAmount: moneySchema,
    totalAmount: moneySchema,
  }),
  lines: z.object({
    nodes: z.array(cartLineSchema),
  }),
});

export type ProductVariant = z.infer<typeof variantSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartLine = z.infer<typeof cartLineSchema>;

export const productsQuerySchema = z.object({
  products: z.object({
    nodes: z.array(productCardSchema),
  }),
});

export type Money = z.infer<typeof moneySchema>;
export type ShopifyImage = z.infer<typeof imageSchema>;
export type ProductCardData = z.infer<typeof productCardSchema>;
