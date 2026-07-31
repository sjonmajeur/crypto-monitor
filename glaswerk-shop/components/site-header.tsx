import Link from "next/link";

/**
 * Minimale header voor stap 2. De cart-trigger (sticky mini-cart drawer)
 * komt er in stap 3 bij.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-glass/40 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Glaswerk
        </Link>
        <nav aria-label="Hoofdnavigatie" className="flex gap-6 text-sm">
          <Link href="/collectie" className="hover:text-moss">
            Collectie
          </Link>
          <Link href="/over" className="hover:text-moss">
            Over
          </Link>
        </nav>
      </div>
    </header>
  );
}
