import type { Metadata } from "next";

import { InlogFormulier } from "./InlogFormulier";

export const metadata: Metadata = {
  title: "Inloggen",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Privé-ingang van de eigenaar. Staat bewust niet in het menu, in geen
 * enkele sitemap en wordt niet geïndexeerd. De pagina toont niets over
 * ARTCHY of over wie hier hoort in te loggen.
 */
export default function EigenaarPagina() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-8 px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-ash">Inloggen</p>
      <InlogFormulier />
    </main>
  );
}
