"use server";

import { cookies } from "next/headers";

import {
  demoAddLine,
  demoGetCart,
  demoUpdateLine,
} from "@/lib/demo/cart";
import { isShopifyConfigured } from "@/lib/shopify/client";
import {
  cartCreate,
  cartGet,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
} from "@/lib/shopify/cart";
import type { Cart } from "@/lib/shopify/schemas";

const CART_COOKIE = "cartId";

/**
 * Zonder Storefront-token draait de cart volledig lokaal (demo-modus);
 * met token loopt alles via de echte Storefront Cart API. In demo is
 * het line-id gelijk aan het variant-id.
 */

async function readCartId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(CART_COOKIE)?.value ?? null;
}

async function persistCartId(cartId: string): Promise<void> {
  const jar = await cookies();
  jar.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function getCartAction(): Promise<Cart | null> {
  if (!isShopifyConfigured()) return demoGetCart();

  const cartId = await readCartId();
  if (!cartId) return null;
  try {
    return await cartGet(cartId);
  } catch {
    return null;
  }
}

export async function addToCartAction(
  merchandiseId: string,
  quantity = 1,
): Promise<Cart> {
  if (!isShopifyConfigured()) return demoAddLine(merchandiseId, quantity);

  const cartId = await readCartId();
  if (cartId) {
    try {
      return await cartLinesAdd(cartId, [{ merchandiseId, quantity }]);
    } catch {
      // Cart verlopen of afgerekend — val door naar een nieuwe cart.
    }
  }

  const cart = await cartCreate([{ merchandiseId, quantity }]);
  await persistCartId(cart.id);
  return cart;
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  if (!isShopifyConfigured()) return demoUpdateLine(lineId, quantity);

  const cartId = await readCartId();
  if (!cartId) return null;
  if (quantity <= 0) {
    return cartLinesRemove(cartId, [lineId]);
  }
  return cartLinesUpdate(cartId, [{ id: lineId, quantity }]);
}

export async function removeCartLineAction(
  lineId: string,
): Promise<Cart | null> {
  if (!isShopifyConfigured()) return demoUpdateLine(lineId, 0);

  const cartId = await readCartId();
  if (!cartId) return null;
  return cartLinesRemove(cartId, [lineId]);
}

export async function clearCartCookieAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(CART_COOKIE);
}
