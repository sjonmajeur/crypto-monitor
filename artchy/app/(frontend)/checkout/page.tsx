import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { placeDemoOrderAction } from "@/app/(frontend)/actions/demo-checkout";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { demoGetCart } from "@/lib/demo/cart";
import { formatPrice } from "@/lib/format";
import { isShopifyConfigured } from "@/lib/shopify/client";

export const metadata: Metadata = {
  title: "Checkout (demo)",
  description: "Demo checkout — er wordt niets besteld of afgeschreven.",
};

export const dynamic = "force-dynamic";

/**
 * Interne demo-checkout. Bestaat alleen in demo-modus; met echte
 * Shopify-keys loopt afrekenen via cart.checkoutUrl van Shopify en
 * geeft deze route een 404.
 */
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (isShopifyConfigured()) notFound();

  const { error } = await searchParams;
  const cart = await demoGetCart();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6 md:py-24">
        <p className="label text-gold">Checkout</p>
        <h1 className="mt-2 text-heading text-snow">Almost yours</h1>

        <div className="mt-4 border border-gold/50 bg-night p-4 text-sm">
          <p className="font-medium text-gold">
            Demo — er wordt niets besteld of afgeschreven.
          </p>
          <p className="mt-1 text-ash">
            Dit is een klikbare demo-omgeving zonder betaling. Je gegevens
            worden alleen gebruikt om de bevestigingspagina te tonen.
          </p>
        </div>

        {cart.totalQuantity === 0 ? (
          <div className="mt-10">
            <p className="text-ash">Your cart is empty.</p>
            <Link
              href="/shop"
              className="label mt-4 inline-flex items-center gap-2 text-gold hover:text-snow"
            >
              Go to the shop <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {cart.lines.nodes.map((line) => (
                <li
                  key={line.id}
                  className="flex items-baseline justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-snow">
                    {line.quantity} × {line.merchandise.product.title}
                  </span>
                  <span className="tabular-nums text-ash">
                    {formatPrice(line.cost.totalAmount)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="label text-ash">Total</p>
              <p className="text-lg tabular-nums text-snow">
                {formatPrice(cart.cost.totalAmount)}
              </p>
            </div>

            <form action={placeDemoOrderAction} className="mt-10 max-w-md">
              {error && (
                <p className="mb-4 text-sm text-gold" role="alert">
                  Vul je naam en e-mailadres in om de demo-order te plaatsen.
                </p>
              )}
              <label htmlFor="checkout-name" className="label block text-ash">
                Name
              </label>
              <input
                id="checkout-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-2 h-11 w-full border border-line bg-night px-4 text-sm text-snow placeholder:text-ash"
                placeholder="Your name"
              />
              <label
                htmlFor="checkout-email"
                className="label mt-5 block text-ash"
              >
                Email
              </label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 h-11 w-full border border-line bg-night px-4 text-sm text-snow placeholder:text-ash"
                placeholder="you@example.com"
              />
              <Button type="submit" className="mt-8 w-full gap-2 sm:w-auto">
                Place demo order <ArrowRight className="size-4" aria-hidden />
              </Button>
            </form>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
