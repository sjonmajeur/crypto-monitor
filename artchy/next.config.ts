import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway draait de app standalone (kleinere image, geen node_modules nodig).
  output: "standalone",
  // De parent-repo heeft een eigen lockfile; pin de root op deze map.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      // Media uit de Railway-bucket (S3-compatible endpoint).
      ...(process.env.BUCKET_PUBLIC_HOSTNAME
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.BUCKET_PUBLIC_HOSTNAME,
            },
          ]
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
