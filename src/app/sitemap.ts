import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBlogSlugs } from "@/lib/blog/content";
import { hasUniqueLocaleContent } from "@/lib/i18n/localized-listing";
import { getSitemapListings } from "@/lib/queries/listings";
import { getAbsoluteUrl } from "@/lib/seo";
import { CATEGORY_LANDINGS, landingHref } from "@/lib/seo/category-landings";

const STATIC_PATHS = ["/", "/search", "/blog", "/about", "/terms", "/privacy"];

function buildLocalizedUrls(path: string) {
  return routing.locales.map((locale) => ({
    url: getAbsoluteUrl(path, locale),
    locale,
  }));
}

function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, getAbsoluteUrl(path, locale)])
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getSitemapListings();

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    for (const { url } of buildLocalizedUrls(path)) {
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1 : 0.7,
        alternates: buildAlternates(path),
      });
    }
  }

  // Kateqoriyalar üçün /search?category=... yox, açılış səhifələri təqdim
  // olunur — axtarış ünvanları onlara canonical göstərir.
  for (const landing of CATEGORY_LANDINGS) {
    const path = landingHref(landing);
    for (const locale of routing.locales) {
      entries.push({
        url: getAbsoluteUrl(path, locale),
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
        alternates: buildAlternates(path),
      });
    }
  }

  // Blog bələdçiləri hər dildə ayrıca tərcümə olunub — hamısı indekslənə bilər.
  for (const slug of await getBlogSlugs()) {
    const path = `/blog/${slug}`;
    for (const locale of routing.locales) {
      entries.push({
        url: getAbsoluteUrl(path, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: buildAlternates(path),
      });
    }
  }

  for (const listing of listings) {
    const path = `/listings/${listing.id}`;
    const lastModified = new Date(listing.updated_at || listing.created_at);
    // Tərcüməsi olmayan dil versiyaları AZ mətnini təkrarlayır (dublikat
    // məzmun) və noindex-dir — sitemap-da yalnız unikal versiyalar olsun.
    for (const locale of routing.locales) {
      if (!hasUniqueLocaleContent(listing, locale)) continue;
      entries.push({
        url: getAbsoluteUrl(path, locale),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: buildAlternates(path),
      });
    }
  }

  return entries;
}

export const dynamic = "force-dynamic";
