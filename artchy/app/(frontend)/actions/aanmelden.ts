"use server";

import { headers } from "next/headers";

import { ipUitHeaders, logActiviteit } from "@/payload/activiteitenlog";
import { stuurAanmeldingMail } from "@/payload/email";

export type AanmeldResultaat = {
  ok: boolean;
  melding: string;
};

/**
 * Aanmelding voor het beheerpaneel. Maakt een account met status
 * "in afwachting" — die persoon kan niets tot een eigenaar goedkeurt.
 */
export async function meldAanAction(
  _vorigeStaat: AanmeldResultaat | null,
  formData: FormData,
): Promise<AanmeldResultaat> {
  const naam = String(formData.get("naam") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const wachtwoord = String(formData.get("wachtwoord") ?? "");

  if (!naam || !email || !wachtwoord) {
    return { ok: false, melding: "Vul je naam, e-mailadres en wachtwoord in." };
  }
  if (!email.includes("@")) {
    return { ok: false, melding: "Vul een geldig e-mailadres in." };
  }
  if (wachtwoord.length < 8) {
    return {
      ok: false,
      melding: "Kies een wachtwoord van minimaal 8 tekens.",
    };
  }
  if (!process.env.DATABASE_URI) {
    return {
      ok: false,
      melding:
        "Aanmelden kan nu niet: het beheerpaneel is nog niet ingesteld. Probeer het later opnieuw.",
    };
  }

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ]);
    const payload = await getPayload({ config });

    const bestaat = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });
    if (bestaat.totalDocs > 0) {
      // Geen informatie prijsgeven over bestaande accounts.
      return {
        ok: true,
        melding:
          "Bedankt. Als dit e-mailadres nog niet in gebruik is, ontvangt de eigenaar je aanvraag en hoor je zodra die is beoordeeld.",
      };
    }

    const nieuw = await payload.create({
      collection: "users",
      data: {
        naam,
        email,
        password: wachtwoord,
        rol: "redacteur",
        status: "in-afwachting",
      },
      overrideAccess: true,
    });

    const ip = ipUitHeaders(await headers());
    logActiviteit(payload, {
      gebruikerId: nieuw.id as number,
      naam,
      email,
      actie: "aanmelding-ontvangen",
      onderdeel: `Gebruiker: ${naam}`,
      ipAdres: ip,
    });

    void stuurAanmeldingMail(payload, {
      id: nieuw.id as number,
      naam,
      email,
    });

    return {
      ok: true,
      melding:
        "Bedankt voor je aanmelding. De eigenaar krijgt bericht en beoordeelt je aanvraag; je hoort het per e-mail zodra je toegang hebt.",
    };
  } catch (error) {
    console.error("[aanmelden] mislukt:", error);
    return {
      ok: false,
      melding:
        "Er ging iets mis bij het aanmelden. Probeer het later opnieuw.",
    };
  }
}
