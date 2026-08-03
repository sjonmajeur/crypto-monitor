"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { ArtistBioDialog } from "./artist-bio-dialog";
import { Reveal } from "@/components/reveal";
import { ARTISTS, type Artist } from "@/lib/artists";

/**
 * Uniforme artiest-kaarten met bio-popup: beeld altijd 4:5
 * (object-cover, center), naam en gouden subregel vast, tagline
 * maximaal 2 regels, LEARN MORE altijd onderaan. Grid: 3 kolommen op
 * desktop, 2 op tablet, 1 op mobiel — identiek op homepage en
 * /artists. Hele kaart klikbaar.
 */
export function ArtistCards({
  artists = ARTISTS,
  initialOpenSlug,
}: {
  /** Artiesten uit het CMS; zonder CMS de ingebouwde lijst. */
  artists?: Artist[];
  /** Behouden voor bestaande aanroepen; heeft geen visuele varianten meer. */
  variant?: "home" | "page";
  /** Opent direct de bio van deze artiest (bijv. vanuit het menu). */
  initialOpenSlug?: string;
}) {
  const [openArtist, setOpenArtist] = useState<Artist | null>(
    () =>
      artists.find(
        (a) => a.slug === initialOpenSlug?.toLowerCase(),
      ) ?? null,
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <Reveal key={artist.slug} className="h-full">
            <article
              className="group flex h-full cursor-pointer flex-col border border-line bg-night transition-colors hover:border-gold/60"
              onClick={() => setOpenArtist(artist)}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={artist.image}
                  alt={`Portret van ${artist.name}`}
                  loading="eager"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center transition-opacity duration-500 group-hover:opacity-85"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 font-display text-2xl uppercase text-snow">
                  {artist.name}
                </h3>
                <p className="label mt-1 line-clamp-1 text-gold">
                  {artist.role}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-ash">
                  {artist.tagline}
                </p>
                <button
                  type="button"
                  className="label mt-auto flex items-center gap-2 pt-5 text-gold transition-colors hover:text-snow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenArtist(artist);
                  }}
                >
                  Learn more <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {openArtist && (
        <ArtistBioDialog
          artist={openArtist}
          onClose={() => setOpenArtist(null)}
        />
      )}
    </>
  );
}
