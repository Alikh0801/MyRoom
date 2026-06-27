import { routing, type Locale } from "@/i18n/routing";

export function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;

    const prefix = `/${locale}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }

  return pathname;
}

export function getLocaleFromPathname(pathname: string): Locale {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;

    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

export function withLocalePrefix(path: string, locale: Locale): string {
  if (locale === routing.defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
