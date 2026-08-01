"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Artist } from "@/lib/artists";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Bio-popup: gecentreerde modal op desktop, bottom-sheet op mobiel.
 * Dialog-semantiek, focus-trap, Escape/backdrop/X om te sluiten,
 * scroll-lock op de body en focus terug naar de aanroeper.
 */
export function ArtistBioDialog({
  artist,
  onClose,
}: {
  artist: Artist;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`artist-dialog-${artist.slug}`}
    >
      <button
        type="button"
        aria-label="Close bio"
        onClick={onClose}
        className="dialog-backdrop absolute inset-0 bg-coal/80 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className="dialog-panel relative max-h-[85svh] w-full overflow-y-auto border border-line bg-night sm:max-w-[560px]"
      >
        <div className="relative h-40 w-full sm:h-48">
          <Image
            src={artist.image}
            alt={`Portret van ${artist.name}`}
            fill
            sizes="(min-width: 640px) 560px, 100vw"
            className="object-cover object-top"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-night"
            aria-hidden
          />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close bio"
            onClick={onClose}
            className="absolute right-3 top-3 flex size-9 items-center justify-center border border-snow/40 bg-coal/70 text-snow transition-colors hover:border-gold hover:text-gold"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h2
            id={`artist-dialog-${artist.slug}`}
            className="font-display text-3xl uppercase text-snow"
          >
            {artist.name}
          </h2>
          <p className="label mt-1 text-gold">{artist.role}</p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ash">
            {artist.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <Link href={artist.shopHref} className="mt-6 inline-block">
            <Button className="gap-2">
              Explore {artist.name}&apos;s collection{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
