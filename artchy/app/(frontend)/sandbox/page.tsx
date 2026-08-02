import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ensureInventoryBaseline } from "@/app/(frontend)/actions/sandbox";
import {
  DemoFillButton,
  ResetSandboxButton,
} from "@/components/sandbox/sandbox-controls";
import { TestCards } from "@/components/sandbox/test-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import { getWebhookOrders } from "@/lib/sandbox/store";
import { getDemoVariantIds, isShopifyConfigured } from "@/lib/shopify";
import {
  getRecentTestOrders,
  getShopSandboxStatus,
  isAdminConfigured,
  type AdminOrder,
} from "@/lib/shopify/admin";

export const metadata: Metadata = {
  title: "Sandbox",
  description: "Testmodus-dashboard — geen echte betalingen.",
};

export const dynamic = "force-dynamic";

/**
 * Sandbox-dashboard. Eén codepad: staat NEXT_PUBLIC_SANDBOX niet op
 * "true", dan bestaat deze route niet (404).
 */
export default async function SandboxPage() {
  if (process.env.NEXT_PUBLIC_SANDBOX !== "true") notFound();

  const adminReady = isAdminConfigured();
  const storefrontReady = isShopifyConfigured();

  const [shopStatus, testOrders, webhookOrders, demoVariantIds] =
    await Promise.all([
      adminReady ? getShopSandboxStatus().catch(() => null) : null,
      adminReady
        ? getRecentTestOrders(10).catch(() => [] as AdminOrder[])
        : ([] as AdminOrder[]),
      getWebhookOrders(),
      storefrontReady ? getDemoVariantIds().catch(() => []) : [],
    ]);

  if (adminReady) {
    await ensureInventoryBaseline().catch(() => null);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <p className="label text-gold">Testmodus — geen echte betalingen</p>
        <h1 className="mt-2 text-heading text-snow">Sandbox</h1>

        {shopStatus && (
          <p className="mt-3 text-sm text-ash">
            Store: <span className="text-snow">{shopStatus.name}</span> (
            {shopStatus.myshopifyDomain}) — plan{" "}
            <span className="text-snow">{shopStatus.planDisplayName}</span>
            {shopStatus.partnerDevelopment
              ? " · development store"
              : " · GEEN development store"}
          </p>
        )}
        {!adminReady && (
          <p className="mt-3 text-sm text-gold">
            SHOPIFY_ADMIN_ACCESS_TOKEN ontbreekt — orderoverzicht en reset
            staan uit.
          </p>
        )}

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <section>
            <h2 className="text-subheading text-snow">Testkaarten</h2>
            <div className="mt-4">
              <TestCards />
            </div>

            <h2 className="mt-12 text-subheading text-snow">Acties</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              <DemoFillButton variantIds={demoVariantIds} />
              <ResetSandboxButton />
            </div>
            <p className="mt-3 max-w-prose text-xs text-ash">
              Reset annuleert en verwijdert alle testorders (nooit fulfillen)
              en zet de voorraad terug naar de vastgelegde startwaarden.
              Testorders raken voorraad- en omzetcijfers overigens niet.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-snow">
              Laatste testorders (Admin API)
            </h2>
            {testOrders.length === 0 ? (
              <p className="mt-4 text-sm text-ash">Nog geen testorders.</p>
            ) : (
              <ul className="mt-4 divide-y divide-line border border-line">
                {testOrders.map((order) => (
                  <li key={order.id} className="px-4 py-3 text-sm">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-snow">{order.name}</span>
                      <span className="tabular-nums text-gold">
                        {formatPrice({
                          amount: order.totalPriceSet.shopMoney.amount,
                          currencyCode:
                            order.totalPriceSet.shopMoney.currencyCode,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ash">
                      {new Date(order.createdAt).toLocaleString("nl-NL")} ·{" "}
                      {order.displayFinancialStatus ?? "—"}
                      {order.cancelledAt ? " · geannuleerd" : ""} ·{" "}
                      {order.lineItems.nodes
                        .map((li) => `${li.quantity}× ${li.title}`)
                        .join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-12 text-subheading text-snow">
              Webhook-log (orders/create)
            </h2>
            {webhookOrders.length === 0 ? (
              <p className="mt-4 text-sm text-ash">
                Nog geen webhooks ontvangen op
                /api/webhooks/orders/create.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-line border border-line">
                {webhookOrders.slice(0, 10).map((order) => (
                  <li key={order.orderId} className="px-4 py-3 text-sm">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-snow">
                        {order.name}
                        {order.test ? "" : " (LIVE?)"}
                      </span>
                      <span className="tabular-nums text-gold">
                        {formatPrice({
                          amount: order.totalPrice,
                          currencyCode: order.currency,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ash">
                      ontvangen{" "}
                      {new Date(order.receivedAt).toLocaleString("nl-NL")} ·{" "}
                      {order.lineItems
                        .map((li) => `${li.quantity}× ${li.title}`)
                        .join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
