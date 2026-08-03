import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { AanmeldFormulier } from "./AanmeldFormulier";

export const metadata: Metadata = {
  title: "Aanmelden voor het beheerpaneel",
  description: "Vraag toegang aan tot het beheerpaneel van ARTCHY.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AanmeldenPagina() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-6 py-24">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Beheerpaneel
          </p>
          <h1 className="text-heading text-snow">Toegang aanvragen</h1>
          <p className="text-sm leading-relaxed text-ash">
            Vul je gegevens in. Je aanvraag gaat naar de beheerder; zodra die
            is goedgekeurd krijg je een e-mail en kun je inloggen. Tot die tijd
            kun je nog niets in het paneel.
          </p>
        </div>

        <AanmeldFormulier />

        <p className="text-xs text-ash">
          Heb je al toegang?{" "}
          <Link href="/admin" className="text-bone underline hover:text-gold">
            Inloggen
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
