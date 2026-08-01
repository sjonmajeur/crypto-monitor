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

import { ArtistCards } from "@/components/artists/artist-cards";
import { Countdown } from "@/components/home/countdown";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

/*
 * Statische imports: Next hasht de bestandsnamen (/_next/static/media/…),
 * zodat browsers na elke beeldwijziging automatisch de nieuwe versie laden.
 */
import heroImg from "@/public/hero.jpg";
import heroMobileImg from "@/public/hero-mobile.jpg";
import collectionJoshImg from "@/public/collection-josh.jpg";
import collectionTajiImg from "@/public/collection-taji.jpg";
import collectionBrassImg from "@/public/collection-brass.jpg";
import dropHoodieImg from "@/public/drop-hoodie.jpg";
import generationImg from "@/public/generation.jpg";

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
    image: collectionJoshImg,
    tagline: "Fearless creativity born from manga, heroes and imagination.",
  },
  {
    handle: "taji",
    name: "Taji",
    image: collectionTajiImg,
    tagline: "The emotion creature. Wear your feelings. That's TAJI.",
  },
  {
    handle: "brass",
    name: "Brass",
    image: collectionBrassImg,
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
          {/* Art-direction: hoge crop (man + TAJI-print) op smal, breed beeld op md+ */}
          <Image
            src={heroMobileImg}
            alt="Man met TAJI-hoodie voor de skyline bij avondlicht"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] md:hidden"
          />
          <Image
            src={heroImg}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-coal/40 via-transparent to-coal"
            aria-hidden
          />
        </section>

        {/* 4. Featured collections */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-24">
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
                      loading="eager"
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
          <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6 md:py-24">
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
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-4 py-14 sm:px-6 md:py-24 lg:grid-cols-2">
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
                src={dropHoodieImg}
                alt="De limited drop hoodie met TAJI-artwork"
                loading="eager"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 7. Meet the creators */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-24">
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
          <div className="mt-8">
            <ArtistCards variant="home" />
          </div>
        </section>

        {/* 8. A new generation of creativity */}
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-24 lg:grid-cols-2">
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
                src={generationImg}
                alt="Twee generaties voor de skyline"
                loading="eager"
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
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-10 sm:px-6 md:py-14">
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
