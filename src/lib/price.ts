export type PriceUnit = "day" | "week" | "month";

const UNIT_LABELS: Record<PriceUnit, string> = {
  day: "gün",
  week: "həftə",
  month: "ay",
};

export function formatPriceSuffix(unit: PriceUnit = "day"): string {
  return `/${UNIT_LABELS[unit]}`;
}

export function formatPrice(
  amount: number,
  currency: string,
  unit: PriceUnit = "day"
): string {
  return `${amount} ${currency}${formatPriceSuffix(unit)}`;
}

export function getPriceUnitLabel(unit: PriceUnit = "day"): string {
  return UNIT_LABELS[unit];
}

export const PRICE_UNIT_OPTIONS: { value: PriceUnit; label: string }[] = [
  { value: "day", label: "Gün" },
  { value: "week", label: "Həftə" },
  { value: "month", label: "Ay" },
];
