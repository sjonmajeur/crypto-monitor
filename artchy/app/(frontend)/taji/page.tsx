import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPaginasContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Taji",
  description: "The emotion creature. Wear your feelings. That's TAJI.",
};

/* Teksten komen uit het CMS: per bezoek ophalen zodat een
   publicatie meteen zichtbaar is. */
export const dynamic = "force-dynamic";

export default async function TajiPage() {
  const { taji } = await getPaginasContent();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="label text-gold">{taji.eyebrow}</p>
        <h1 className="text-display text-snow">{taji.titel}</h1>
        {taji.tekst.split(/\n+/).map((alinea) => (
          <p key={alinea} className="max-w-prose text-sm leading-relaxed text-ash">
            {alinea}
          </p>
        ))}
        <p className="text-sm text-ash">{taji.binnenkort}</p>
        <Link
          href="/shop?type=taji"
          className="label mt-4 flex items-center gap-2 text-gold hover:text-snow"
        >
          {taji.knopTekst} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
