export type UserRole = "guest" | "host" | "admin";
export type ListingStatus = "draft" | "pending" | "approved" | "rejected";

export interface Category {
  id: string;
  slug: string;
  name_az: string;
  icon: string | null;
  sort_order: number;
}

export interface Amenity {
  id: string;
  slug: string;
  name_az: string;
  icon: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
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

export interface ListingWithRelations extends Listing {
  category: Category;
  listing_images: ListingImage[];
  listing_amenities: { amenity: Amenity }[];
}

export interface ListingCardData {
  id: string;
  title: string;
  price_per_night: number;
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  category: Pick<Category, "slug" | "name_az">;
  cover_image: string | null;
}
