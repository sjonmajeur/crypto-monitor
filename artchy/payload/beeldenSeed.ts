import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Payload } from "payload";

/**
 * Zet de huidige sitebeelden als échte Media-items in het CMS en
 * koppelt ze aan de juiste velden: hero (desktop en mobiel), de drie
 * collectiekaarten, de drop-hoodie, het generation-beeld en de drie
 * creator-portretten.
 *
 * Idempotent: een beeld wordt alleen geüpload als het veld nog leeg
 * is, en een al bestaand Media-item met dezelfde bestandsnaam wordt
 * hergebruikt. Latere keuzes van een beheerder blijven dus altijd
 * staan.
 */

const BEELDEN: Record<string, string> = {
  "hero-avond.jpg": "Model in Taji-hoodie voor de skyline bij zonsondergang",
  "hero-avond-mobiel.jpg": "Model in Taji-hoodie (staande uitsnede)",
  "collection-josh.jpg": "Collectiebeeld Josh — hoodie met artwork",
  "collection-taji.jpg": "Collectiebeeld Taji — het emotiewezen",
  "collection-brass.jpg": "Collectiebeeld Brass — verfijnd zwart",
  "drop-hoodie.jpg": "De drop: zwarte hoodie met artwork",
  "generation-tafel.jpg": "Josh, Taji en Brass samen aan de werktafel",
  "creator-josh-portret.jpg": "Portret van Josh",
  "creator-taji.jpg": "Portret van Taji",
  "creator-brass-portret.jpg": "Portret van Brass",
};

/**
 * Eerdere standaardbeelden → hun opvolger. Een veld dat nog naar zo'n
 * oud standaardbeeld wijst, krijgt automatisch de nieuwe versie; heeft
 * een beheerder zelf iets anders gekozen, dan blijft dat staan.
 */
const VERVANGINGEN: Record<string, string> = {
  "hero.jpg": "hero-avond.jpg",
  "hero-mobile.jpg": "hero-avond-mobiel.jpg",
  "generation.jpg": "generation-tafel.jpg",
  "creator-josh.jpg": "creator-josh-portret.jpg",
  "creator-brass.jpg": "creator-brass-portret.jpg",
};

const PORTRETTEN: Record<string, string> = {
  josh: "creator-josh-portret.jpg",
  taji: "creator-taji.jpg",
  brass: "creator-brass-portret.jpg",
};

async function vindOfUpload(
  payload: Payload,
  bestandsnaam: string,
): Promise<number | null> {
  const bestaand = await payload.find({
    collection: "media",
    where: { filename: { equals: bestandsnaam } },
    limit: 1,
    overrideAccess: true,
  });
  if (bestaand.totalDocs > 0) return bestaand.docs[0].id as number;

  try {
    const data = await readFile(path.join(process.cwd(), "public", bestandsnaam));
    const doc = await payload.create({
      collection: "media",
      data: { alt: BEELDEN[bestandsnaam] ?? bestandsnaam },
      file: {
        data,
        name: bestandsnaam,
        mimetype: bestandsnaam.endsWith(".png") ? "image/png" : "image/jpeg",
        size: data.byteLength,
      },
      overrideAccess: true,
    });
    return doc.id as number;
  } catch (error) {
    payload.logger.error(
      { err: error },
      `[beelden] ${bestandsnaam} kon niet worden geüpload`,
    );
    return null;
  }
}

