import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
  async headers() {
    return [
      {
        // Pagina's (HTML) nooit door de browser laten cachen; de door
        // Next gehashte assets onder /_next/static vallen hier buiten
        // en blijven wél lang gecachet (veilig door de content-hashes).
        source: "/((?!_next/|api/).*)",
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

export default nextConfig;
