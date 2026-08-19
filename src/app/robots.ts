import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo";

const PROTECTED_PATHS = ["/admin", "/dashboard", "/auth"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const disallow = PROTECTED_PATHS.flatMap((path) => [
    path,
    ...routing.locales.map((locale) => `/${locale}${path}`),
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...disallow, "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
