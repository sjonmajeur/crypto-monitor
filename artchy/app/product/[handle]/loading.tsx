import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-6 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-[4/5] w-full" />
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <Skeleton className="mt-8 h-10 w-full max-w-sm" />
          <Skeleton className="mt-6 h-11 w-64" />
        </div>
      </main>
    </>
  );
}
