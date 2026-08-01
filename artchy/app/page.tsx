import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Pencil,
  Lock,
  Shirt,
  User,
} from "lucide-react";

import { Countdown } from "@/components/home/countdown";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

/*
 * Home naar het ARTCHY-model. Beelden zijn lokale placeholders in
 * public/ met vaste bestandsnamen — echte beelden zijn 1-op-1 te
 * vervangen zonder codewijziging. Zie DECISIONS.md.
 */

// Placeholder: drop sluit ~2 weken na oplevering (2026-08-01).
const DROP_ENDS_AT = "2026-08-15T22:00:00+02:00";

const COLLECTIONS = [
  {
    handle: "josh",
    name: "Josh",
    image: "/collection-josh.jpg",
    tagline: "Fearless creativity born from manga, heroes and imagination.",
  },
  {
    handle: "taji",
    name: "Taji",
    image: "/collection-taji.jpg",
    tagline: "The emotion creature. Wear your feelings. That's TAJI.",
  },
  {
    handle: "brass",
    name: "Brass",
    image: "/collection-brass.jpg",
    tagline: "Luxury meets identity. Timeless art, crafted to last.",
  },
];

const STEPS = [
  { icon: Pencil, title: "Choose", text: "Discover art from our creators." },
  { icon: Lock, title: "Unlock", text: "The community unlocks the design." },
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* 3. Hero — het beeld ís de hero, geen tekst eroverheen */}
        <section className="relative min-h-[85svh]">
          <Image
            src="/hero.jpg"
            alt="Man met TAJI-hoodie voor de skyline bij avondlicht"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-coal/40 via-transparent to-coal"
            aria-hidden
          />
        </section>

        {/* 4. Featured collections */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="font-display text-xl uppercase text-snow sm:text-2xl">
              Featured collections
            </h2>
            <Link
              href="/shop"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              Explore all collections{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.map((collection, i) => (
              <Reveal key={collection.handle} delay={i * 60}>
                <Link
                  href={`/shop?type=${collection.handle}`}
                  className="group relative block h-full border border-snow/15 bg-night p-4 transition-colors hover:border-gold/60"
                >
                  <span
                    className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center border border-snow/30 bg-coal/70 text-snow transition-colors group-hover:border-gold group-hover:text-gold"
                    aria-hidden
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={`${collection.name} collectie`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-opacity duration-500 group-hover:opacity-80"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-2xl uppercase text-snow">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-sm text-ash">{collection.tagline}</p>
                  <p className="label mt-4 flex items-center gap-2 text-gold group-hover:text-snow">
                    Explore collection{" "}
                    <ArrowRight className="size-4" aria-hidden />
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 5. How art becomes fashion */}
        <section className="bg-bone text-coal">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-heading">How art becomes fashion</h2>
            <p className="mt-2 text-sm text-coal/70">
              This is how we turn art into limited wearable pieces.
            </p>
            <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-coal font-display text-sm text-snow">
                    {i + 1}
                  </span>
                  <step.icon className="mt-4 size-6" aria-hidden />
                  <h3 className="mt-3 font-display text-base uppercase">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-coal/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Limited drop + countdown */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="min-w-0">
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
          <div className="relative aspect-square w-full">
            {/* Zachte spotlight-gloed achter de hoodie */}
            <div
              className="absolute -inset-8 -z-10"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(201,162,75,0.18), transparent 65%)",
              }}
              aria-hidden
            />
            <div className="relative h-full w-full overflow-hidden border border-snow/10 bg-night">
              <Image
                src="/drop-hoodie.jpg"
                alt="De limited drop hoodie met TAJI-artwork"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 7. Meet the creators */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="label text-gold">The world of Artchy</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="text-heading text-snow">Meet the creators.</h2>
            <Link
              href="/artists"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              View all creators <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1.2fr_1fr]">
            {/* Josh */}
            <Reveal>
              <article className="border border-line bg-night">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/creator-josh.jpg"
                    alt="Portret van Josh"
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-subheading text-snow">Josh</h3>
                  <p className="label mt-1 text-gold">The young visionary</p>
                  <p className="mt-3 text-sm text-ash">
                    Raw imagination. Limitless creativity.
                  </p>
                  <Link
                    href="/artists"
                    className="label mt-5 flex items-center gap-2 text-gold hover:text-snow"
                  >
                    Learn more <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>

            {/* Taji — middelste, uitgelicht */}
            <Reveal delay={60}>
              <article className="border border-gold/40 bg-night">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/creator-taji.jpg"
                    alt="TAJI, the emotion creature"
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 text-center">
                  <p className="label text-gold">Taji</p>
                  <h3 className="mt-1 text-subheading text-snow">
                    The emotion creature
                  </h3>
                  <p className="mt-3 text-sm text-ash">
                    Born from imagination. Powered by emotion.
                  </p>
                  <Link href="/taji" className="mt-5 inline-block">
                    <Button className="gap-2">
                      Learn more <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </Link>
                </div>
              </article>
            </Reveal>

            {/* Brass */}
            <Reveal delay={120}>
              <article className="border border-line bg-night">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/creator-brass.jpg"
                    alt="Portret van Brass"
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-subheading text-snow">Brass</h3>
                  <p className="label mt-1 text-gold">The luxury artist</p>
                  <p className="mt-3 text-sm text-ash">
                    Collaborations with global brands.
                  </p>
                  <Link
                    href="/artists"
                    className="label mt-5 flex items-center gap-2 text-gold hover:text-snow"
                  >
                    Learn more <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </section>

        {/* 8. A new generation of creativity */}
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
            <div className="min-w-0">
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
            <div className="relative aspect-video w-full overflow-hidden border border-line bg-night">
              <Image
                src="/generation.jpg"
                alt="Twee generaties voor de skyline"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              {/* Gouden kroon-doodle + ARTCHY-signatuur als SVG-overlay */}
              <svg
                viewBox="0 0 200 120"
                className="absolute right-4 top-4 w-2/5 max-w-56 text-gold"
                aria-hidden
              >
                <path
                  d="M 30 55 L 40 25 L 65 45 L 85 15 L 105 45 L 130 25 L 140 55 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <text
                  x="85"
                  y="95"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="28"
                  fontStyle="italic"
                  fontFamily="cursive"
                >
                  ARTCHY
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* 9. Join the community — ivoren balk */}
        <section className="bg-bone text-coal">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-12 sm:px-6">
            <div className="min-w-0">
              <h2 className="font-display text-xl uppercase sm:text-2xl">
                Join the Artchy community
              </h2>
              <p className="mt-1 text-sm text-coal/70">
                Be the first to access drops, exclusive releases, and artist
                stories.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
