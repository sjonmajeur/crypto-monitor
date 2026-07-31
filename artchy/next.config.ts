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
};

export default nextConfig;
