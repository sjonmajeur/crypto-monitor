import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Artists",
  description: "The creators behind Artchy: Josh, Taji and Brass.",
};

const CREATORS = [
  {
    name: "Josh",
    role: "The young visionary",
    text: "Raw imagination. Limitless creativity.",
  },
  {
    name: "Taji",
    role: "The emotion creature",
    text: "Born from imagination. Powered by emotion.",
  },
  {
    name: "Brass",
    role: "The luxury artist",
    text: "Collaborations with global brands.",
  },
];

/**
 * Placeholder tot er een Figma-frame of briefing voor de artist-pagina's
 * is — zie DECISIONS.md.
 */
export default function ArtistsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <p className="label text-gold">The world of Artchy</p>
        <h1 className="mt-2 text-heading text-snow">Meet the creators.</h1>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((creator) => (
            <article
              key={creator.name}
              className="border border-line bg-night p-6"
            >
              <h2 className="text-subheading text-snow">{creator.name}</h2>
              <p className="label mt-1 text-gold">{creator.role}</p>
              <p className="mt-3 text-sm text-ash">{creator.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-ash" data-placeholder="true">
          Full artist stories coming soon.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
