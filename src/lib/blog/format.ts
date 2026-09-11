import type { Locale } from "@/i18n/routing";
import { toBakuWallClock } from "@/lib/datetime/baku";

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

/** Tarix Bakı vaxtı ilə hesablanır — server (UTC) və brauzer eyni günü göstərsin */
export function formatBlogDate(iso: string, locale: Locale | string): string {
  const { day, month, year } = toBakuWallClock(new Date(iso));
  const months = MONTHS[locale as Locale] ?? MONTHS.az;
  return `${day} ${months[month - 1]} ${year}`;
}
