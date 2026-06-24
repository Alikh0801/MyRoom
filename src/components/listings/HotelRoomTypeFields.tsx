import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import type { AmenityGroup } from "@/types/database";

interface HotelRoomTypeFieldsProps {
  roomAmenityGroups: AmenityGroup[];
}

export function HotelRoomTypeFields({
  roomAmenityGroups,
}: HotelRoomTypeFieldsProps) {
  return (
    <div className="hotel-room-type">
      <p className="listing-form__hint">
        Bu elan bir otaq tipini təmsil edir (məs: Standart). Fərqli otaq tipi
        üçün ayrıca yeni elan yaradın.
      </p>

      <div className="listing-form__row">
        <label className="listing-form__field">
          <span className="listing-form__label">Otaq tipi adı *</span>
          <input
            type="text"
            name="roomTypeName"
            required
            placeholder="Məs: Standart, Elit Suit, Deluxe Suit"
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">Mərtəbə</span>
          <input
            type="number"
            name="roomTypeFloor"
            min={0}
            placeholder="Məs: 3"
          />
        </label>
      </div>

      {roomAmenityGroups.some((g) => g.amenities.length > 0) && (
        <div className="hotel-room-type__amenities">
          <p className="hotel-room-type__amenities-label">Otaq xüsusiyyətləri</p>
          <AmenitiesPicker groups={roomAmenityGroups} name="roomAmenities" />
        </div>
      )}
    </div>
  );
}
