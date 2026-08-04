import type { Metadata } from "next";
import { Pencil, Lock, Shirt, User } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPaginasContent } from "@/lib/cms/content";

export const metadata: Metadata = {
  title: "How it works",
  description: "This is how we turn art into limited wearable pieces.",
};

/** Iconen bij de stappen; de teksten komen uit het CMS. */
const STEP_ICONS = [Pencil, Lock, Shirt, User];

/* Teksten komen uit het CMS: per bezoek ophalen zodat een
   publicatie meteen zichtbaar is. */
export const dynamic = "force-dynamic";

export default async function HowItWorksPage() {
  const { hoe } = await getPaginasContent();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-bone text-coal">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 text-center">
          <h1 className="text-heading">{hoe.titel}</h1>
          <p className="mt-2 text-sm text-coal/70">{hoe.subtitel}</p>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {hoe.stappen.map((stap, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <li key={stap.titel} className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-coal font-display text-sm text-snow">
                    {i + 1}
                  </span>
                  <Icon className="mt-4 size-6" aria-hidden />
                  <h2 className="mt-3 font-display text-base uppercase">
                    {stap.titel}
                  </h2>
                  <p className="mt-1 text-sm text-coal/70">{stap.tekst}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
