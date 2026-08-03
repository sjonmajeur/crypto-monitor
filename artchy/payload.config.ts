import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Artists } from "./payload/collections/Artists";
import { LoginLog } from "./payload/collections/LoginLog";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { Homepage } from "./payload/globals/Homepage";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { ipUitHeaders, logActiviteit } from "./payload/activiteitenlog";
import { nederlandsePayloadTaal, nederlandseVertalingen } from "./payload/i18n";
import {
  bucketCompleet,
  bucketEndpoint,
  bucketNaam,
  bucketRegio,
} from "./payload/opslag";
import { seedIfEmpty } from "./payload/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * De opslag-plugin wordt ALTIJD geladen, ook als de bucket-variabelen
 * (nog) ontbreken. Zo bevat de gegenereerde importMap altijd de
 * client-component van de plugin; laadde de plugin alleen bij gezette
 * variabelen, dan miste die component en bleef /admin zwart met
 * "PayloadComponent not found in importMap".
 *
 * Zonder bucket-variabelen werkt de rest van het CMS gewoon; alleen het
 * uploaden van nieuwe afbeeldingen faalt dan met een duidelijke fout.
 */

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — ARTCHY beheer",
    },
  },
  // Adminpaneel volledig in het Nederlands, zonder dat een beheerder
  // iets hoeft in te stellen.
  i18n: {
    fallbackLanguage: "nl",
    supportedLanguages: { nl: nederlandsePayloadTaal },
    translations: nederlandseVertalingen,
  },
  collections: [Users, Media, Artists, LoginLog],
  globals: [Homepage, SiteSettings],
  editor: lexicalEditor(),
  // Zonder DATABASE_URI (bijv. tijdens een lokale build) start Payload
  // niet, maar de site valt terug op de ingebouwde standaardteksten.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },
    // Schema wordt automatisch bijgewerkt; geen handmatige migraties nodig.
    push: true,
  }),
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: bucketNaam,
      config: {
        // Genormaliseerd in payload/opslag.ts: altijd mét https://,
        // zonder slash op het eind en zonder de bucketnaam erin.
        endpoint: bucketEndpoint(),
        region: bucketRegio(),
        credentials: {
          accessKeyId: process.env.BUCKET_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY ?? "",
        },
        // Railway Object Storage is MinIO-achtig: de bucket hoort in het
        // pad (endpoint/bucket/bestand), niet in de hostnaam.
        forcePathStyle: true,
      },
    }),
  ],
  // Bij de eerste start het CMS vullen met de huidige teksten.
  onInit: async (payload) => {
    if (!bucketCompleet()) {
      payload.logger.warn(
        "Bucket niet volledig ingesteld (BUCKET_ENDPOINT, BUCKET_ACCESS_KEY_ID, " +
          "BUCKET_SECRET_ACCESS_KEY). Uploaden van afbeeldingen zal mislukken.",
      );
    } else {
      payload.logger.info(
        `Media-opslag: ${bucketEndpoint()}/${bucketNaam} (regio ${bucketRegio()})`,
      );
    }
    await seedIfEmpty(payload);
  },
  /*
   * E-mail via Resend. Zonder RESEND_API_KEY valt Payload terug op de
   * ingebouwde adapter die mails alleen in de log zet: het paneel blijft
   * dan gewoon werken, er gaat alleen niets de deur uit.
   */
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress:
          process.env.RESEND_FROM_ADDRESS ?? "beheer@artchy.nl",
        defaultFromName: process.env.RESEND_FROM_NAME ?? "ARTCHY",
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET ?? "artchy-dev-secret-vervang-mij",
  hooks: {
    // Mislukte inlogpogingen belanden ook in de inloggeschiedenis.
    afterError: [
      async ({ req }) => {
        if (!req?.url?.includes("/api/users/login") || !req.payload) return;
        const body = (req as { data?: { email?: string } }).data;
        logActiviteit(req.payload, {
          email: body?.email ?? "onbekend",
          actie: "inloggen-mislukt",
          onderdeel: "Beheerpaneel",
          ipAdres: ipUitHeaders(req.headers),
        });
      },
    ],
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp: undefined,
});
