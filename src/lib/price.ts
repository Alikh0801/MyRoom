import type { PriceUnit } from "@/types/database";

const UNIT_LABELS: Record<string, Record<PriceUnit, string>> = {
  az: { day: "gün", week: "həftə", month: "ay" },
  ru: { day: "день", week: "неделя", month: "месяц" },
  tr: { day: "gün", week: "hafta", month: "ay" },
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

const UNIT_LABELS_CAPITALIZED: Record<string, Record<PriceUnit, string>> = {
  az: { day: "Gün", week: "Həftə", month: "Ay" },
  ru: { day: "День", week: "Неделя", month: "Месяц" },
  tr: { day: "Gün", week: "Hafta", month: "Ay" },
};

export function getPriceUnitOptions(locale = "az") {
  const labels = UNIT_LABELS[locale] ?? UNIT_LABELS.az;
  const capitalizedLabels = UNIT_LABELS_CAPITALIZED[locale] ?? UNIT_LABELS_CAPITALIZED.az;
  return (Object.keys(labels) as PriceUnit[]).map((value) => ({
    value,
    label: capitalizedLabels[value],
  }));
}

export const PRICE_UNIT_OPTIONS = getPriceUnitOptions("az");
