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
import { Paginas } from "./payload/globals/Paginas";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { ipUitHeaders, logActiviteit } from "./payload/activiteitenlog";
import { nederlandsePayloadTaal, nederlandseVertalingen } from "./payload/i18n";
import {
  bucketClientConfig,
  bucketCompleet,
  bucketEndpoint,
  bucketNaam,
  bucketOverzicht,
  bucketRegio,
  s3FoutDetails,
} from "./payload/opslag";
import { migraties } from "./payload/migraties";
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
      // Overal ARTCHY in beeld, nergens Payload.
      titleSuffix: " — ARTCHY beheer",
      description: "Beheerpaneel van ARTCHY.",
      icons: [
        { rel: "icon", type: "image/png", url: "/logo-taji.png" },
      ],
    },
    // Geen gravatar: dat haalt een plaatje van een externe server en
    // levert een kapot beeld op zodra die niet bereikbaar is.
    avatar: "default",
    components: {
      graphics: {
        Logo: "@/payload/components/Merk#Logo",
        Icon: "@/payload/components/Merk#Icoon",
      },
      afterLogin: ["@/payload/components/AanmeldLink#AanmeldLink"],
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
  globals: [Homepage, Paginas, SiteSettings],
  editor: lexicalEditor(),
  // Zonder DATABASE_URI (bijv. tijdens een lokale build) start Payload
  // niet, maar de site valt terug op de ingebouwde standaardteksten.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },
    // Lokaal (dev) wordt het schema live gesynchroniseerd (push); in
    // productie draaien bij het opstarten de migraties hieronder. Zo
    // komt elke schemawijziging vanzelf op een bestaande database
    // terecht, zonder dataverlies.
    push: true,
    // Migraties draaien bij het OPSTARTEN, nooit tijdens `next build`:
    // de build draait met meerdere parallelle workers die anders
    // tegelijk zouden migreren en elkaar blokkeren.
    prodMigrations:
      process.env.NEXT_PHASE === "phase-production-build" ? undefined : migraties,
    migrationDir: "./payload/migraties",
  }),
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: bucketNaam,
      // Eén gedeelde clientconfig (payload/opslag.ts): genormaliseerd
      // endpoint, forcePathStyle en de checksum-instellingen die
      // S3-compatibele opslag zoals Railway nodig heeft. Het
      // diagnose-endpoint /api/opslag-test gebruikt exact dezelfde.
      config: bucketClientConfig(),
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
    afterError: [
      // Mislukte uploads: de echte S3-fout naar de serverlogs (zonder
      // sleutels) en een duidelijke Nederlandse melding naar het paneel
      // in plaats van "Something went wrong".
      async ({ error, req }) => {
        if (!req?.url?.includes("/api/media")) return;
        // Gewone fouten (bijv. ontbrekende alt-tekst, 4xx) houden hun
        // eigen nette melding; alleen echte serverfouten zijn opslag.
        const status = (error as { status?: number })?.status;
        if (typeof status === "number" && status < 500) return;
        const details = s3FoutDetails(error);
        req.payload?.logger?.error(
          { opslag: bucketOverzicht(), s3: details },
          "Upload naar de bucket mislukt",
        );
        return {
          status: 502,
          response: {
            errors: [
              {
                message:
                  "De foto kon niet naar de opslag worden geschreven " +
                  `(${details.fout}${details.httpStatus ? `, HTTP ${details.httpStatus}` : ""}). ` +
                  "De beheerder vindt de precieze oorzaak in de serverlogs " +
                  'onder "Upload naar de bucket mislukt".',
              },
            ],
          },
        };
      },
      // Mislukte inlogpogingen belanden ook in de inloggeschiedenis.
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
