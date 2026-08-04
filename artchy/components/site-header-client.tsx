"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";

import { CartTrigger } from "@/components/cart/cart-trigger";
import { SandboxBanner } from "@/components/sandbox-banner";
import type { Artist } from "@/lib/artists";
import { ARTISTS } from "@/lib/artists";
import { DEFAULT_HOMEPAGE, DEFAULT_SITE_SETTINGS } from "@/lib/cms/defaults";
import { cn } from "@/lib/utils";
import logoKroon from "@/public/logo-kroon.png";

type NavItem = { href: string; label: string };

/**
 * Header naar het ARTCHY-model. "Artists" is een dropdown (desktop) of
 * groep met sub-items (mobiel) met de drie artiesten; elk item opent de
 * bio-popup via /artists?artist=<slug>.
 */
export function SiteHeaderClient({
  menu = DEFAULT_SITE_SETTINGS.menu.map((m) => ({ href: m.href, label: m.label })),
  artists = ARTISTS,
  aankondiging = DEFAULT_HOMEPAGE.aankondiging,
  logoUrl = null,
}: {
  menu?: NavItem[];
  artists?: Artist[];
  aankondiging?: { accentTekst: string; tekst: string; tweedeTekst: string };
  /** Logo uit het CMS; null = de roze kroon. */
  logoUrl?: string | null;
} = {}) {
  // "Artists" krijgt het uitklapmenu; de rest staat ervoor of erachter.
  const shopIndex = menu.findIndex((item) => item.href === "/shop");
  const splitAt = shopIndex >= 0 ? shopIndex + 1 : menu.length;
  const navBefore = menu.slice(0, splitAt);
  const navAfter = menu.slice(splitAt);
  const [menuOpen, setMenuOpen] = useState(false);
  const [artistsOpen, setArtistsOpen] = useState(false);
  const artistsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Sluiten op Escape; dropdown ook bij klik buiten het menu.
  useEffect(() => {
    if (!menuOpen && !artistsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setArtistsOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (artistsOpen && !artistsRef.current?.contains(e.target as Node)) {
        setArtistsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen, artistsOpen]);

  const navLinkClass = (active: boolean) =>
    cn(
      "label transition-colors hover:text-gold",
      active ? "text-gold" : "text-snow",
    );

  const closeAll = () => {
    setMenuOpen(false);
    setArtistsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-coal/95 backdrop-blur-sm">
      <SandboxBanner />
      <p className="label border-b border-line py-2 text-center text-snow">
        <span className="text-gold">{aankondiging.accentTekst}</span>{" "}
        {aankondiging.tekst}
        <span className="mx-3 text-ash">•</span>
        {aankondiging.tweedeTekst}
      </p>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex justify-start">
          <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
            {navBefore.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={navLinkClass(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}

            <div ref={artistsRef} className="relative">
              <button
                type="button"
                aria-expanded={artistsOpen}
                aria-controls="artists-dropdown"
                className={cn(
                  navLinkClass(isActive("/artists")),
                  "flex items-center gap-1",
                )}
                onClick={() => setArtistsOpen((v) => !v)}
              >
                Artists
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    artistsOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {artistsOpen && (
                <div
                  id="artists-dropdown"
                  className="absolute left-0 top-full mt-3 w-48 border border-line bg-coal py-2"
                >
                  <Link
                    href="/artists"
                    className="label block px-4 py-2.5 text-snow hover:text-gold"
                    onClick={closeAll}
                  >
                    All artists
                  </Link>
                  <div className="mx-4 my-1 border-t border-line" aria-hidden />
                  {artists.map((artist) => (
                    <Link
                      key={artist.slug}
                      href={`/artists?artist=${artist.slug}`}
                      className="label block px-4 py-2.5 text-snow hover:text-gold"
                      onClick={closeAll}
                    >
                      {artist.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navAfter.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={navLinkClass(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="text-snow transition-colors hover:text-gold lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>

        <Link
          href="/"
          aria-label="Artchy — home"
          className="justify-self-center"
        >
          {/* Logo uit het CMS; de roze kroon als standaard */}
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Artchy"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <Image src={logoKroon} alt="Artchy" className="h-10 w-auto" priority />
          )}
        </Link>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            aria-label="Search"
            className="text-snow transition-colors hover:text-gold"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="hidden text-snow transition-colors hover:text-gold sm:block"
          >
            <User className="size-5" aria-hidden />
          </button>
          <CartTrigger />
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-line lg:hidden"
        >
          <ul className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6">
            {navBefore.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(navLinkClass(isActive(item.href)), "block py-3")}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/artists"
                className={cn(navLinkClass(isActive("/artists")), "block py-3")}
                onClick={closeAll}
              >
                Artists
              </Link>
              <ul className="border-l border-line pl-4">
                {artists.map((artist) => (
                  <li key={artist.slug}>
                    <Link
                      href={`/artists?artist=${artist.slug}`}
                      className="label block py-2.5 text-ash transition-colors hover:text-gold"
                      onClick={closeAll}
                    >
                      {artist.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {navAfter.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(navLinkClass(isActive(item.href)), "block py-3")}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
