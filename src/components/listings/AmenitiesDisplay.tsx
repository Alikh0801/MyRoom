import type { AmenityGroup } from "@/types/database";
import { amenityTitleClassName } from "@/lib/amenities/feature-titles";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";

interface AmenitiesDisplayProps {
  groups: AmenityGroup[];
  compact?: boolean;
  title?: string;
  titleSlug?: string;
  locale: Locale;
}

export function AmenitiesDisplay({
  groups,
  compact = false,
  title = "Daxildir",
  titleSlug,
  locale,
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
        <h2
          className={amenityTitleClassName(
            titleSlug ?? title,
            "listing-detail__amenities-title",
            Boolean(titleSlug)
          )}
        >
          {title}
        </h2>
      )}
      {nonEmpty.map((group) => (
        <div key={group.category.id} className="amenities-group">
          {(compact || getLocalizedName(group.category, locale) !== title) && (
            <h3
              className={amenityTitleClassName(
                group.category.slug,
                "amenities-group__title",
                true
              )}
            >
              {getLocalizedName(group.category, locale)}
            </h3>
          )}
          <div className="amenities">
            {group.amenities.map((a) => (
              <span key={a.id} className="amenity-tag">
                {getLocalizedName(a, locale)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
