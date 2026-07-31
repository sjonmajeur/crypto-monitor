import Link from "next/link";
import { Search, User } from "lucide-react";

import { CartTrigger } from "@/components/cart/cart-trigger";
import { SandboxBanner } from "@/components/sandbox-banner";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/artists", label: "Artists" },
  { href: "/taji", label: "Taji" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

/**
 * Header naar het ARTCHY-model: announcement bar met gouden accenten,
 * daaronder de nav met zoek-, account- en cart-iconen. De cart-knop wordt
 * in stap 3 de trigger van de mini-cart drawer.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-coal/95 backdrop-blur-sm">
      <SandboxBanner />
      <p className="label border-b border-line py-2 text-center text-snow">
        <span className="text-gold">Limited drop</span> now live
        <span className="mx-3 text-ash">•</span>
        Free shipping above €100
      </p>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <nav aria-label="Main navigation" className="flex gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-snow transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-tight text-snow"
        >
          Artchy
        </Link>
        <div className="flex items-center gap-4">
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
            className="text-snow transition-colors hover:text-gold"
          >
            <User className="size-5" aria-hidden />
          </button>
          <CartTrigger />
        </div>
      </div>
    </header>
  );
}
