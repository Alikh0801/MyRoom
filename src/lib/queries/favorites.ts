import { createClient } from "@/lib/supabase/server";
import type { ListingCardData } from "@/types/database";
import { mapToListingCards, type ListingRow } from "@/lib/queries/listings";

const FAVORITE_LISTING_SELECT = `
  listing:listings(
    id, title, title_ru, price_per_night, price_unit, currency, city, region, max_guests, created_at,
    category:categories(slug, name_az, name_ru),
    listing_images(url, is_cover, sort_order)
  )
`;

type FavoriteRow = {
  listing_id: string;
  created_at: string;
  listing:
    | ListingRow
    | ListingRow[]
    | null;
};

export async function getFavoriteListingIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_favorites")
    .select("listing_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFavoriteListingIds:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.listing_id);
}

export async function isListingFavorited(
  userId: string,
  listingId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_favorites")
    .select("listing_id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (error) {
    console.error("isListingFavorited:", error.message);
    return false;
  }

  return Boolean(data);
}

export async function getFavoriteListings(userId: string): Promise<ListingCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_favorites")
    .select(FAVORITE_LISTING_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFavoriteListings:", error.message);
    return [];
  }

  const rows = (data ?? []) as FavoriteRow[];
  const listings = rows
    .map((row) => (Array.isArray(row.listing) ? row.listing[0] : row.listing))
    .filter((listing): listing is ListingRow => Boolean(listing?.id));

  return mapToListingCards(listings);
}
