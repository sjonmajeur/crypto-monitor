import "server-only";
import { cookies } from "next/headers";

import { demoVariantById } from "./catalog";
import type { Cart } from "@/lib/shopify/schemas";

/**
 * Volledig lokale demo-cart (httpOnly-cookies, geen externe calls).
 * Zelfde Cart-vorm als de Storefront API, zodat de bestaande drawer en
 * acties ongewijzigd werken. checkoutUrl wijst naar de interne
 * demo-checkout.
 */

const LINES_COOKIE = "demo_cart_lines";
const CART_COOKIE = "cartId";

type DemoLine = { variantId: string; quantity: number };

async function readLines(): Promise<DemoLine[]> {
  const jar = await cookies();
  try {
    const raw = jar.get(LINES_COOKIE)?.value;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DemoLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => l.quantity > 0) : [];
  } catch {
    return [];
  }
}

async function writeLines(lines: DemoLine[]): Promise<void> {
  const jar = await cookies();
  jar.set(LINES_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

/** Zorgt voor een stabiel cart-token (zelfde gid-vorm als Shopify). */
export async function ensureDemoCartId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CART_COOKIE)?.value;
  if (existing?.includes("/Cart/demo-")) return existing;
  const id = `gid://shopify/Cart/demo-${Math.random().toString(36).slice(2, 10)}?key=demo`;
  jar.set(CART_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return id;
}

function buildCart(cartId: string, lines: DemoLine[]): Cart {
  const nodes = lines.flatMap((line) => {
    const match = demoVariantById(line.variantId);
    if (!match) return [];
    const { product, variant } = match;
    const total = (Number(variant.price.amount) * line.quantity).toFixed(2);
    return [
      {
        id: variant.id,
        quantity: line.quantity,
        cost: {
          totalAmount: { amount: total, currencyCode: "EUR" },
        },
        merchandise: {
          id: variant.id,
          title: variant.title,
          availableForSale: true,
          selectedOptions: variant.selectedOptions,
          image: variant.image,
          product: { handle: product.handle, title: product.title },
          price: variant.price,
        },
      },
    ];
  });

  const total = nodes
    .reduce((sum, n) => sum + Number(n.cost.totalAmount.amount), 0)
    .toFixed(2);

  return {
    id: cartId,
    checkoutUrl: "/checkout",
    totalQuantity: nodes.reduce((sum, n) => sum + n.quantity, 0),
    cost: {
      subtotalAmount: { amount: total, currencyCode: "EUR" },
      totalAmount: { amount: total, currencyCode: "EUR" },
    },
    lines: { nodes },
  };
}

export async function demoGetCart(): Promise<Cart> {
  const cartId = await ensureDemoCartId();
  return buildCart(cartId, await readLines());
}

export async function demoAddLine(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await ensureDemoCartId();
  const lines = await readLines();
  const existing = lines.find((l) => l.variantId === variantId);
  if (existing) {
    existing.quantity += quantity;
  } else if (demoVariantById(variantId)) {
    lines.push({ variantId, quantity });
  }
  await writeLines(lines);
  return buildCart(cartId, lines);
}

export async function demoUpdateLine(
  variantId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await ensureDemoCartId();
  let lines = await readLines();
  if (quantity <= 0) {
    lines = lines.filter((l) => l.variantId !== variantId);
  } else {
    const line = lines.find((l) => l.variantId === variantId);
    if (line) line.quantity = quantity;
  }
  await writeLines(lines);
  return buildCart(cartId, lines);
}

export async function demoClearLines(): Promise<void> {
  await writeLines([]);
}

/** Token-deel van het demo-cart-gid (voor de orderkoppeling). */
export function demoCartToken(cartId: string): string | null {
  const match = cartId.match(/Cart\/([^/?]+)/);
  return match ? match[1] : null;
}
