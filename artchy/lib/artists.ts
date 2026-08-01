import type { StaticImageData } from "next/image";

import creatorJoshImg from "@/public/creator-josh.jpg";
import creatorTajiImg from "@/public/creator-taji.jpg";
import creatorBrassImg from "@/public/creator-brass.jpg";

/**
 * Alle artiest-data op één plek: teksten aanpassen of een artiest
 * toevoegen kan hier, zonder de componenten te raken.
 */
export type Artist = {
  slug: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  image: StaticImageData;
  shopHref: string;
  /** Uitgelichte (bredere) kaart in grids, zoals TAJI in het ontwerp. */
  featured?: boolean;
};

export const ARTISTS: Artist[] = [
  {
    slug: "josh",
    name: "Josh",
    role: "The young visionary",
    tagline: "Raw imagination. Limitless creativity.",
    bio: [
      "Josh is fourteen, and his sketchbooks don't close. Raised on manga panels, superhero arcs and late-night drawing sessions, he fills page after page with characters that refuse to sit still — heroes, monsters, and everything in between.",
      "His work is raw on purpose. No polish, no filter — just the direct line from imagination to ink. The rough edges most brands would sand away are exactly what Artchy prints.",
      "Every Josh drop starts as a drawing that made him grin. If the community unlocks it, it becomes a limited piece you can wear — and then it's gone.",
    ],
    image: creatorJoshImg,
    shopHref: "/shop?type=josh",
  },
  {
    slug: "taji",
    name: "Taji",
    role: "The emotion creature",
    tagline: "Born from imagination. Powered by emotion.",
    bio: [
      "Taji was born in the margins of Josh's sketchbook — the emotion creature. Part fox, part storm of paint, it escaped the page before the ink was dry.",
      "Taji doesn't do words. It wears feelings as colors: joy splashes yellow, courage burns red, calm settles into teal. Every piece in the Taji collection captures a single mood, caught mid-burst.",
      "Wear your feelings. That's TAJI.",
    ],
    image: creatorTajiImg,
    shopHref: "/shop?type=taji",
    featured: true,
  },
  {
    slug: "brass",
    name: "Brass",
    role: "The luxury artist",
    tagline: "Collaborations with global brands.",
    bio: [
      "Brass spent a decade designing for global houses — the kind of studios where a millimeter is a debate. He brought that discipline to Artchy, and kept the soul.",
      "His pieces are quiet luxury with a signature: refined cuts, heavyweight fabrics, details you notice the second time. Timeless art, crafted to last.",
      "For every drop, Brass takes Josh's raw energy and gives it an edge you can wear anywhere — from the block to the gallery.",
    ],
    image: creatorBrassImg,
    shopHref: "/shop?type=brass",
  },
];
