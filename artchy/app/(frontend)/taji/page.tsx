import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Taji",
  description: "The emotion creature. Wear your feelings. That's TAJI.",
};

/**
 * Placeholder tot er een Figma-frame voor de Taji-wereld is — zie
 * DECISIONS.md.
 */
export default function TajiPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-24">
        <p className="label text-gold">The emotion creature</p>
        <h1 className="text-display text-snow">Taji</h1>
        <p className="max-w-prose text-sm leading-relaxed text-ash">
          Born from imagination. Powered by emotion. Wear your feelings —
          that&apos;s TAJI.
        </p>
        <p data-placeholder="true" className="text-sm text-ash">
          The full world of Taji is coming soon.
        </p>
        <Link
          href="/shop?type=taji"
          className="label mt-4 flex items-center gap-2 text-gold hover:text-snow"
        >
          Shop the Taji collection <ArrowRight className="size-4" aria-hidden />
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
