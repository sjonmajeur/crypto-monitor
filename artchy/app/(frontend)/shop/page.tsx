import type { Metadata } from "next";

import { FilterBar } from "@/components/collection/filter-bar";
import { ProductGrid } from "@/components/collection/product-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPaginasContent } from "@/lib/cms/content";
import {
  applyCollectionFilters,
  deriveFilterOptions,
  parseSort,
} from "@/lib/collection";
import { getProducts } from "@/lib/shopify";

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
  // Zonder Storefront-token levert getProducts de demo-catalogus;
  // met token echte Shopify-data. Geen aparte UI nodig.
  const params = await searchParams;
  const filters = {
    type: params.type,
    inhoud: params.inhoud,
    sort: parseSort(params.sort),
  };

  // Volledige catalogus in één call; filteren en sorteren gebeurt hier
  // server-side. Prima bij limited drops — zie DECISIONS.md.
  const [allProducts, { shop: shopTeksten }] = await Promise.all([
    getProducts({ first: 100 }),
    getPaginasContent(),
  ]);
  const { types, volumesMl } = deriveFilterOptions(allProducts);
  const products = applyCollectionFilters(allProducts, filters);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <h1 className="text-heading text-snow">{shopTeksten.titel}</h1>

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
                ? shopTeksten.leegTekst
                : shopTeksten.geenMatchTekst}
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
