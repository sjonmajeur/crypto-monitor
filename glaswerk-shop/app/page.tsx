import { ProductCard } from "@/components/product/product-card";
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
      <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading">Glaswerk</h1>
        <p data-placeholder="true" className="text-ink/70">
          Shopify is nog niet gekoppeld aan deze omgeving: {status.reason}.
          Kopieer <code>.env.example</code> naar <code>.env.local</code> en vul
          de Storefront-keys in — daarna verschijnen hier echte producten. Er
          wordt bewust niets met mock-data getoond.
        </p>
      </main>
    );
  }

  const products = await getProducts({ first: 6 });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-24">
      <h1 className="text-heading">Glaswerk</h1>
      <p className="mt-2 text-ink/70" data-placeholder="true">
        Stap 1-preview van de product card met live Shopify-data.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 3} />
        ))}
      </div>
    </main>
  );
}
