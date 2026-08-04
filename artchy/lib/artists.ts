import type { StaticImageData } from "next/image";

import content from "@/content/artists.json";
import creatorJoshImg from "@/public/creator-josh-portret.jpg";
import creatorTajiImg from "@/public/creator-taji.jpg";
import creatorBrassImg from "@/public/creator-brass-portret.jpg";

/**
 * De teksten komen uit content/artists.json — dat bestand kan de
 * eigenaar zonder developer aanpassen (zie HANDLEIDING-CONTENT.md in de
 * hoofdmap). Dit bestand vertaalt de JSON naar de vorm die de
 * componenten gebruiken; componenten hoeven nooit mee te veranderen.
 */
export type Artist = {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  image: StaticImageData | string;
  shopHref: string;
  featured?: boolean;
};

/**
 * Bekende foto's als statische import (krijgen een content-hash zodat
 * vervangingen direct doorwerken). Een nieuwe/onbekende bestandsnaam
 * valt terug op het gewone /public-pad en werkt ook.
 */
const KNOWN_IMAGES: Record<string, StaticImageData> = {
  "creator-josh.jpg": creatorJoshImg,
  "creator-taji.jpg": creatorTajiImg,
  "creator-brass.jpg": creatorBrassImg,
};

/** Uitgelichte (bredere) kaart in de homepage-grid, zoals in het ontwerp. */
const FEATURED_SLUGS = new Set(["taji"]);

export const ARTISTS: Artist[] = content.artists.map((entry) => {
  const slug = entry.naam.toLowerCase().replaceAll(" ", "-");
  return {
    slug,
    name: entry.naam,
    role: entry.subtitel,
    tagline: entry.tagline,
    bio: entry.bio,
    image: KNOWN_IMAGES[entry.foto] ?? `/${entry.foto}`,
    shopHref: `/shop?type=${slug}`,
    featured: FEATURED_SLUGS.has(slug),
  };
});

export function findArtist(slug: string | undefined): Artist | null {
  if (!slug) return null;
  return ARTISTS.find((a) => a.slug === slug.toLowerCase()) ?? null;
}
