"use client";

import { useLocale } from "next-intl";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import type { Locale } from "@/i18n/routing";
import type { AmenityGroup } from "@/types/database";

interface AmenitiesPickerProps {
  groups: AmenityGroup[];
  /** Form submit üçün — controlled rejimdə istifadə olunmur */
  name?: string;
  /** Controlled rejim */
  selectedIds?: string[];
  onChange?: (ids: string[]) => void;
}

export function AmenitiesPicker({
  groups,
  name = "amenities",
  selectedIds,
  onChange,
}: AmenitiesPickerProps) {
  const locale = useLocale() as Locale;
  const controlled = selectedIds !== undefined && onChange !== undefined;

  function toggleAmenity(amenityId: string) {
    if (!controlled) return;
    const next = selectedIds.includes(amenityId)
      ? selectedIds.filter((id) => id !== amenityId)
      : [...selectedIds, amenityId];
    onChange(next);
  }

  return (
    <div className="amenities-picker">
      {controlled &&
        selectedIds.map((id) => (
          <input key={id} type="hidden" name={name} value={id} />
        ))}
      {groups.map((group) => (
        <div key={group.category.id} className="amenities-picker__group">
          <h3 className="amenities-picker__heading">
            {getLocalizedName(group.category, locale)}
          </h3>
          <div className="amenities-picker__grid">
            {group.amenities.map((amenity) => (
              <label key={amenity.id} className="listing-form__amenity">
                <input
                  type="checkbox"
                  name={controlled ? undefined : name}
                  value={controlled ? undefined : amenity.id}
                  checked={controlled ? selectedIds.includes(amenity.id) : undefined}
                  onChange={
                    controlled ? () => toggleAmenity(amenity.id) : undefined
                  }
                />
                {getLocalizedName(amenity, locale)}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
