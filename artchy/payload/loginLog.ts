import type { Payload } from "payload";

/**
 * Schrijft een inlogpoging weg in de tabel "inloggeschiedenis".
 *
 * Bewust met een eigen, kortstondige databaseverbinding: zowel
 * payload.create als de gedeelde pool van Payload lopen vast op de
 * transactie van de lopende login. De aanroep is fire-and-forget, dus
 * inloggen kan er nooit door vertragen of blokkeren.
 */
export function logLoginAttempt(
  payload: Payload,
  gegevens: {
    gebruikerId?: number | string | null;
    email: string;
    ipAdres: string;
    resultaat: "gelukt" | "mislukt";
  },
): void {
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
             (gebruiker_id, email, tijdstip, ip_adres, resultaat,
              created_at, updated_at)
           values ($1, $2, now(), $3, $4, now(), now())`,
          [
            gegevens.gebruikerId ?? null,
            gegevens.email,
            gegevens.ipAdres,
            gegevens.resultaat,
          ],
        );
      } finally {
        await client.end();
      }
    } catch (error) {
      payload.logger?.error({ err: error }, "Inlogpoging niet gelogd");
    }
  })();
}

/** Best-effort IP: proxy-header eerst, anders onbekend. */
export function ipUitHeaders(headers?: Headers): string {
  const forwarded = headers?.get?.("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers?.get?.("x-real-ip") ?? "onbekend";
}
