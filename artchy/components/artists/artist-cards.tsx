"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { ArtistBioDialog } from "./artist-bio-dialog";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { ARTISTS, findArtist, type Artist } from "@/lib/artists";
import { cn } from "@/lib/utils";

/**
 * De drie artiest-kaarten met bio-popup. `variant="home"` volgt de
 * homepage-layout (uitgelichte TAJI-middenkolom); `variant="page"` is
 * het grid op /artists. Hele kaart klikbaar, opent de dialog.
 */
export function ArtistCards({
  variant,
  initialOpenSlug,
}: {
  variant: "home" | "page";
  /** Opent direct de bio van deze artiest (bijv. vanuit het menu). */
  initialOpenSlug?: string;
}) {
  const [openArtist, setOpenArtist] = useState<Artist | null>(() =>
    findArtist(initialOpenSlug),
  );

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          variant === "home"
            ? "items-start lg:grid-cols-[1fr_1.2fr_1fr]"
            : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {ARTISTS.map((artist, i) => {
          const highlighted = variant === "home" && artist.featured;
          return (
            <Reveal key={artist.slug} delay={i * 60}>
              <article
                className={cn(
                  "group cursor-pointer border bg-night transition-colors hover:border-gold/60",
                  highlighted ? "border-gold/40" : "border-line",
                )}
                onClick={() => setOpenArtist(artist)}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    highlighted ? "aspect-[3/4]" : "aspect-[4/5]",
                  )}
                >
                  <Image
                    src={artist.image}
                    alt={`Portret van ${artist.name}`}
                    loading="eager"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-opacity duration-500 group-hover:opacity-85"
                  />
                </div>
                <div className={cn("p-5", highlighted && "text-center")}>
                  {highlighted ? (
                    <>
                      <p className="label text-gold">{artist.name}</p>
                      <h3 className="mt-1 text-subheading text-snow">
                        {artist.role}
                      </h3>
                    </>
                  ) : (
                    <>
                      <h3 className="font-display text-2xl uppercase text-snow">
                        {artist.name}
                      </h3>
                      <p className="label mt-1 text-gold">{artist.role}</p>
                    </>
                  )}
                  <p className="mt-3 text-sm text-ash">{artist.tagline}</p>
                  {highlighted ? (
                    <Button
                      className="mt-5 gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenArtist(artist);
                      }}
                    >
                      Learn more <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  ) : (
                    <button
                      type="button"
                      className="label mt-5 flex items-center gap-2 text-gold transition-colors hover:text-snow"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenArtist(artist);
                      }}
                    >
                      Learn more <ArrowRight className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
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
