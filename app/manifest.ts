import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CERES",
    short_name: "CERES",
    description: "CERES - Your Digital Apothecary",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#F7F6F2",
    theme_color: "#1F8A5B",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
