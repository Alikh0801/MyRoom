/** Azərbaycan mərkəzi (Bakı) */
export const AZ_MAP_CENTER = { lat: 40.4093, lng: 49.8671 } as const;

export const AZ_MAP_DEFAULT_ZOOM = 7;
export const AZ_MAP_PICKER_ZOOM = 12;
export const AZ_MAP_DETAIL_ZOOM = 14;

/** Təxmini Azərbaycan sərhədləri */
const AZ_BOUNDS = {
  minLat: 38.4,
  maxLat: 41.95,
  minLng: 44.75,
  maxLng: 50.65,
};

export function isValidCoordinates(lat: number, lng: number): boolean {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return (
    lat >= AZ_BOUNDS.minLat &&
    lat <= AZ_BOUNDS.maxLat &&
    lng >= AZ_BOUNDS.minLng &&
    lng <= AZ_BOUNDS.maxLng
  );
}

export function buildDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
