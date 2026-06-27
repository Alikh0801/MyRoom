import type { PriceUnit } from "@/types/database";

const UNIT_LABELS: Record<string, Record<PriceUnit, string>> = {
  az: { day: "gün", week: "həftə", month: "ay" },
  ru: { day: "день", week: "неделя", month: "месяц" },
};

export function formatPriceSuffix(
  unit: PriceUnit = "day",
  locale = "az"
): string {
  const labels = UNIT_LABELS[locale] ?? UNIT_LABELS.az;
  return `/${labels[unit]}`;
}

export function formatPrice(
  amount: number,
  currency: string,
  unit: PriceUnit = "day",
  locale = "az"
): string {
  return `${amount} ${currency}${formatPriceSuffix(unit, locale)}`;
}

export function getPriceUnitLabel(unit: PriceUnit = "day", locale = "az"): string {
  const labels = UNIT_LABELS[locale] ?? UNIT_LABELS.az;
  return labels[unit];
}

export function getPriceUnitOptions(locale = "az") {
  const labels = UNIT_LABELS[locale] ?? UNIT_LABELS.az;
  return (Object.keys(labels) as PriceUnit[]).map((value) => ({
    value,
    label:
      locale === "ru"
        ? value === "day"
          ? "День"
          : value === "week"
            ? "Неделя"
            : "Месяц"
        : value === "day"
          ? "Gün"
          : value === "week"
            ? "Həftə"
            : "Ay",
  }));
}

export const PRICE_UNIT_OPTIONS = getPriceUnitOptions("az");
