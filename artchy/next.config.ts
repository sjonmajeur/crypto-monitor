import path from "node:path";
import { fileURLToPath } from "node:url";

import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

import { bucketHostnaam } from "./payload/opslag";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /*
   * Bewust GEEN output: "standalone". Payload werkt zijn database-schema
   * bij via drizzle-kit, dat in een standalone bundel ontbreekt — dan
   * blijven de tabellen leeg en start het adminpaneel niet. Railway
   * (Nixpacks) houdt node_modules toch bij de app, dus standalone levert
   * hier geen winst op.
   */
  // De parent-repo heeft een eigen lockfile; pin de root op deze map.
  turbopack: {
    root: dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      /*
       * Media uit de Railway-bucket. De hostnaam wordt afgeleid uit
       * BUCKET_ENDPOINT wanneer BUCKET_PUBLIC_HOSTNAME ontbreekt of
       * afwijkt: de plugin linkt namelijk altijd naar het endpoint, dus
       * dat is per definitie de juiste host.
       */
      ...(bucketHostnaam()
        ? [{ protocol: "https" as const, hostname: bucketHostnaam() as string }]
        : []),
      { protocol: "https" as const, hostname: "**.railway.app" },
      { protocol: "https" as const, hostname: "**.storage.railway.app" },
    ],
  },
  async headers() {
    return [
      {
        // Pagina's (HTML) nooit door de browser laten cachen; de door
        // Next gehashte assets onder /_next/static vallen hier buiten
        // en blijven wél lang gecachet (veilig door de content-hashes).
        // Adminpaneel uitgesloten: Payload regelt zijn eigen caching.
        source: "/((?!_next/|api/|admin).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
