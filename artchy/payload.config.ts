import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Artists } from "./payload/collections/Artists";
import { LoginLog } from "./payload/collections/LoginLog";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { Homepage } from "./payload/globals/Homepage";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { ipUitHeaders, logLoginAttempt } from "./payload/loginLog";
import { nederlandsePayloadTaal, nederlandseVertalingen } from "./payload/i18n";
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
const bucketNaam = process.env.BUCKET_NAME ?? "media";

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
        endpoint: process.env.BUCKET_ENDPOINT,
        region: process.env.BUCKET_REGION ?? "auto",
        credentials: {
          accessKeyId: process.env.BUCKET_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY ?? "",
        },
        forcePathStyle: true,
      },
    }),
  ],
  // Bij de eerste start het CMS vullen met de huidige teksten.
  onInit: async (payload) => {
    await seedIfEmpty(payload);
  },
  secret: process.env.PAYLOAD_SECRET ?? "artchy-dev-secret-vervang-mij",
  hooks: {
    // Mislukte inlogpogingen belanden ook in de inloggeschiedenis.
    afterError: [
      async ({ req }) => {
        if (!req?.url?.includes("/api/users/login") || !req.payload) return;
        const body = (req as { data?: { email?: string } }).data;
        logLoginAttempt(req.payload, {
          email: body?.email ?? "onbekend",
          ipAdres: ipUitHeaders(req.headers),
          resultaat: "mislukt",
        });
      },
    ],
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp: undefined,
});
