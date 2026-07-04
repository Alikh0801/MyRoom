import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export const SITE_NAME = "MyRoom";

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return (configuredUrl || "https://my-room-pi.vercel.app").replace(/\/$/, "");
}

export function getLocalizedPath(path: string, locale: Locale) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalizedPath;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function getAbsoluteUrl(path: string, locale: Locale) {
  return `${getSiteUrl()}${getLocalizedPath(path, locale)}`;
}

export function buildCanonicalAlternates(path: string, locale: Locale) {
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, getAbsoluteUrl(path, item)])
  );

  return {
    canonical: getAbsoluteUrl(path, locale),
    languages: {
      ...languages,
      "x-default": getAbsoluteUrl(path, routing.defaultLocale),
    },
  };
}
