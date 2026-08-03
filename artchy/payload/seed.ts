import type { Payload } from "payload";

import {
  DEFAULT_ARTISTS,
  DEFAULT_HOMEPAGE,
  DEFAULT_PAGINAS,
  DEFAULT_SITE_SETTINGS,
} from "../lib/cms/defaults";
import { seedBeelden } from "./beeldenSeed";

/*
 * Bewust geen import uit lib/artists.ts of een JSON-bestand: die zijn
 * niet laadbaar buiten de Next-bundler, en de Payload-CLI heeft deze
 * config wel nodig (bijv. voor generate:importmap).
 */
const ARTISTS = DEFAULT_ARTISTS.map((a) => ({
  name: a.naam,
  slug: a.naam.toLowerCase().replaceAll(" ", "-"),
  role: a.subtitel,
  tagline: a.tagline,
  bio: a.bio,
}));

/** Zet platte alinea's om naar het Lexical-formaat van de rich text-editor. */
function paragraphsToLexical(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "text",
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            version: 1,
          },
        ],
      })),
    },
  };
}

/**
 * Vult het CMS bij de allereerste start met de huidige teksten van de
 * site (Josh, Taji, Brass + de homepage- en footerteksten). Draait
 * alleen als er nog niets staat, dus latere wijzigingen blijven staan.
 */
export async function seedIfEmpty(payload: Payload): Promise<void> {
  try {
    const bestaande = await payload.count({ collection: "artiesten" });
    if (bestaande.totalDocs === 0) {
      for (const [index, artist] of ARTISTS.entries()) {
        await payload.create({
          collection: "artiesten",
          data: {
            naam: artist.name,
            slug: artist.slug,
            subtitel: artist.role,
            tagline: artist.tagline,
            bio: paragraphsToLexical(artist.bio),
            volgorde: index + 1,
            _status: "published",
          },
          overrideAccess: true,
        });
      }
      payload.logger.info("[seed] Artiesten aangemaakt met de huidige teksten.");
    }

    const homepage = (await payload.findGlobal({ slug: "homepage" })) as {
      hero?: { eyebrow?: string };
    };
    if (!homepage?.hero?.eyebrow) {
      const d = DEFAULT_HOMEPAGE;
      await payload.updateGlobal({
        slug: "homepage",
        data: {
          aankondiging: d.aankondiging,
          hero: {
            eyebrow: d.hero.eyebrow,
            titelRegels: d.hero.titelRegels.map((regel) => ({ regel })),
            knopTekst: d.hero.knopTekst,
            knopLink: d.hero.knopLink,
          },
          collectiesTitel: d.collectiesTitel,
          collecties: d.collecties.map((c) => ({
            titel: c.titel,
            tagline: c.tagline,
            link: c.link,
          })),
          stappenTitel: d.stappenTitel,
          stappenSubtitel: d.stappenSubtitel,
          stappen: d.stappen,
          dropEyebrow: d.dropEyebrow,
          dropTitel: d.dropTitel,
          dropSubregel: d.dropSubregel,
          dropEinddatum: d.dropEinddatum,
          dropKnopTekst: d.dropKnopTekst,
          dropKnopLink: d.dropKnopLink,
          creatorsEyebrow: d.creatorsEyebrow,
          creatorsTitel: d.creatorsTitel,
          verhaalTitel: d.verhaalTitel,
          verhaalTekst: d.verhaalTekst,
          communityTitel: d.communityTitel,
          communityTekst: d.communityTekst,
          communityKnopTekst: d.communityKnopTekst,
          _status: "published",
        },
        overrideAccess: true,
      });
      payload.logger.info("[seed] Homepage gevuld met de huidige teksten.");
    }

    const settings = (await payload.findGlobal({
      slug: "site-instellingen",
    })) as { merknaam?: string };
    if (!settings?.merknaam) {
      const d = DEFAULT_SITE_SETTINGS;
      await payload.updateGlobal({
        slug: "site-instellingen",
        data: {
          menu: d.menu.map((m) => ({ label: m.label, link: m.href })),
          merknaam: d.merknaam,
          merkOndertitel: d.merkOndertitel,
          merkZin: d.merkZin,
          footerMenu: d.footerMenu.map((m) => ({ label: m.label, link: m.href })),
          footerInfo: d.footerInfo.map((m) => ({ label: m.label, link: m.href })),
          copyright: d.copyright,
          slogan: d.slogan,
          socials: d.socials,
          _status: "published",
        },
        overrideAccess: true,
      });
      payload.logger.info("[seed] Footer/algemeen gevuld.");
    }
    const paginas = (await payload.findGlobal({ slug: "paginas" })) as {
      over?: { titel?: string };
    };
    if (!paginas?.over?.titel) {
      await payload.updateGlobal({
        slug: "paginas",
        data: DEFAULT_PAGINAS,
        overrideAccess: true,
      });
      payload.logger.info("[seed] Overige pagina's gevuld.");
    }

    // Beelden altijd controleren: dit vult ook een bestaande
    // installatie aan waar de tekst al staat maar de beelden nog niet.
    await seedBeelden(payload);
  } catch (error) {
    payload.logger.error({ err: error }, "[seed] Vullen van het CMS mislukt");
  }
}
