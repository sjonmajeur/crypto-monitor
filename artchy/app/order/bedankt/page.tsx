import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import {
  findOrderByCartToken,
  getWebhookOrders,
  type LoggedOrder,
} from "@/lib/sandbox/store";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your order has been received.",
};

export const dynamic = "force-dynamic";

/** Cart-gid heeft de vorm gid://shopify/Cart/<token>?key=… */
function cartTokenFromGid(gid: string): string | null {
  const match = gid.match(/Cart\/([^/?]+)/);
  return match ? match[1] : null;
}

async function resolveOrder(): Promise<LoggedOrder | null> {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;
  const token = cartId ? cartTokenFromGid(cartId) : null;

  if (token) {
    const match = await findOrderByCartToken(token);
    if (match) return match;
  }

  // Fallback: de meest recente order uit de webhook-log. In een
  // multi-user situatie is de cart-token-match leidend; dit vangt het
  // geval dat de cookie al weg is.
  const log = await getWebhookOrders();
  return log[0] ?? null;
}

export default async function ThankYouPage() {
  const order = await resolveOrder();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
        {order ? (
          <>
            <p className="label text-gold">Order received</p>
            <h1 className="mt-2 text-heading text-snow">
              Thank you — order {order.name}
            </h1>
            {order.test && (
              <p className="mt-2 text-sm text-ash">
                This is a test order. No real payment was made.
              </p>
            )}

            <ul className="mt-8 divide-y divide-line border-y border-line">
              {order.lineItems.map((item, i) => (
                <li
                  key={`${item.title}-${i}`}
                  className="flex items-baseline justify-between gap-4 py-3 text-sm"
                >
                  <span className="text-snow">
                    {item.quantity} × {item.title}
                  </span>
                  <span className="tabular-nums text-ash">
                    {formatPrice({
                      amount: item.price,
                      currencyCode: order.currency,
                    })}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between">
              <p className="label text-ash">Total</p>
              <p className="text-lg tabular-nums text-snow">
                {formatPrice({
                  amount: order.totalPrice,
                  currencyCode: order.currency,
                })}
              </p>
            </div>

            {order.orderStatusUrl && (
              <p className="mt-6 text-sm">
                <a
                  href={order.orderStatusUrl}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  View order status
                </a>
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-heading text-snow">Thank you</h1>
            <p className="mt-3 text-sm text-ash">
              We haven&apos;t received your order confirmation yet. It can take
              a few seconds for the webhook to arrive — refresh this page in a
              moment.
            </p>
          </>
        )}

        <p className="mt-10">
          <Link href="/shop" className="label text-gold hover:text-snow">
            Continue shopping
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
