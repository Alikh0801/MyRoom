import { createClient } from "@/lib/supabase/server";
import type { ListingImage, ListingStatus, PriceUnit } from "@/types/database";

export interface EditListingRoomType {
  id: string;
  name: string;
  floor: number | null;
  amenity_ids: string[];
}

export interface EditListingData {
  id: string;
  title: string;
  description: string;
  title_ru: string | null;
  description_ru: string | null;
  category_id: string;
  price_per_night: number;
  price_unit: PriceUnit;
  city: string;
  region: string;
  address: string | null;
  lat: number;
  lng: number;
  max_guests: number;
  bedrooms: number;
  whatsapp_phone: string;
  status: ListingStatus;
  amenity_ids: string[];
  room_type: EditListingRoomType | null;
  images: Pick<ListingImage, "id" | "url" | "is_cover" | "sort_order" | "storage_path">[];
}

type EditListingRow = {
  id: string;
  title: string;
  description: string;
  title_ru: string | null;
  description_ru: string | null;
  category_id: string;
  price_per_night: number;
  price_unit: PriceUnit;
  city: string;
  region: string;
  address: string | null;
  lat: number;
  lng: number;
  max_guests: number;
  bedrooms: number;
  whatsapp_phone: string;
  status: ListingStatus;
  listing_amenities: { amenity_id: string }[];
  listing_images: Pick<ListingImage, "id" | "url" | "is_cover" | "sort_order" | "storage_path">[];
  listing_room_types: {
    id: string;
    name: string;
    floor: number | null;
    listing_room_type_amenities: { amenity_id: string }[];
  }[];
};

export async function getMyListingForEdit(
  listingId: string,
  ownerId: string
): Promise<EditListingData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, title, description, title_ru, description_ru,
      category_id, price_per_night, price_unit,
      city, region, address, lat, lng,
      max_guests, bedrooms, whatsapp_phone, status,
      listing_amenities(amenity_id),
      listing_images(id, url, is_cover, sort_order, storage_path),
      listing_room_types(
        id, name, floor,
        listing_room_type_amenities(amenity_id)
      )
    `
    )
    .eq("id", listingId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getMyListingForEdit:", error.message);
    return null;
  }

  const row = data as EditListingRow;
  const roomType = row.listing_room_types?.[0] ?? null;
  const images = [...(row.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    title_ru: row.title_ru,
    description_ru: row.description_ru,
    category_id: row.category_id,
    price_per_night: row.price_per_night,
    price_unit: row.price_unit ?? "day",
    city: row.city,
    region: row.region,
    address: row.address,
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
    max_guests: row.max_guests,
    bedrooms: row.bedrooms,
    whatsapp_phone: row.whatsapp_phone,
    status: row.status,
    amenity_ids: row.listing_amenities?.map((a) => a.amenity_id) ?? [],
    room_type: roomType
      ? {
          id: roomType.id,
          name: roomType.name,
          floor: roomType.floor,
          amenity_ids:
            roomType.listing_room_type_amenities?.map((a) => a.amenity_id) ??
            [],
        }
      : null,
    images,
  };
}
