import type { Locale } from "@/i18n/routing";

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
