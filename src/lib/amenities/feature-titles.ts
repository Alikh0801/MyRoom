const PROMINENT_AMENITY_SLUGS = new Set(["room", "property"]);

export function isProminentAmenitySlug(slug: string): boolean {
  return PROMINENT_AMENITY_SLUGS.has(slug);
}

export function isProminentAmenityTitle(title: string): boolean {
  return title === "Otaq xüsusiyyətləri" || title === "Müəssisə xüsusiyyətləri";
}

export function amenityTitleClassName(
  slugOrTitle: string,
  fallbackClassName: string,
  useSlug = false
): string {
  const isProminent = useSlug
    ? isProminentAmenitySlug(slugOrTitle)
    : isProminentAmenityTitle(slugOrTitle);

  return isProminent ? "amenities-feature-title" : fallbackClassName;
}
