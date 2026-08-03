import type { Payload } from "payload";

/**
 * Alle e-mails van het beheerpaneel, in het Nederlands en in de toon
 * van ARTCHY. Versturen gebeurt best-effort: mislukt het, dan blijft de
 * handeling zelf gewoon doorgaan en komt er een regel in de log.
 */

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://artchy.up.railway.app"
  ).replace(/\/$/, "");
}

function omhulsel(titel: string, inhoud: string): string {
  return `<!doctype html>
<html lang="nl"><body style="margin:0;background:#0a0a0a;padding:32px 16px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" style="max-width:520px;margin:0 auto;
    background:#141414;border:1px solid #2a2a2a;">
    <tr><td style="padding:32px;">
      <p style="margin:0 0 24px;font-size:12px;letter-spacing:.15em;
        text-transform:uppercase;color:#c9a24b;">ARTCHY</p>
      <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;
        color:#ffffff;">${titel}</h1>
      ${inhoud}
    </td></tr>
    <tr><td style="padding:16px 32px;border-top:1px solid #2a2a2a;
      font-size:12px;color:#9a968e;">
      Dit bericht komt van het beheerpaneel van ARTCHY.
    </td></tr>
  </table>
</body></html>`;
}

function knop(tekst: string, url: string): string {
  return `<p style="margin:24px 0 0;">
    <a href="${url}" style="display:inline-block;background:#c9a24b;
      color:#0a0a0a;text-decoration:none;padding:12px 20px;font-size:13px;
      letter-spacing:.1em;text-transform:uppercase;">${tekst}</a>
  </p>`;
}

const alinea = (tekst: string) =>
  `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#9a968e;">${tekst}</p>`;

async function verstuur(
  payload: Payload | undefined,
  opties: { to: string; subject: string; html: string },
): Promise<void> {
  if (!payload?.sendEmail) return;
  try {
    await payload.sendEmail(opties);
  } catch (error) {
    payload.logger?.error(
      { err: error },
      `E-mail naar ${opties.to} kon niet worden verstuurd`,
    );
  }
}

/** Melding aan alle eigenaren dat iemand zich heeft aangemeld. */
export async function stuurAanmeldingMail(
  payload: Payload,
  aanvrager: { id: number | string; naam: string; email: string },
): Promise<void> {
  try {
    const eigenaren = await payload.find({
      collection: "users",
      where: { rol: { equals: "eigenaar" } },
      limit: 20,
      overrideAccess: true,
    });

    const link = `${siteUrl()}/admin/collections/users/${aanvrager.id}`;
    const tijdstip = new Date().toLocaleString("nl-NL", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const html = omhulsel(
      "Nieuwe aanmelding voor het beheerpaneel",
      alinea("Iemand wil toegang tot het beheerpaneel van ARTCHY.") +
        `<table style="margin:16px 0;font-size:15px;color:#ffffff;">
          <tr><td style="padding:4px 16px 4px 0;color:#9a968e;">Naam</td><td>${aanvrager.naam}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#9a968e;">E-mail</td><td>${aanvrager.email}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#9a968e;">Tijdstip</td><td>${tijdstip}</td></tr>
        </table>` +
        alinea(
          "Deze persoon kan nog niets: het account staat op 'in afwachting' tot jij het goedkeurt.",
        ) +
        knop("Aanmelding bekijken", link),
    );

    for (const eigenaar of eigenaren.docs as unknown as Array<{ email: string }>) {
      await verstuur(payload, {
        to: eigenaar.email,
        subject: `Nieuwe aanmelding: ${aanvrager.naam}`,
        html,
      });
    }
  } catch (error) {
    payload.logger?.error({ err: error }, "Aanmeldmail niet verstuurd");
  }
}

/** Bevestiging aan de aanvrager dat hij is goedgekeurd. */
export async function stuurGoedgekeurdMail(
  payload: Payload,
  gebruiker: { naam?: string; email: string },
): Promise<void> {
  const html = omhulsel(
    "Je hebt toegang tot het beheerpaneel",
    alinea(`Hallo ${gebruiker.naam ?? ""},`.trim()) +
      alinea(
        "Je aanmelding is goedgekeurd. Je kunt vanaf nu inloggen op het beheerpaneel van ARTCHY en aan de slag met de teksten en foto's van de site.",
      ) +
      knop("Naar het beheerpaneel", `${siteUrl()}/admin`) +
      alinea(
        "Log in met het e-mailadres en wachtwoord waarmee je je hebt aangemeld.",
      ),
  );

  await verstuur(payload, {
    to: gebruiker.email,
    subject: "Je toegang tot ARTCHY is goedgekeurd",
    html,
  });
}

/** Nette afwijzing aan de aanvrager. */
export async function stuurGeweigerdMail(
  payload: Payload,
  gebruiker: { naam?: string; email: string },
): Promise<void> {
  const html = omhulsel(
    "Over je aanmelding",
    alinea(`Hallo ${gebruiker.naam ?? ""},`.trim()) +
      alinea(
        "Bedankt voor je aanmelding voor het beheerpaneel van ARTCHY. We geven op dit moment geen toegang tot dit account.",
      ) +
      alinea(
        "Denk je dat dit een vergissing is? Neem dan contact op met de eigenaar van de site.",
      ),
  );

  await verstuur(payload, {
    to: gebruiker.email,
    subject: "Over je aanmelding bij ARTCHY",
    html,
  });
}
