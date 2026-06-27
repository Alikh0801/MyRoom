import type { AmenityGroup } from "@/types/database";
import { amenityTitleClassName } from "@/lib/amenities/feature-titles";

interface AmenitiesDisplayProps {
  groups: AmenityGroup[];
  /** Otaq tipi daxilində göstərildikdə əsas başlığı gizlət */
  compact?: boolean;
  title?: string;
}

export function AmenitiesDisplay({
  groups,
  compact = false,
  title = "Daxildir",
}: AmenitiesDisplayProps) {
  const nonEmpty = groups.filter((g) => g.amenities.length > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <div
      className={
        compact
          ? "amenities-display amenities-display--compact"
          : "listing-detail__amenities"
      }
    >
      {!compact && (
        <h2 className={amenityTitleClassName(title, "listing-detail__amenities-title")}>
          {title}
        </h2>
      )}
      {nonEmpty.map((group) => (
        <div key={group.category.id} className="amenities-group">
          {(compact || group.category.name_az !== title) && (
            <h3
              className={amenityTitleClassName(
                group.category.name_az,
                "amenities-group__title"
              )}
            >
              {group.category.name_az}
            </h3>
          )}
          <div className="amenities">
            {group.amenities.map((a) => (
              <span key={a.id} className="amenity-tag">
                {a.name_az}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
