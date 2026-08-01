"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, User, X } from "lucide-react";

import { CartTrigger } from "@/components/cart/cart-trigger";
import { SandboxBanner } from "@/components/sandbox-banner";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/artists", label: "Artists" },
  { href: "/taji", label: "Taji" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

/**
 * Header naar het ARTCHY-model: sandbox-balk bovenaan, dan de gouden
 * announcement bar, dan de nav met links (desktop) of hamburger
 * (mobiel), logo gecentreerd, iconen rechts.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Sluiten op Escape; links sluiten het menu zelf via onClick.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-coal/95 backdrop-blur-sm">
      <SandboxBanner />
      <p className="label border-b border-line py-2 text-center text-snow">
        <span className="text-gold">Limited drop</span> now live
        <span className="mx-3 text-ash">•</span>
        Free shipping above €100
      </p>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6">
        <div className="flex justify-start">
          <nav aria-label="Main navigation" className="hidden gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "label transition-colors hover:text-gold",
                  isActive(item.href) ? "text-gold" : "text-snow",
                )}
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
          className="justify-self-center font-display text-2xl uppercase tracking-tight text-snow"
        >
          Artchy
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
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "label block py-3 transition-colors hover:text-gold",
                    isActive(item.href) ? "text-gold" : "text-snow",
                  )}
                  onClick={() => setMenuOpen(false)}
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
