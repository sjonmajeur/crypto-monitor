import { NextResponse } from "next/server";

import {
  bucketClientConfig,
  bucketCompleet,
  bucketNaam,
  bucketOverzicht,
  s3FoutDetails,
} from "@/payload/opslag";

export const dynamic = "force-dynamic";

/**
 * Tijdelijk diagnose-endpoint voor de media-opslag. Schrijft één klein
 * testbestand naar de bucket, leest het terug en ruimt het weer op —
 * los van het CMS, maar met exact dezelfde clientconfiguratie.
 *
 * Alleen toegankelijk voor een ingelogde, goedgekeurde eigenaar; voor
 * iedereen anders bestaat deze pagina niet (404). Verwijderen zodra de
 * opslag bewezen werkt kan gewoon: niets anders hangt ervan af.
 */
export async function GET(verzoek: Request): Promise<NextResponse> {
  const nietGevonden = NextResponse.json({ melding: "Niet gevonden" }, { status: 404 });

  if (!process.env.DATABASE_URI) return nietGevonden;

  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ]);
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: verzoek.headers });
    const eigenaar = user as { rol?: string; status?: string } | null;
    if (eigenaar?.rol !== "eigenaar" || eigenaar?.status !== "goedgekeurd") {
      return nietGevonden;
    }
  } catch {
    return nietGevonden;
  }

  const overzicht = bucketOverzicht();
  if (!bucketCompleet()) {
    return NextResponse.json({
      geslaagd: false,
      stap: "instellingen",
      melding:
        "Niet alle bucket-variabelen zijn gezet (BUCKET_ENDPOINT, " +
        "BUCKET_ACCESS_KEY_ID, BUCKET_SECRET_ACCESS_KEY).",
      instellingen: overzicht,
    });
  }

  const { S3 } = await import("@aws-sdk/client-s3");
  const s3 = new S3(bucketClientConfig());
  const sleutel = "opslag-test/artchy-testbestand.txt";
  const inhoud = `ARTCHY opslagtest — ${new Date().toISOString()}`;
  const stappen: Record<string, string> = {};

  try {
    await s3.putObject({
      Bucket: bucketNaam,
      Key: sleutel,
      Body: inhoud,
      ContentType: "text/plain",
    });
    stappen.schrijven = "gelukt";

    const terug = await s3.getObject({ Bucket: bucketNaam, Key: sleutel });
    const teruggelezen = await terug.Body?.transformToString();
    stappen.teruglezen = teruggelezen === inhoud ? "gelukt" : "inhoud wijkt af";

    await s3.deleteObject({ Bucket: bucketNaam, Key: sleutel });
    stappen.opruimen = "gelukt";

    return NextResponse.json({
      geslaagd: true,
      melding:
        "De opslag werkt: testbestand geschreven, teruggelezen en weer verwijderd. " +
        "Uploaden in het CMS hoort nu ook te werken.",
      stappen,
      instellingen: overzicht,
    });
  } catch (fout) {
    const details = s3FoutDetails(fout);
    return NextResponse.json({
      geslaagd: false,
      stap: stappen.schrijven ? (stappen.teruglezen ? "opruimen" : "teruglezen") : "schrijven",
      melding:
        "De opslag weigert. Stuur dit hele antwoord door; hier staat de " +
        "echte foutmelding in (zonder sleutels).",
      s3: details,
      stappen,
      instellingen: overzicht,
    });
  }
}
