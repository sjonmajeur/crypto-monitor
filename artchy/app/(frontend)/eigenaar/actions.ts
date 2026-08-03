"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ipUitHeaders, logActiviteit } from "@/payload/activiteitenlog";

export type InlogResultaat = { melding: string };

/**
 * Eigen inlogpagina van de eigenaar. Werkt met dezelfde accounts en
 * hetzelfde wachtwoord als het beheerpaneel, maar staat los van
 * /admin/login: hij is nergens gelinkt en wordt niet geïndexeerd.
 *
 * Alleen een eigenaar komt hier binnen. Iedereen anders krijgt exact
 * dezelfde foutmelding als bij een verkeerd wachtwoord, zodat deze
 * pagina niets prijsgeeft.
 */
export async function logInAlsEigenaarAction(
  _vorigeStaat: InlogResultaat | null,
  formData: FormData,
): Promise<InlogResultaat> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const wachtwoord = String(formData.get("wachtwoord") ?? "");
  const mislukt = { melding: "E-mailadres of wachtwoord klopt niet." };

  if (!email || !wachtwoord) return mislukt;
  if (!process.env.DATABASE_URI) {
    return { melding: "Inloggen kan nu niet: de database is niet bereikbaar." };
  }

  const ip = ipUitHeaders(await headers());
  let token: string | undefined;

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ]);
    const payload = await getPayload({ config });

    const resultaat = await payload.login({
      collection: "users",
      data: { email, password: wachtwoord },
    });

    const gebruiker = resultaat.user as unknown as {
      id: number;
      rol?: string;
      status?: string;
      naam?: string;
    };

    if (gebruiker.rol !== "eigenaar" || gebruiker.status !== "goedgekeurd") {
      // Geen hint dat dit account bestaat maar niet welkom is.
      logActiviteit(payload, {
        email,
        actie: "inloggen-mislukt",
        onderdeel: "Eigenaarspagina",
        details: "Geen eigenaar",
        ipAdres: ip,
        verborgen: true,
      });
      return mislukt;
    }

    token = resultaat.token;
  } catch {
    // Mislukte pogingen op deze pagina blijven privé: alleen de
    // eigenaar ziet ze in het logboek.
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");
    logActiviteit(await getPayload({ config }).catch(() => undefined), {
      email,
      actie: "inloggen-mislukt",
      onderdeel: "Eigenaarspagina",
      ipAdres: ip,
      verborgen: true,
    });
    return mislukt;
  }

  if (!token) return mislukt;

  // Dezelfde sessiecookie als het beheerpaneel gebruikt.
  const jar = await cookies();
  jar.set("payload-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  redirect("/admin");
}
