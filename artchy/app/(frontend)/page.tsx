import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Pencil,
  Lock,
  Shirt,
  User,
} from "lucide-react";

import { ArtistCards } from "@/components/artists/artist-cards";
import { CartResetWatcher } from "@/components/cart/cart-reset-watcher";
import { Countdown } from "@/components/home/countdown";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { getArtists, getHomepageContent } from "@/lib/cms/content";

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

/** Iconen bij de vier stappen; de teksten komen uit het CMS. */
const STEP_ICONS = [Pencil, Lock, Shirt, User];

/** Beelden die gelden zolang het CMS er geen heeft. */
const COLLECTION_FALLBACKS = [
  collectionJoshImg,
  collectionTajiImg,
  collectionBrassImg,
];

/* Teksten komen uit het CMS: per bezoek ophalen zodat een
   publicatie meteen zichtbaar is. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, artists] = await Promise.all([
    getHomepageContent(),
    getArtists(),
  ]);
  const { hero } = content;
  return (
    <>
      <SiteHeader />
      <Suspense fallback={null}>
        <CartResetWatcher />
      </Suspense>
      <main className="flex-1">
        {/* 3. Hero met tekst-overlay: links, verticaal gecentreerd
            (mobiel: links onderin) */}
        <section className="relative flex min-h-[85svh] items-end md:items-center">
          {/* Art-direction: hoge crop (man + TAJI-print) op smal, breed beeld op md+ */}
          <Image
            src={hero.afbeeldingMobiel ?? heroMobileImg}
            alt={hero.afbeeldingAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%] md:hidden"
          />
          <Image
            src={hero.afbeelding ?? heroImg}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="hidden object-cover md:block"
          />
          {/* Leesbaarheid: donkere gradient van links naar rechts + zachte
              verloop naar de volgende sectie onderaan */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-coal/85 via-coal/35 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-coal/30 via-transparent to-coal"
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 md:pb-0">
            <p className="label text-gold">{hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-snow sm:text-6xl lg:text-7xl">
              {hero.titelRegels.map((regel, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {regel}
                </span>
              ))}
            </h1>
            <Link href={hero.knopLink} className="mt-8 inline-block">
              <Button className="gap-2">
                {hero.knopTekst} <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </section>

        {/* 4. Featured collections */}
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 md:py-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="font-display text-xl uppercase text-snow sm:text-2xl">
              {content.collectiesTitel}
            </h2>
            <Link
              href="/shop"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              Explore all collections{" "}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {content.collecties.map((collection, index) => (
              <Reveal key={collection.titel}>
                {/* Ontwerpcompositie: tekst links, foto rechts (~55%);
                    mobiel gestackt met de foto boven */}
                <Link
                  href={collection.link}
                  className="group relative flex h-full min-h-52 flex-col border border-snow/15 bg-night transition-colors hover:border-gold/60 sm:flex-row"
                >
                  <span
                    className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center border border-snow/30 bg-coal/70 text-snow transition-colors group-hover:border-gold group-hover:text-gold"
                    aria-hidden
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                  <div className="relative aspect-[4/3] w-full overflow-hidden sm:order-2 sm:aspect-auto sm:w-[55%] sm:self-stretch">
                    <Image
                      src={collection.afbeelding ?? COLLECTION_FALLBACKS[index % 3]}
                      alt={`${collection.titel} collectie`}
                      loading="eager"
                      fill
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 55vw, 100vw"
                      className="object-cover transition-opacity duration-500 group-hover:opacity-80"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:order-1">
                    <h3 className="font-display text-2xl uppercase text-snow">
                      {collection.titel}
                    </h3>
                    <p className="mt-2 text-sm leading-snug text-ash">
                      {collection.tagline}
                    </p>
                    <p className="label mt-auto flex items-center gap-2 pt-4 text-gold group-hover:text-snow">
                      Explore collection{" "}
                      <ArrowRight className="size-4" aria-hidden />
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 5. How art becomes fashion */}
        <section className="bg-bone text-coal">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 text-center sm:px-6 md:py-24">
            <h2 className="text-heading">{content.stappenTitel}</h2>
            <p className="mt-2 text-sm text-coal/70">
              {content.stappenSubtitel}
            </p>
            <ol className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {content.stappen.map((step, i) => {
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                <li key={step.titel} className="flex flex-col items-center">
                  <span className="flex size-8 items-center justify-center rounded-full bg-coal font-display text-sm text-snow">
                    {i + 1}
                  </span>
                  <Icon className="mt-4 size-6" aria-hidden />
                  <h3 className="mt-3 font-display text-base uppercase">
                    {step.titel}
                  </h3>
                  <p className="mt-1 text-sm text-coal/70">{step.tekst}</p>
                </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* 6. Limited drop + countdown */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 overflow-x-clip px-4 py-14 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="label text-gold">{content.dropEyebrow}</p>
            <h2 className="mt-3 text-heading text-snow">
              {content.dropTitel}
            </h2>
            <p className="mt-3 text-sm text-ash">{content.dropSubregel}</p>
            <div className="mt-8">
              <Countdown target={content.dropEinddatum} />
            </div>
            <Link href={content.dropKnopLink} className="mt-10 inline-block">
              <Button variant="outline" className="gap-2">
                {content.dropKnopTekst}{" "}
                <ArrowRight className="size-4" aria-hidden />
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
                src={content.dropAfbeelding ?? dropHoodieImg}
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
          <p className="label text-gold">{content.creatorsEyebrow}</p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="text-heading text-snow">{content.creatorsTitel}</h2>
            <Link
              href="/artists"
              className="label flex items-center gap-2 text-gold hover:text-snow"
            >
              View all creators <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8">
            <ArtistCards artists={artists} />
          </div>
        </section>

        {/* 8. A new generation of creativity */}
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:py-24 lg:grid-cols-2">
            <div className="min-w-0">
              <h2 className="text-heading text-snow">
                {content.verhaalTitel}
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-ash">
                {content.verhaalTekst}
              </p>
            </div>
            <div className="relative aspect-video w-full overflow-hidden border border-line bg-night">
              <Image
                src={content.verhaalAfbeelding ?? generationImg}
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
                {content.communityTitel}
              </h2>
              <p className="mt-1 text-sm text-coal/70">
                {content.communityTekst}
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
