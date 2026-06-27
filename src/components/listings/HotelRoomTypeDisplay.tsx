import { getTranslations } from "next-intl/server";
import type { Amenity, AmenityCategory, ListingRoomType } from "@/types/database";
import type { Locale } from "@/i18n/routing";
import { getLocalizedName } from "@/lib/i18n/localized-name";

interface HotelRoomTypeDisplayProps {
  roomType: ListingRoomType;
  locale: Locale;
}

export async function HotelRoomTypeDisplay({
  roomType,
  locale,
}: HotelRoomTypeDisplayProps) {
  const t = await getTranslations("listing");

  const amenities = (roomType.listing_room_type_amenities ?? [])
    .map((row) => {
      const amenity = Array.isArray(row.amenity) ? row.amenity[0] : row.amenity;
      return amenity;
    })
    .filter(Boolean) as (Amenity & { category?: AmenityCategory | null })[];

  if (amenities.length === 0) return null;

  return (
    <div className="listing-detail__amenities">
      <h2 className="amenities-feature-title">{t("roomFeatures")}</h2>
      <div className="amenities">
        {amenities.map((amenity) => (
          <span key={amenity.id} className="amenity-tag">
            {getLocalizedName(amenity, locale)}
          </span>
        ))}
      </div>
    </div>
  );
}
