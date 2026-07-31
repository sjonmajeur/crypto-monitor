import Link from "next/link";
import { ArrowRight, Pencil, Lock, Shirt, User } from "lucide-react";

import { Countdown } from "@/components/home/countdown";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

/*
 * Home naar het ARTCHY-model (screenshot). Beeldmateriaal (hero,
 * creator-foto's, drop-shot) ontbreekt nog als los asset — die vlakken
 * staan er als gemarkeerde placeholders tot de echte beelden er zijn.
 * Zie DECISIONS.md.
 */

// Placeholder tot de echte drop-einddatum uit Shopify/planning komt.
const DROP_ENDS_AT = "2026-08-31T22:00:00+02:00";

const COLLECTIONS = [
  {
    handle: "josh",
    name: "Josh",
    tagline: "Fearless creativity born from mangas, heroes and imagination.",
  },
  {
    handle: "taji",
    name: "Taji",
    tagline: "The emotion creature. Wear your feelings. That's TAJI.",
  },
  {
    handle: "brass",
    name: "Brass",
    tagline: "Luxury meets identity. Timeless art, crafted to last.",
  },
];

const STEPS = [
  {
    icon: Pencil,
    title: "Choose",
    text: "Discover art from our creators.",
  },
  {
    icon: Lock,
    title: "Unlock",
    text: "The community unlocks the design.",
  },
  {
    icon: Shirt,
    title: "Produce",
    text: "We produce limited editions, never mass.",
  },
  {
    icon: User,
    title: "Wear",
    text: "You wear more than clothing. You wear art.",
  },
];

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

function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      data-placeholder="true"
      role="img"
      aria-label={`${label} — beeld volgt`}
      className={`flex items-center justify-center bg-night text-ash ${className ?? ""}`}
    >
      <span className="label">{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <ImagePlaceholder
            label="Hero — hoodie tegen skyline"
            className="min-h-[60vh] w-full"
          />
        </section>

        {/* Featured collections */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="text-heading text-snow">Featured collections</h2>
            <Link
              href="/shop"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              Explore all collections <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.map((collection, i) => (
              <Reveal key={collection.handle} delay={i * 60}>
                <Link
                  href={`/shop?type=${collection.handle}`}
                  className="group block border border-line bg-night p-4"
                >
                  <ImagePlaceholder
                    label={`Collectiebeeld ${collection.name}`}
                    className="aspect-square w-full"
                  />
                  <h3 className="mt-4 text-subheading text-snow">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-sm text-ash">{collection.tagline}</p>
                  <p className="label mt-4 flex items-center gap-2 text-gold group-hover:text-snow">
                    Explore collection <ArrowRight className="size-4" aria-hidden />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How art becomes fashion */}
        <section className="bg-bone text-coal">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
            <h2 className="text-heading">How art becomes fashion</h2>
            <p className="mt-2 text-sm text-coal/70">
              This is how we turn art into limited wearable pieces.
            </p>
            <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-coal font-display text-sm text-snow">
                    {i + 1}
                  </span>
                  <step.icon className="mt-4 size-6" aria-hidden />
                  <h3 className="mt-3 text-base">{step.title}</h3>
                  <p className="mt-1 text-sm text-coal/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Limited drop + countdown */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="label text-gold">Limited release</p>
            <h2 className="mt-3 text-heading text-snow">
              This drop is produced only for the community.
            </h2>
            <p className="mt-3 text-sm text-ash">
              Once it&apos;s gone, it never returns.
            </p>
            <div className="mt-8">
              <Countdown target={DROP_ENDS_AT} />
            </div>
            <Link href="/shop" className="mt-10 inline-block">
              <Button variant="outline" className="gap-2">
                View collection <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>
          <ImagePlaceholder
            label="Drop-shot — hoodie"
            className="aspect-square w-full"
          />
        </section>

        {/* Meet the creators */}
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <p className="label text-gold">The world of Artchy</p>
          <div className="mt-2 flex items-baseline justify-between gap-6">
            <h2 className="text-heading text-snow">Meet the creators.</h2>
            <Link
              href="/artists"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              View all creators <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CREATORS.map((creator, i) => (
              <Reveal key={creator.name} delay={i * 60}>
                <article className="border border-line bg-night">
                  <ImagePlaceholder
                    label={`Portret ${creator.name}`}
                    className="aspect-[4/5] w-full"
                  />
                  <div className="p-5">
                    <h3 className="text-subheading text-snow">{creator.name}</h3>
                    <p className="label mt-1 text-gold">{creator.role}</p>
                    <p className="mt-3 text-sm text-ash">{creator.text}</p>
                    <Link
                      href="/artists"
                      className="label mt-5 flex items-center gap-2 text-gold hover:text-snow"
                    >
                      Learn more <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* A new generation of creativity */}
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
            <div>
              <h2 className="text-heading text-snow">
                A new generation of creativity
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-ash">
                Artchy is built on a unique collaboration between generations.
                From the raw imagination of young artist Josh, to the refined
                luxury vision of designer Brass, we connect creativity,
                culture, and identity through fashion. This is more than
                clothing. This is wearable art.
              </p>
            </div>
            <ImagePlaceholder
              label="Storybeeld — twee generaties"
              className="aspect-video w-full"
            />
          </div>
        </section>

        {/* Join the community */}
        <section className="border-t border-line">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-12">
            <div>
              <h2 className="text-subheading text-snow">
                Join the Artchy community
              </h2>
              <p className="mt-1 text-sm text-ash">
                Be the first to access drops, exclusive releases, and artist
                stories.
              </p>
            </div>
            {/* Nog niet gekoppeld aan een mailinglijst — zie DECISIONS.md */}
            <form
              data-placeholder="true"
              className="flex w-full max-w-md gap-2"
              aria-label="Newsletter signup"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Enter your email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 border border-line bg-night px-4 text-sm text-snow placeholder:text-ash"
              />
              <Button type="submit" variant="outline" className="gap-2">
                Join the community <ArrowRight className="size-4" aria-hidden />
              </Button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
