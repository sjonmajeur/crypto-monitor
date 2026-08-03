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
  "hero.jpg": "Model in ARTCHY hoodie voor een betonnen muur",
  "hero-mobile.jpg": "Model in ARTCHY hoodie (staand beeld)",
  "collection-josh.jpg": "Collectiebeeld Josh — hoodie met artwork",
  "collection-taji.jpg": "Collectiebeeld Taji — het emotiewezen",
  "collection-brass.jpg": "Collectiebeeld Brass — verfijnd zwart",
  "drop-hoodie.jpg": "De drop: zwarte hoodie met artwork",
  "generation.jpg": "Werkplaats waar de collectie ontstaat",
  "creator-josh.jpg": "Portret van Josh",
  "creator-taji.jpg": "Portret van Taji",
  "creator-brass.jpg": "Portret van Brass",
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
    const kaartenLeeg = (homepage.collecties ?? []).some((k) => leeg(k.afbeelding));

    if (
      leeg(homepage.hero?.afbeelding) ||
      leeg(homepage.hero?.afbeeldingMobiel) ||
      leeg(homepage.dropAfbeelding) ||
      leeg(homepage.verhaalAfbeelding) ||
      kaartenLeeg
    ) {
      const wijziging: Record<string, unknown> = {};

      if (leeg(homepage.hero?.afbeelding) || leeg(homepage.hero?.afbeeldingMobiel)) {
        wijziging.hero = {
          ...homepage.hero,
          afbeelding: leeg(homepage.hero?.afbeelding)
            ? await vindOfUpload(payload, "hero.jpg")
            : homepage.hero?.afbeelding,
          afbeeldingMobiel: leeg(homepage.hero?.afbeeldingMobiel)
            ? await vindOfUpload(payload, "hero-mobile.jpg")
            : homepage.hero?.afbeeldingMobiel,
        };
      }
      if (kaartenLeeg && homepage.collecties?.length) {
        wijziging.collecties = await Promise.all(
          homepage.collecties.map(async (kaart, i) => ({
            ...kaart,
            afbeelding: leeg(kaart.afbeelding)
              ? await vindOfUpload(payload, kaartBestanden[i] ?? kaartBestanden[0])
              : kaart.afbeelding,
          })),
        );
      }
      if (leeg(homepage.dropAfbeelding)) {
        wijziging.dropAfbeelding = await vindOfUpload(payload, "drop-hoodie.jpg");
      }
      if (leeg(homepage.verhaalAfbeelding)) {
        wijziging.verhaalAfbeelding = await vindOfUpload(payload, "generation.jpg");
      }

      await payload.updateGlobal({
        slug: "homepage",
        data: { ...wijziging, _status: "published" },
        overrideAccess: true,
      });
      payload.logger.info("[beelden] Homepage-beelden gekoppeld.");
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
      if (!leeg(artiest.portret)) continue;
      const bestand = `creator-${artiest.slug}.jpg`;
      if (!(bestand in BEELDEN)) continue;
      const beeldId = await vindOfUpload(payload, bestand);
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
