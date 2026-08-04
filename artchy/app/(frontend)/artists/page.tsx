import type { Metadata } from "next";

import { ArtistCards } from "@/components/artists/artist-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getArtists, getPaginasContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "Artists",
  description: "The creators behind Artchy: Josh, Taji and Brass.",
};

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: Promise<{ artist?: string }>;
}) {
  const { artist } = await searchParams;
  const [artists, { artiestenPagina }] = await Promise.all([
    getArtists(),
    getPaginasContent(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <p className="label text-gold">{artiestenPagina.eyebrow}</p>
        <h1 className="mt-2 text-heading text-snow">{artiestenPagina.titel}</h1>
        <p className="mt-3 max-w-prose text-sm text-ash">
          {artiestenPagina.subtitel}
        </p>
        <div className="mt-10">
          {/* key zorgt dat een menu-klik naar een andere artiest de
              bijbehorende bio opent, ook als je al op /artists staat */}
          <ArtistCards
            key={artist ?? "none"}
            artists={artists}
            initialOpenSlug={artist}
            kaartLinkTekst={artiestenPagina.kaartLinkTekst}
            bioKnopTekst={artiestenPagina.bioKnopTekst}
            bioPaginaKnopTekst={artiestenPagina.bioPaginaKnopTekst}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
