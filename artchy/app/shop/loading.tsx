import { ProductCardSkeleton } from "@/components/product/product-card";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-12 w-full" />
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-6">
          {[3, 3, 2, 2, 2].map((span, i) => (
            <ProductCardSkeleton
              key={i}
              className={span === 3 ? "lg:col-span-3" : "lg:col-span-2"}
            />
          ))}
        </div>
      </main>
    </>
  );
}
