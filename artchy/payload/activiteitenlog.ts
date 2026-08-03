import type { Payload } from "payload";

/**
 * Schrijft een regel in het activiteitenlogboek.
 *
 * Bewust met een eigen, kortstondige databaseverbinding en zonder
 * await op de aanroepplek: zo kan het loggen de handeling zelf nooit
 * blokkeren of vertragen. (Een eerdere versie schreef via payload.create
 * binnen de lopende login-transactie en liet het inloggen vastlopen.)
 */
export type Actie =
  | "ingelogd"
  | "uitgelogd"
  | "inloggen-mislukt"
  | "aangemaakt"
  | "gewijzigd"
  | "verwijderd"
  | "gepubliceerd"
  | "aanmelding-ontvangen"
  | "goedgekeurd"
  | "geweigerd"
  | "geblokkeerd"
  | "rol-gewijzigd";

export type LogRegel = {
  gebruikerId?: number | string | null;
  email?: string | null;
  naam?: string | null;
  actie: Actie;
  onderdeel?: string | null;
  details?: string | null;
  ipAdres?: string | null;
  /**
   * Regels van een eigenaar worden als verborgen weggeschreven: alleen
   * een eigenaar ziet ze terug in het logboek. Zo kan de eigenaar
   * meekijken zonder zelf in de lijst van anderen op te duiken.
   */
  verborgen?: boolean;
};

export function logActiviteit(payload: Payload | undefined, regel: LogRegel): void {
  const connectionString = process.env.DATABASE_URI;
  if (!connectionString) return;

  void (async () => {
    try {
      const { Client } = await import("pg");
      const client = new Client({ connectionString });
      await client.connect();
      try {
        await client.query(
          `insert into inloggeschiedenis
             (gebruiker_id, email, naam, actie, onderdeel, details,
              tijdstip, ip_adres, resultaat, verborgen, created_at, updated_at)
           values ($1, $2, $3, $4, $5, $6, now(), $7, $8, $9, now(), now())`,
          [
            typeof regel.gebruikerId === "number" ? regel.gebruikerId : null,
            regel.email ?? null,
            regel.naam ?? null,
            regel.actie,
            regel.onderdeel ?? null,
            regel.details ?? null,
            regel.ipAdres ?? "onbekend",
            // resultaat blijft bestaan voor de bestaande in-/uitlogregels
            regel.actie === "inloggen-mislukt" ? "mislukt" : "gelukt",
            regel.verborgen === true,
          ],
        );
      } finally {
        await client.end();
      }
    } catch (error) {
      payload?.logger?.error({ err: error }, "Activiteit niet gelogd");
    }
  })();
}

/** Best-effort IP: proxy-header eerst, anders onbekend. */
export function ipUitHeaders(headers?: Headers): string {
  const forwarded = headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers?.get?.("x-real-ip") ?? "onbekend";
}

/** Leesbare naam van het onderdeel dat is gewijzigd. */
export function onderdeelNaam(
  collectionOfGlobal: string,
  titel?: string | null,
): string {
  const namen: Record<string, string> = {
    homepage: "Homepage",
    "site-instellingen": "Footer & algemeen",
    paginas: "Overige pagina's",
    artiesten: "Artiest",
    media: "Afbeelding",
    users: "Gebruiker",
  };
  const basis = namen[collectionOfGlobal] ?? collectionOfGlobal;
  return titel ? `${basis}: ${titel}` : basis;
}
