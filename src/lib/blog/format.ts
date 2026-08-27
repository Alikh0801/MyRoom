import type { Locale } from "@/i18n/routing";

const MONTHS: Record<Locale, string[]> = {
  az: [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr",
  ],
  ru: [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ],
  tr: [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ],
};

export function formatBlogDate(iso: string, locale: Locale | string): string {
  const date = new Date(iso);
  const months = MONTHS[locale as Locale] ?? MONTHS.az;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
