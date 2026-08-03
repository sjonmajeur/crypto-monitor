import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { logWebhookOrder } from "@/lib/sandbox/store";

export const runtime = "nodejs";

const webhookOrderSchema = z.object({
  id: z.number(),
  order_number: z.number(),
  name: z.string(),
  test: z.boolean(),
  cart_token: z.string().nullable(),
  checkout_token: z.string().nullable(),
  total_price: z.string(),
  currency: z.string(),
  order_status_url: z.string().nullable(),
  line_items: z.array(
    z.object({
      title: z.string(),
      quantity: z.number(),
      price: z.string(),
    }),
  ),
});

function verifyHmac(rawBody: string, headerHmac: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !headerHmac) return false;

  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(headerHmac, "base64");
  } catch {
    return false;
  }
  return (
    digest.length === provided.length && timingSafeEqual(digest, provided)
  );
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

  if (!verifyHmac(rawBody, hmacHeader)) {
    return NextResponse.json({ error: "invalid hmac" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = webhookOrderSchema.parse(JSON.parse(rawBody));
  } catch {
    // Geldige HMAC maar onverwachte payload: 200 teruggeven zodat Shopify
    // niet eindeloos retryt; er valt hier niets te herstellen.
    return NextResponse.json({ ok: true, skipped: true });
  }

  await logWebhookOrder({
    receivedAt: new Date().toISOString(),
    orderId: parsed.id,
    orderNumber: parsed.order_number,
    name: parsed.name,
    test: parsed.test,
    cartToken: parsed.cart_token,
    checkoutToken: parsed.checkout_token,
    totalPrice: parsed.total_price,
    currency: parsed.currency,
    orderStatusUrl: parsed.order_status_url,
    lineItems: parsed.line_items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  return NextResponse.json({ ok: true });
}
