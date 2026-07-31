import type { Metadata } from "next";

import { FilterBar } from "@/components/collection/filter-bar";
import { ProductGrid } from "@/components/collection/product-grid";
import { SiteHeader } from "@/components/site-header";
import {
  applyCollectionFilters,
  deriveFilterOptions,
  parseSort,
} from "@/lib/collection";
import { getProducts, shopifyStatus } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Collectie",
  description:
    "Handgeblazen en klassiek glaswerk: tumblers, wijnglazen en karaffen.",
};

type SearchParams = Promise<{
  type?: string;
  inhoud?: string;
  sort?: string;
}>;

export default async function CollectiePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = shopifyStatus();

  if (!status.configured) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
          <h1 className="text-heading">Collectie</h1>
          <p data-placeholder="true" className="text-ink/70">
            Shopify is nog niet gekoppeld: {status.reason}. Vul de
            Storefront-keys in <code>.env.local</code> in om de collectie te
            tonen. Er wordt bewust geen mock-data getoond.
          </p>
        </main>
      </>
    );
  }

  const params = await searchParams;
  const filters = {
    type: params.type,
    inhoud: params.inhoud,
    sort: parseSort(params.sort),
  };

  // Volledige catalogus in één call; filteren en sorteren gebeurt hier
  // server-side. Prima bij ambachtelijke aantallen — zie DECISIONS.md.
  const allProducts = await getProducts({ first: 100 });
  const { types, volumesMl } = deriveFilterOptions(allProducts);
  const products = applyCollectionFilters(allProducts, filters);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <h1 className="text-heading">Collectie</h1>

        <div className="mt-8">
          <FilterBar
            types={types}
            volumesMl={volumesMl}
            activeType={filters.type}
            activeInhoud={filters.inhoud}
            activeSort={filters.sort}
            resultCount={products.length}
          />
        </div>

        <div className="mt-12">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <p className="py-24 text-center text-ink/60">
              {allProducts.length === 0
                ? "Er staan nog geen producten in de Shopify-store."
                : "Geen producten binnen deze filters."}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
