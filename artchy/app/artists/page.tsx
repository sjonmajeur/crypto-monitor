import type { Metadata } from "next";

import { ArtistCards } from "@/components/artists/artist-cards";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Artists",
  description: "The creators behind Artchy: Josh, Taji and Brass.",
};

export default function ArtistsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <p className="label text-gold">The world of Artchy</p>
        <h1 className="mt-2 text-heading text-snow">Meet the creators.</h1>
        <p className="mt-3 max-w-prose text-sm text-ash">
          Tap a creator to read their story.
        </p>
        <div className="mt-10">
          <ArtistCards variant="page" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
