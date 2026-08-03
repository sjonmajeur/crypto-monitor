import "server-only";

import {
  getCollection,
  getGlobal,
  mediaAlt,
  mediaUrl,
  richTextToParagraphs,
} from "./client";
import { ARTISTS, type Artist } from "@/lib/artists";
import {
  DEFAULT_HOMEPAGE,
  DEFAULT_SITE_SETTINGS,
  type HomepageContent,
  type SiteSettingsContent,
} from "./defaults";

/**
 * Leest content uit Payload en vult ontbrekende velden aan met de
 * bestaande waarden van de site. Zo ziet de site er zonder CMS exact
 * hetzelfde uit als nu.
 */

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function list<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const doc = await getGlobal<Record<string, unknown>>("homepage");
  const d = DEFAULT_HOMEPAGE;
  if (!doc) return d;

  const hero = (doc.hero ?? {}) as Record<string, unknown>;
  const aankondiging = (doc.aankondiging ?? {}) as Record<string, unknown>;

  const titelRegels = list<{ regel?: string }>(hero.titelRegels, []).map((r) =>
    text(r.regel, ""),
  );

  return {
    aankondiging: {
      accentTekst: text(aankondiging.accentTekst, d.aankondiging.accentTekst),
      tekst: text(aankondiging.tekst, d.aankondiging.tekst),
      tweedeTekst: text(aankondiging.tweedeTekst, d.aankondiging.tweedeTekst),
    },
    hero: {
      eyebrow: text(hero.eyebrow, d.hero.eyebrow),
      titelRegels: titelRegels.filter(Boolean).length
        ? titelRegels.filter(Boolean)
        : d.hero.titelRegels,
      knopTekst: text(hero.knopTekst, d.hero.knopTekst),
      knopLink: text(hero.knopLink, d.hero.knopLink),
      afbeelding: mediaUrl(hero.afbeelding),
      afbeeldingAlt: mediaAlt(hero.afbeelding, d.hero.afbeeldingAlt),
      afbeeldingMobiel: mediaUrl(hero.afbeeldingMobiel),
    },
    collectiesTitel: text(doc.collectiesTitel, d.collectiesTitel),
    collecties: list<Record<string, unknown>>(doc.collecties, []).length
      ? list<Record<string, unknown>>(doc.collecties, []).map((c, i) => ({
          titel: text(c.titel, d.collecties[i]?.titel ?? ""),
          tagline: text(c.tagline, d.collecties[i]?.tagline ?? ""),
          link: text(c.link, d.collecties[i]?.link ?? "/shop"),
          afbeelding: mediaUrl(c.afbeelding),
        }))
      : d.collecties,
    stappenTitel: text(doc.stappenTitel, d.stappenTitel),
    stappenSubtitel: text(doc.stappenSubtitel, d.stappenSubtitel),
    stappen: list<Record<string, unknown>>(doc.stappen, []).length
      ? list<Record<string, unknown>>(doc.stappen, []).map((s, i) => ({
          titel: text(s.titel, d.stappen[i]?.titel ?? ""),
          tekst: text(s.tekst, d.stappen[i]?.tekst ?? ""),
        }))
      : d.stappen,
    dropEyebrow: text(doc.dropEyebrow, d.dropEyebrow),
    dropTitel: text(doc.dropTitel, d.dropTitel),
    dropSubregel: text(doc.dropSubregel, d.dropSubregel),
    dropEinddatum: text(doc.dropEinddatum, d.dropEinddatum),
    dropKnopTekst: text(doc.dropKnopTekst, d.dropKnopTekst),
    dropKnopLink: text(doc.dropKnopLink, d.dropKnopLink),
    dropAfbeelding: mediaUrl(doc.dropAfbeelding),
    creatorsEyebrow: text(doc.creatorsEyebrow, d.creatorsEyebrow),
    creatorsTitel: text(doc.creatorsTitel, d.creatorsTitel),
    verhaalTitel: text(doc.verhaalTitel, d.verhaalTitel),
    verhaalTekst: text(doc.verhaalTekst, d.verhaalTekst),
    verhaalAfbeelding: mediaUrl(doc.verhaalAfbeelding),
    communityTitel: text(doc.communityTitel, d.communityTitel),
    communityTekst: text(doc.communityTekst, d.communityTekst),
    communityKnopTekst: text(doc.communityKnopTekst, d.communityKnopTekst),
  };
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  const doc = await getGlobal<Record<string, unknown>>("site-instellingen");
  const d = DEFAULT_SITE_SETTINGS;
  if (!doc) return d;

  const socials = (doc.socials ?? {}) as Record<string, unknown>;
  const linkList = (value: unknown, fallback: typeof d.menu) =>
    list<Record<string, unknown>>(value, []).length
      ? list<Record<string, unknown>>(value, []).map((item) => ({
          label: text(item.label, ""),
          href: text(item.link, ""),
        }))
      : fallback;

  return {
    menu: linkList(doc.menu, d.menu),
    merknaam: text(doc.merknaam, d.merknaam),
    merkOndertitel: text(doc.merkOndertitel, d.merkOndertitel),
    merkZin: text(doc.merkZin, d.merkZin),
    footerMenu: linkList(doc.footerMenu, d.footerMenu),
    footerInfo: linkList(doc.footerInfo, d.footerInfo),
    copyright: text(doc.copyright, d.copyright),
    slogan: text(doc.slogan, d.slogan),
    socials: {
      instagram: text(socials.instagram, d.socials.instagram),
      tiktok: text(socials.tiktok, d.socials.tiktok),
      youtube: text(socials.youtube, d.socials.youtube),
    },
  };
}

export async function getArtists(): Promise<Artist[]> {
  const docs = await getCollection<Record<string, unknown>>("artiesten", {
    sort: "volgorde",
  });
  if (!docs || docs.length === 0) return ARTISTS;

  return docs.map((doc, i) => {
    const fallback = ARTISTS[i] ?? ARTISTS[0];
    const slug = text(doc.slug, fallback?.slug ?? `artiest-${i}`);
    const portret = mediaUrl(doc.portret);
    const bio = richTextToParagraphs(doc.bio);
    return {
      slug,
      name: text(doc.naam, fallback?.name ?? ""),
      role: text(doc.subtitel, fallback?.role ?? ""),
      tagline: text(doc.tagline, fallback?.tagline ?? ""),
      bio: bio.length ? bio : (fallback?.bio ?? []),
      image: portret ?? fallback?.image ?? "",
      shopHref: `/shop?type=${slug}`,
    };
  });
}
