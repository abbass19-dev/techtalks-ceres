import type { MetadataRoute } from "next";
import { privateRoutes, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const disallow = privateRoutes.flatMap((route) => [route, `${route}/`]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
