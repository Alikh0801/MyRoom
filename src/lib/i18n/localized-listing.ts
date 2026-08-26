import { routing, type Locale } from "@/i18n/routing";

export interface LocalizedListingTitle {
  title: string;
  title_ru?: string | null;
}

export interface LocalizedListingText extends LocalizedListingTitle {
  description: string;
  description_ru?: string | null;
}

export function getLocalizedListingTitle(
  listing: LocalizedListingTitle,
  locale: Locale | string
): string {
  if (locale === "ru") {
    const ru = listing.title_ru?.trim();
    if (ru) return ru;
  }

  return listing.title;
}

export function getLocalizedListingDescription(
  listing: LocalizedListingText,
  locale: Locale | string
): string {
  if (locale === "ru") {
    const ru = listing.description_ru?.trim();
    if (ru) return ru;
  }

  return listing.description;
}

/**
 * Elanın title/description-u həmin dildə unikaldır, yoxsa AZ mətninə
 * fallback edir? Tərcümə yoxdursa (məs. TR-də title_tr sahəsi heç yoxdur)
 * səhifə AZ ilə demək olar ki eynidir — bu, Google-un onu dublikat sayıb
 * indeksləməkdən imtina etməsinə səbəb olur (noindex/sitemap qərarları
 * üçün istifadə olunur).
 */
export function hasUniqueLocaleContent(
  listing: Pick<LocalizedListingTitle, "title_ru"> &
    Pick<LocalizedListingText, "description_ru">,
  locale: Locale | string
): boolean {
  if (locale === routing.defaultLocale) return true;
  if (locale === "ru") {
    return Boolean(listing.title_ru?.trim() || listing.description_ru?.trim());
  }
  return false;
}
