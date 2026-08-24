export function formatListingNumber(listingNumber: number): string {
  return `MR-${listingNumber}`;
}

const LISTING_NUMBER_PATTERN = /^(?:mr[-\s]?)?(\d+)$/i;

export function parseListingNumber(value: string): number | null {
  const match = value.trim().match(LISTING_NUMBER_PATTERN);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}
