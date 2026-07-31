"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function CollectieError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
        <h1 className="text-heading">De collectie laadt niet</h1>
        <p className="text-ink/70">
          Het ophalen van producten uit Shopify is mislukt
          {error.message ? `: ${error.message}` : "."}
        </p>
        <div>
          <Button onClick={reset} variant="outline">
            Opnieuw proberen
          </Button>
        </div>
      </main>
    </>
  );
}
