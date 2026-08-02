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
import { seedIfEmpty } from "./payload/seed";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const hasBucket = Boolean(
  process.env.BUCKET_NAME && process.env.BUCKET_ACCESS_KEY_ID,
);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — ARTCHY beheer",
    },
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
  plugins: hasBucket
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.BUCKET_NAME as string,
          config: {
            endpoint: process.env.BUCKET_ENDPOINT,
            region: process.env.BUCKET_REGION ?? "auto",
            credentials: {
              accessKeyId: process.env.BUCKET_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY as string,
            },
            forcePathStyle: true,
          },
        }),
      ]
    : [],
  // Bij de eerste start het CMS vullen met de huidige teksten.
  onInit: async (payload) => {
    await seedIfEmpty(payload);
  },
  secret: process.env.PAYLOAD_SECRET ?? "artchy-dev-secret-vervang-mij",
  hooks: {
    // Mislukte inlogpogingen belanden ook in de inloggeschiedenis.
    afterError: [
      async ({ error, req }) => {
        const isLoginRoute = req?.url?.includes("/api/users/login");
        if (!isLoginRoute || !req?.payload) return;
        try {
          const body = (req as { data?: { email?: string } }).data;
          await req.payload.create({
            collection: "inloggeschiedenis",
            data: {
              email: body?.email ?? "onbekend",
              tijdstip: new Date().toISOString(),
              ipAdres:
                req.headers?.get("x-forwarded-for")?.split(",")[0].trim() ??
                "onbekend",
              resultaat: "mislukt",
            },
            overrideAccess: true,
          });
        } catch {
          // Logging mag de foutafhandeling nooit blokkeren.
        }
        void error;
      },
    ],
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp: undefined,
});
