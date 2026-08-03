import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPaginasContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artchy connects creativity, culture, and identity through fashion.",
};

/* Teksten komen uit het CMS: per bezoek ophalen zodat een
   publicatie meteen zichtbaar is. */
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { over } = await getPaginasContent();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading text-snow">{over.titel}</h1>
        {over.tekst.split(/\n+/).map((alinea) => (
          <p key={alinea} className="max-w-prose text-sm leading-relaxed text-ash">
            {alinea}
          </p>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}
