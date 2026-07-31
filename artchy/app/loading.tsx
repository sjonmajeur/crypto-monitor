import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-24">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-4 h-5 w-96 max-w-full" />
    </main>
  );
}
