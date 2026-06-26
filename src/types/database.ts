export type UserRole = "guest" | "host" | "admin";
export type ListingStatus = "draft" | "pending" | "approved" | "rejected";
export type PriceUnit = "day" | "week" | "month";

export interface Category {
  id: string;
  slug: string;
  name_az: string;
  icon: string | null;
  sort_order: number;
}

export interface AmenityCategory {
  id: string;
  slug: string;
  name_az: string;
  sort_order: number;
}

export interface Amenity {
  id: string;
  slug: string;
  name_az: string;
  category_id: string;
  icon: string | null;
  sort_order: number;
}

export interface AmenityGroup {
  category: AmenityCategory;
  amenities: Amenity[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  owner_id: string;
  category_id: string;
  title: string;
  description: string;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  whatsapp_phone: string;
  status: ListingStatus;
  is_vip: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  storage_path: string;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

export interface ListingRoomType {
  id: string;
  listing_id: string;
  name: string;
  floor: number | null;
  sort_order: number;
  created_at: string;
  listing_room_type_amenities: {
    amenity: Amenity;
  }[];
}

export interface ListingWithRelations extends Listing {
  category: Category;
  listing_images: ListingImage[];
  listing_amenities: {
    amenity: Amenity & { category: AmenityCategory };
  }[];
  listing_room_types?: ListingRoomType[];
  owner: Pick<Profile, "full_name" | "phone" | "whatsapp_phone" | "avatar_url"> | null;
}

export interface ListingCardData {
  id: string;
  title: string;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  created_at: string;
  category: Pick<Category, "slug" | "name_az">;
  cover_image: string | null;
}
