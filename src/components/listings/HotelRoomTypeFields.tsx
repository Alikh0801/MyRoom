"use client";

import { useTranslations } from "next-intl";
import { AmenitiesPicker } from "@/components/listings/AmenitiesPicker";
import type { AmenityGroup } from "@/types/database";

interface HotelRoomTypeFieldsProps {
  roomAmenityGroups: AmenityGroup[];
  defaultName?: string;
  defaultFloor?: number | null;
  roomTypeId?: string;
  selectedRoomAmenityIds?: string[];
  onRoomAmenitiesChange?: (ids: string[]) => void;
}

export function HotelRoomTypeFields({
  roomAmenityGroups,
  defaultName = "",
  defaultFloor = null,
  roomTypeId,
  selectedRoomAmenityIds,
  onRoomAmenitiesChange,
}: HotelRoomTypeFieldsProps) {
  const t = useTranslations("listingForm");
  const tListing = useTranslations("listing");
  const controlled =
    selectedRoomAmenityIds !== undefined && onRoomAmenitiesChange !== undefined;

  return (
    <div className="hotel-room-type">
      {roomTypeId && (
        <input type="hidden" name="roomTypeId" value={roomTypeId} />
      )}

      <p className="listing-form__hint">{t("hotelRoom.hint")}</p>

      <div className="listing-form__row">
        <label className="listing-form__field">
          <span className="listing-form__label">{t("hotelRoom.typeName")}</span>
          <input
            type="text"
            name="roomTypeName"
            required
            defaultValue={defaultName}
            placeholder={t("placeholders.roomTypeName")}
          />
        </label>

        <label className="listing-form__field">
          <span className="listing-form__label">{t("hotelRoom.floor")}</span>
          <input
            type="number"
            name="roomTypeFloor"
            min={0}
            defaultValue={defaultFloor ?? ""}
            placeholder={t("placeholders.roomTypeFloor")}
          />
        </label>
      </div>

      {roomAmenityGroups.some((g) => g.amenities.length > 0) && (
        <div className="hotel-room-type__amenities">
          <p className="hotel-room-type__amenities-label">
            {tListing("roomFeatures")}
          </p>
          {controlled ? (
            <AmenitiesPicker
              groups={roomAmenityGroups}
              name="roomAmenities"
              selectedIds={selectedRoomAmenityIds}
              onChange={onRoomAmenitiesChange}
            />
          ) : (
            <AmenitiesPicker groups={roomAmenityGroups} name="roomAmenities" />
          )}
        </div>
      )}
    </div>
  );
}
