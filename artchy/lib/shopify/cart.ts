import { z } from "zod";

import { shopifyFetch, ShopifyApiError } from "./client";
import { cartSchema, type Cart } from "./schemas";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  GET_CART_QUERY,
} from "./queries/cart";

const userErrorsSchema = z.array(
  z.object({ field: z.array(z.string()).nullable(), message: z.string() }),
);

function unwrap(
  payload: unknown,
  key: string,
): Cart {
  const parsed = z
    .object({
      [key]: z.object({
        cart: cartSchema.nullable(),
        userErrors: userErrorsSchema,
      }),
    })
    .parse(payload);

  const { cart, userErrors } = parsed[key];
  if (userErrors.length > 0) {
    throw new ShopifyApiError(
      `Cart error: ${userErrors.map((e) => e.message).join("; ")}`,
    );
  }
  if (!cart) {
    throw new ShopifyApiError("Cart mutation returned no cart.");
  }
  return cart;
}

export async function cartCreate(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): Promise<Cart> {
  const data = await shopifyFetch<unknown>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    revalidate: false,
  });
  return unwrap(data, "cartCreate");
}

export async function cartLinesAdd(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<unknown>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    revalidate: false,
  });
  return unwrap(data, "cartLinesAdd");
}

export async function cartLinesUpdate(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<unknown>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    revalidate: false,
  });
  return unwrap(data, "cartLinesUpdate");
}

export async function cartLinesRemove(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<unknown>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    revalidate: false,
  });
  return unwrap(data, "cartLinesRemove");
}

export async function cartGet(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<unknown>({
    query: GET_CART_QUERY,
    variables: { cartId },
    revalidate: false,
  });
  return z.object({ cart: cartSchema.nullable() }).parse(data).cart;
}
