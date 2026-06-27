const PROMINENT_AMENITY_TITLES = new Set([
  "Otaq xüsusiyyətləri",
  "Müəssisə xüsusiyyətləri",
]);

export function isProminentAmenityTitle(title: string): boolean {
  return PROMINENT_AMENITY_TITLES.has(title);
}

export function amenityTitleClassName(
  title: string,
  fallbackClassName: string
): string {
  return isProminentAmenityTitle(title)
    ? "amenities-feature-title"
    : fallbackClassName;
}
