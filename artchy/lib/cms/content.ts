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
  DEFAULT_PAGINAS,
  DEFAULT_SITE_SETTINGS,
  type HomepageContent,
  type PaginasContent,
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
    collectiesLinkTekst: text(doc.collectiesLinkTekst, d.collectiesLinkTekst),
    kaartLinkTekst: text(doc.kaartLinkTekst, d.kaartLinkTekst),
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
    klokLabels: (() => {
      const k = (doc.klokLabels ?? {}) as Record<string, unknown>;
      return {
        dagen: text(k.dagen, d.klokLabels.dagen),
        uren: text(k.uren, d.klokLabels.uren),
        minuten: text(k.minuten, d.klokLabels.minuten),
        seconden: text(k.seconden, d.klokLabels.seconden),
      };
    })(),
    creatorsEyebrow: text(doc.creatorsEyebrow, d.creatorsEyebrow),
    creatorsTitel: text(doc.creatorsTitel, d.creatorsTitel),
    creatorsLinkTekst: text(doc.creatorsLinkTekst, d.creatorsLinkTekst),
    verhaalTitel: text(doc.verhaalTitel, d.verhaalTitel),
    verhaalTekst: text(doc.verhaalTekst, d.verhaalTekst),
    verhaalAfbeelding: mediaUrl(doc.verhaalAfbeelding),
    communityTitel: text(doc.communityTitel, d.communityTitel),
    communityTekst: text(doc.communityTekst, d.communityTekst),
    communityKnopTekst: text(doc.communityKnopTekst, d.communityKnopTekst),
    communityPlaceholder: text(doc.communityPlaceholder, d.communityPlaceholder),
    communityBevestiging: text(doc.communityBevestiging, d.communityBevestiging),
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

  const kolommen = (doc.kolomTitels ?? {}) as Record<string, unknown>;
  return {
    menu: linkList(doc.menu, d.menu),
    merknaam: text(doc.merknaam, d.merknaam),
    logo: mediaUrl(doc.logo),
    kolomTitels: {
      menu: text(kolommen.menu, d.kolomTitels.menu),
      info: text(kolommen.info, d.kolomTitels.info),
      volg: text(kolommen.volg, d.kolomTitels.volg),
    },
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

export async function getPaginasContent(): Promise<PaginasContent> {
  const doc = await getGlobal<Record<string, unknown>>("paginas");
  const d = DEFAULT_PAGINAS;
  if (!doc) return d;

  const over = (doc.over ?? {}) as Record<string, unknown>;
  const taji = (doc.taji ?? {}) as Record<string, unknown>;
  const artiestenPagina = (doc.artiestenPagina ?? {}) as Record<string, unknown>;
  const hoe = (doc.hoe ?? {}) as Record<string, unknown>;
  const shop = (doc.shop ?? {}) as Record<string, unknown>;

  const hoeStappen = list<{ titel?: string; tekst?: string }>(hoe.stappen, []).map(
    (stap) => ({ titel: text(stap.titel, ""), tekst: text(stap.tekst, "") }),
  );

  return {
    artiestenPagina: {
      eyebrow: text(artiestenPagina.eyebrow, d.artiestenPagina.eyebrow),
      titel: text(artiestenPagina.titel, d.artiestenPagina.titel),
      subtitel: text(artiestenPagina.subtitel, d.artiestenPagina.subtitel),
      kaartLinkTekst: text(
        artiestenPagina.kaartLinkTekst,
        d.artiestenPagina.kaartLinkTekst,
      ),
      bioKnopTekst: text(artiestenPagina.bioKnopTekst, d.artiestenPagina.bioKnopTekst),
    },
    hoe: {
      titel: text(hoe.titel, d.hoe.titel),
      subtitel: text(hoe.subtitel, d.hoe.subtitel),
      stappen: hoeStappen.filter((stap) => stap.titel).length
        ? hoeStappen.filter((stap) => stap.titel)
        : d.hoe.stappen,
    },
    shop: {
      titel: text(shop.titel, d.shop.titel),
      leegTekst: text(shop.leegTekst, d.shop.leegTekst),
      geenMatchTekst: text(shop.geenMatchTekst, d.shop.geenMatchTekst),
    },
    over: {
      titel: text(over.titel, d.over.titel),
      tekst: text(over.tekst, d.over.tekst),
    },
    taji: {
      eyebrow: text(taji.eyebrow, d.taji.eyebrow),
      titel: text(taji.titel, d.taji.titel),
      tekst: text(taji.tekst, d.taji.tekst),
      binnenkort: text(taji.binnenkort, d.taji.binnenkort),
      knopTekst: text(taji.knopTekst, d.taji.knopTekst),
    },
  };
}
