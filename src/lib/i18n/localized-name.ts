import type { Locale } from "@/i18n/routing";

/** Kateqoriya slug → rus adı (DB-dən asılı olmayaraq) */
const CATEGORY_NAME_RU: Record<string, string> = {
  hotel: "Отель",
  hostel: "Хостел",
  "a-frame": "A-frame (Glamping)",
  villa: "Вилла",
  "rayon-evi": "Загородный дом",
};

export interface LocalizedName {
  name_az: string;
  name_ru?: string | null;
  slug?: string;
}

export function getLocalizedName(
  item: LocalizedName,
  locale: Locale | string
): string {
  if (locale === "ru") {
    if (item.slug && item.slug in CATEGORY_NAME_RU) {
      return CATEGORY_NAME_RU[item.slug];
    }

    if (item.name_ru) {
      return item.name_ru;
    }
  }

  return item.name_az;
}
