"use client";

import { SiteHeaderClient } from "@/components/site-header-client";
import { Button } from "@/components/ui/button";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeaderClient />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
        <h1 className="text-heading">Shop unavailable</h1>
        <p className="text-ash">
          Loading products from Shopify failed
          {error.message ? `: ${error.message}` : "."}
        </p>
        <div>
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </main>
    </>
  );
}
