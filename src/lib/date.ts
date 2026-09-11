import { toBakuWallClock } from "@/lib/datetime/baku";

/**
 * Elan kartındakı tarix (GG.AA.İİİİ).
 *
 * DİQQƏT: burada `getDate()/getMonth()/getFullYear()` İŞLƏDİLMİR — onlar
 * mühitin yerli saat qurşağına baxır. Server UTC-də, brauzer isə Bakı
 * vaxtında işlədiyi üçün axşam saatlarında yaradılmış elanlarda iki tərəf
 * fərqli gün göstərirdi və React hidrasiya xətası (#418) atırdı.
 * Bakı divar saatı hər iki tərəfdə eyni nəticə verir.
 */
export function formatListingCardDate(iso: string): string {
  const { day, month, year } = toBakuWallClock(new Date(iso));
  return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
}
