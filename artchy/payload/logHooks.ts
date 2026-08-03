import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

import { ipUitHeaders, logActiviteit, onderdeelNaam } from "./activiteitenlog";
import { hervalideer } from "./hervalidatie";
import { isEigenaar } from "./rechten";

/**
 * Herbruikbare hooks die elke inhoudelijke wijziging in het
 * activiteitenlogboek zetten: wie, wanneer, welk onderdeel en welke
 * handeling. Het loggen gebeurt fire-and-forget (zie activiteitenlog.ts),
 * dus het kan het opslaan zelf nooit blokkeren of vertragen.
 */

type Wie = { id?: number; naam?: string; email?: string } | null | undefined;

function wie(req: { user?: unknown }): Wie {
  return req.user as Wie;
}

/** Bepaalt of het om publiceren gaat of om een gewone wijziging. */
function actieVoor(
  doc: Record<string, unknown>,
  vorige: Record<string, unknown> | undefined,
  operation: string,
): "aangemaakt" | "gewijzigd" | "gepubliceerd" {
  if (doc?._status === "published" && vorige?._status !== "published") {
    return "gepubliceerd";
  }
  return operation === "create" ? "aangemaakt" : "gewijzigd";
}

/** Voor collecties met een titelveld, bijv. artiesten (naam). */
export function logWijziging(
  slug: string,
  titelVeld?: string,
): CollectionAfterChangeHook {
  return async ({ doc, previousDoc, operation, req }) => {
    const gebruiker = wie(req);
    const titel = titelVeld
      ? ((doc as Record<string, unknown>)[titelVeld] as string | undefined)
      : undefined;

    logActiviteit(req.payload, {
      gebruikerId: gebruiker?.id ?? null,
      naam: gebruiker?.naam ?? null,
      email: gebruiker?.email ?? null,
      actie: actieVoor(
        doc as Record<string, unknown>,
        previousDoc as Record<string, unknown> | undefined,
        operation,
      ),
      onderdeel: onderdeelNaam(slug, titel),
      ipAdres: ipUitHeaders(req.headers),
      // Wat de eigenaar doet, ziet alleen de eigenaar terug.
      verborgen: isEigenaar(gebruiker),
    });

    await hervalideer(slug);
    return doc;
  };
}

export function logVerwijdering(
  slug: string,
  titelVeld?: string,
): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    const gebruiker = wie(req);
    const titel = titelVeld
      ? ((doc as Record<string, unknown>)[titelVeld] as string | undefined)
      : undefined;

    logActiviteit(req.payload, {
      gebruikerId: gebruiker?.id ?? null,
      naam: gebruiker?.naam ?? null,
      email: gebruiker?.email ?? null,
      actie: "verwijderd",
      onderdeel: onderdeelNaam(slug, titel),
      ipAdres: ipUitHeaders(req.headers),
      // Wat de eigenaar doet, ziet alleen de eigenaar terug.
      verborgen: isEigenaar(gebruiker),
    });

    await hervalideer(slug);
    return doc;
  };
}

/** Voor globals (Homepage, Footer & algemeen). */
export function logGlobalWijziging(slug: string): GlobalAfterChangeHook {
  return async ({ doc, previousDoc, req }) => {
    const gebruiker = wie(req);

    logActiviteit(req.payload, {
      gebruikerId: gebruiker?.id ?? null,
      naam: gebruiker?.naam ?? null,
      email: gebruiker?.email ?? null,
      actie: actieVoor(
        doc as Record<string, unknown>,
        previousDoc as Record<string, unknown> | undefined,
        "update",
      ),
      onderdeel: onderdeelNaam(slug),
      ipAdres: ipUitHeaders(req.headers),
      verborgen: isEigenaar(gebruiker),
    });

    await hervalideer(slug);
    return doc;
  };
}