export async function seedBeelden(payload: Payload): Promise<void> {
  type Beeld = { id?: number } | number | null | undefined;
  const leeg = (v: Beeld) => v === null || v === undefined;

  /** Bestandsnaam van het gekoppelde Media-item (of null). */
  const naamVan = async (v: Beeld): Promise<string | null> => {
    const id = typeof v === "number" ? v : (v as { id?: number })?.id;
    if (!id) return null;
    try {
      const doc = (await payload.findByID({
        collection: "media",
        id,
        depth: 0,
        overrideAccess: true,
      })) as { filename?: string };
      return doc?.filename ?? null;
    } catch {
      return null;
    }
  };

  /**
   * Bepaalt wat er in een beeldveld hoort: leeg → het standaardbeeld;
   * wijst het nog naar een oud standaardbeeld → de opvolger; anders
   * blijft de keuze van de beheerder staan (null = niets wijzigen).
   */
  const gewenst = async (huidig: Beeld, standaard: string): Promise<number | null> => {
    if (leeg(huidig)) return vindOfUpload(payload, standaard);
    const naam = await naamVan(huidig);
    if (naam && VERVANGINGEN[naam]) {
      return vindOfUpload(payload, VERVANGINGEN[naam]);
    }
    return null;
  };

  try {
    // ---- Homepage -------------------------------------------------
    const homepage = (await payload.findGlobal({
      slug: "homepage",
      depth: 0,
    })) as {
      hero?: Record<string, unknown> & {
        afbeelding?: Beeld;
        afbeeldingMobiel?: Beeld;
      };
      collecties?: Array<Record<string, unknown> & { afbeelding?: Beeld }>;
      dropAfbeelding?: Beeld;
      verhaalAfbeelding?: Beeld;
      _status?: string;
    };

    const kaartBestanden = [
      "collection-josh.jpg",
      "collection-taji.jpg",
      "collection-brass.jpg",
    ];

    const wijziging: Record<string, unknown> = {};

    const heroNieuw = await gewenst(homepage.hero?.afbeelding, "hero-avond.jpg");
    const heroMobielNieuw = await gewenst(
      homepage.hero?.afbeeldingMobiel,
      "hero-avond-mobiel.jpg",
    );
    if (heroNieuw !== null || heroMobielNieuw !== null) {
      wijziging.hero = {
        ...homepage.hero,
        afbeelding: heroNieuw ?? homepage.hero?.afbeelding,
        afbeeldingMobiel: heroMobielNieuw ?? homepage.hero?.afbeeldingMobiel,
      };
    }

    if (homepage.collecties?.length) {
      let kaartGewijzigd = false;
      const kaarten = [];
      for (const [i, kaart] of homepage.collecties.entries()) {
        const nieuw = await gewenst(
          kaart.afbeelding,
          kaartBestanden[i] ?? kaartBestanden[0],
        );
        if (nieuw !== null) kaartGewijzigd = true;
        kaarten.push({ ...kaart, afbeelding: nieuw ?? kaart.afbeelding });
      }
      if (kaartGewijzigd) wijziging.collecties = kaarten;
    }

    const dropNieuw = await gewenst(homepage.dropAfbeelding, "drop-hoodie.jpg");
    if (dropNieuw !== null) wijziging.dropAfbeelding = dropNieuw;
    const verhaalNieuw = await gewenst(
      homepage.verhaalAfbeelding,
      "generation-tafel.jpg",
    );
    if (verhaalNieuw !== null) wijziging.verhaalAfbeelding = verhaalNieuw;

    if (Object.keys(wijziging).length > 0) {
      await payload.updateGlobal({
        slug: "homepage",
        data: { ...wijziging, _status: "published" },
        overrideAccess: true,
      });
      payload.logger.info("[beelden] Homepage-beelden gekoppeld/bijgewerkt.");
    }

    // ---- Creator-portretten --------------------------------------
    const artiesten = await payload.find({
      collection: "artiesten",
      limit: 20,
      depth: 0,
      overrideAccess: true,
    });
    for (const artiest of artiesten.docs as Array<{
      id: number;
      slug?: string;
      portret?: Beeld;
    }>) {
      const bestand = PORTRETTEN[artiest.slug ?? ""];
      if (!bestand) continue;
      const beeldId = await gewenst(artiest.portret, bestand);
      if (beeldId === null) continue;
      await payload.update({
        collection: "artiesten",
        id: artiest.id,
        data: { portret: beeldId },
        overrideAccess: true,
      });
      payload.logger.info(`[beelden] Portret gekoppeld aan ${artiest.slug}.`);
    }
  } catch (error) {
    payload.logger.error({ err: error }, "[beelden] Koppelen van beelden mislukt");
  }
}
