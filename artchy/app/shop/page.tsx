import type { Metadata } from "next";

import { FilterBar } from "@/components/collection/filter-bar";
import { ProductGrid } from "@/components/collection/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  applyCollectionFilters,
  deriveFilterOptions,
  parseSort,
} from "@/lib/collection";
import { getProducts, shopifyStatus } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
  description: "Limited wearable art drops. Once it's gone, it never returns.",
};

type SearchParams = Promise<{
  type?: string;
  inhoud?: string;
  sort?: string;
}>;

export default async function ShopPage({
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
          <h1 className="text-heading">Shop</h1>
          <p data-placeholder="true" className="text-ash">
            Shopify is nog niet gekoppeld: {status.reason}. Vul de
            Storefront-keys in <code>.env.local</code> in om producten te
            tonen. Er wordt bewust geen mock-data getoond.
          </p>
        </main>
        <SiteFooter />
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
  // server-side. Prima bij limited drops — zie DECISIONS.md.
  const allProducts = await getProducts({ first: 100 });
  const { types, volumesMl } = deriveFilterOptions(allProducts);
  const products = applyCollectionFilters(allProducts, filters);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <h1 className="text-heading text-snow">Shop</h1>

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
            <p className="py-24 text-center text-ash">
              {allProducts.length === 0
                ? "No products in the store yet."
                : "No products match these filters."}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
