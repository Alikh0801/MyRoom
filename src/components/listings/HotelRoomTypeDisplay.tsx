import type { Amenity, AmenityCategory, ListingRoomType } from "@/types/database";

interface HotelRoomTypeDisplayProps {
  roomType: ListingRoomType;
}

export function HotelRoomTypeDisplay({ roomType }: HotelRoomTypeDisplayProps) {
  const amenities = (roomType.listing_room_type_amenities ?? [])
    .map((row) => {
      const amenity = Array.isArray(row.amenity) ? row.amenity[0] : row.amenity;
      return amenity;
    })
    .filter(Boolean) as (Amenity & { category?: AmenityCategory | null })[];

  if (amenities.length === 0) return null;

  return (
    <div className="listing-detail__amenities">
      <h2 className="listing-detail__amenities-title">Otaq xüsusiyyətləri</h2>
      <div className="amenities">
        {amenities.map((amenity) => (
          <span key={amenity.id} className="amenity-tag">
            {amenity.name_az}
          </span>
        ))}
      </div>
    </div>
  );
}
