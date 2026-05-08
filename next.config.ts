import type { NextConfig } from "next";

// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24, // cache images for 24h
  },
  // increase image optimization timeout
  experimental: {
    proxyTimeout: 30_000,
  },
};

export default nextConfig;
