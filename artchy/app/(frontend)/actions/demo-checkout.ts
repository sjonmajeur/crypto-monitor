"use server";

import { redirect } from "next/navigation";

import { demoCartToken, demoClearLines, demoGetCart } from "@/lib/demo/cart";
import { logWebhookOrder } from "@/lib/sandbox/store";
import { isShopifyConfigured } from "@/lib/shopify/client";

/**
 * Demo-"afrekenen": geen betaling, geen Shopify — de order wordt alleen
 * in de lokale orderlog gezet zodat /order/bedankt hem toont.
 */
export async function placeDemoOrderAction(formData: FormData): Promise<void> {
  if (isShopifyConfigured()) redirect("/");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email) redirect("/checkout?error=1");

  const cart = await demoGetCart();
  if (cart.totalQuantity === 0) redirect("/shop");

  const orderNumber = 1000 + (Date.now() % 9000);
  await logWebhookOrder({
    receivedAt: new Date().toISOString(),
    orderId: Date.now(),
    orderNumber,
    name: `#DEMO-${orderNumber}`,
    test: true,
    cartToken: demoCartToken(cart.id),
    checkoutToken: null,
    totalPrice: cart.cost.totalAmount.amount,
    currency: cart.cost.totalAmount.currencyCode,
    orderStatusUrl: null,
    lineItems: cart.lines.nodes.map((line) => ({
      title: line.merchandise.product.title,
      quantity: line.quantity,
      price: line.merchandise.price.amount,
    })),
  });

  await demoClearLines();
  redirect("/order/bedankt");
}
