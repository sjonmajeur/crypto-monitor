import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArtiestPagina } from "@/lib/cms/content";

/*
 * Eén template voor alle artiestpagina's (/taji, /josh, /brass, …):
 * de data komt per artiest uit de Artiesten-collectie. Bestaande
 * routes zoals /shop en /artists winnen altijd van dit dynamische
 * segment; de slug-guard in het CMS voorkomt bovendien dat een
 * artiest zo'n naam krijgt.
 */

/* Teksten komen uit het CMS: per bezoek ophalen zodat een
   publicatie meteen zichtbaar is. */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ artiest: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { artiest } = await params;
  const pagina = await getArtiestPagina(artiest.toLowerCase());
  if (!pagina) return {};
  return {
    title: pagina.kop,
    description: pagina.alineas[0] ?? `The world of ${pagina.naam}.`,
  };
}

export default async function ArtiestPagina({ params }: Props) {
  const { artiest } = await params;
  const pagina = await getArtiestPagina(artiest.toLowerCase());
  if (!pagina) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <p className="label text-gold">{pagina.eyebrow}</p>
            <h1 className="text-display text-snow">{pagina.kop}</h1>
            {pagina.alineas.map((alinea) => (
              <p
                key={alinea}
                className="max-w-prose text-sm leading-relaxed text-ash"
              >
                {alinea}
              </p>
            ))}
            {pagina.binnenkort ? (
              <p className="text-sm text-ash">{pagina.binnenkort}</p>
            ) : null}
            <Link
              href={pagina.knopLink}
              className="label mt-4 flex items-center gap-2 text-gold hover:text-snow"
            >
              {pagina.knopTekst} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          {pagina.beelden.length > 0 ? (
            <div className="grid gap-6">
              {pagina.beelden.map((beeld, i) => (
                <div
                  key={beeld.url}
                  className="relative aspect-[4/5] w-full max-w-md overflow-hidden border border-line bg-night"
                >
                  <Image
                    src={beeld.url}
                    alt={beeld.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
