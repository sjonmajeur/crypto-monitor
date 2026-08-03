import { ProductCardSkeleton } from "@/components/product/product-card";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-12 sm:px-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-12 w-full" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </>
  );
}
