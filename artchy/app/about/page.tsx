import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Artchy connects creativity, culture, and identity through fashion.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <h1 className="text-heading text-snow">
          A new generation of creativity
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-ash">
          Artchy is built on a unique collaboration between generations. From
          the raw imagination of young artist Josh, to the refined luxury
          vision of designer Brass, we connect creativity, culture, and
          identity through fashion. This is more than clothing. This is
          wearable art.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
