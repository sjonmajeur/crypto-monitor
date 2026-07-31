import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Over",
  description: "Het verhaal achter ons handgeblazen glaswerk.",
};

/**
 * Placeholder tot het merkverhaal uit Figma/de opdrachtgever komt
 * (stap 3+). Zie DECISIONS.md.
 */
export default function OverPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading">Over</h1>
        <p data-placeholder="true" className="text-ink/70">
          Het merkverhaal volgt — deze pagina wordt ingevuld op basis van het
          Figma-frame voor /over.
        </p>
      </main>
    </>
  );
}
