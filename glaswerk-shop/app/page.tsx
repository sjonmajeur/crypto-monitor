import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { SiteHeader } from "@/components/site-header";
import { getProducts, shopifyStatus } from "@/lib/shopify";

/**
 * Tijdelijke home voor stap 1: toont de product card met echte
 * Shopify-producten zodra de Storefront-keys in .env.local staan.
 * De volledige home (hero ≥60vh, uitgelichte collectie, verhaal) volgt
 * in latere stappen op basis van de Figma-frames.
 */
export default async function Home() {
  const status = shopifyStatus();

  if (!status.configured) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading">Glaswerk</h1>
        <p data-placeholder="true" className="text-ink/70">
          Shopify is nog niet gekoppeld aan deze omgeving: {status.reason}.
          Kopieer <code>.env.example</code> naar <code>.env.local</code> en vul
          de Storefront-keys in — daarna verschijnen hier echte producten. Er
          wordt bewust niets met mock-data getoond.
        </p>
        </main>
      </>
    );
  }

  const products = await getProducts({ first: 6 });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-24">
        <h1 className="text-heading">Glaswerk</h1>
        <p className="mt-2 text-ink/70" data-placeholder="true">
          Voorproef van de collectie — de volledige home (hero, verhaal) volgt
          op basis van de Figma-frames.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
        <p className="mt-16">
          <Link
            href="/collectie"
            className="text-clay underline-offset-4 hover:underline"
          >
            Bekijk de hele collectie
          </Link>
        </p>
      </main>
    </>
  );
}
