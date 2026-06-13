import { isAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { ListingCardData, ListingWithRelations } from "@/types/database";

const LISTING_SELECT = `
  *,
  category:categories(*),
  listing_images(*),
  listing_amenities(amenity:amenities(*, category:amenity_categories(*))),
  listing_room_types(*, listing_room_type_amenities(amenity:amenities(*, category:amenity_categories(*)))),
  owner:profiles(full_name, phone, whatsapp_phone, avatar_url)
`;

const CARD_SELECT = `
  id, title, price_per_night, price_unit, currency, city, region, max_guests,
  category:categories(slug, name_az),
  listing_images(url, is_cover, sort_order)
`;

export interface SearchFilters {
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}

type ListingRow = {
  id: string;
  title: string;
  price_per_night: number;
  price_unit: "day" | "week" | "month";
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  category: { slug: string; name_az: string } | { slug: string; name_az: string }[];
  listing_images: { url: string; is_cover: boolean; sort_order: number }[];
};

function mapToListingCards(rows: ListingRow[]): ListingCardData[] {
  return rows.map((row) => {
    const images = row.listing_images ?? [];
    const sorted = [...images].sort((a, b) => {
      if (a.is_cover) return -1;
      if (b.is_cover) return 1;
      return a.sort_order - b.sort_order;
    });

    const category = Array.isArray(row.category) ? row.category[0] : row.category;

    return {
      id: row.id,
      title: row.title,
      price_per_night: row.price_per_night,
      price_unit: row.price_unit ?? "day",
      currency: row.currency,
      city: row.city,
      region: row.region,
      max_guests: row.max_guests,
      category: category ?? { slug: "", name_az: "" },
      cover_image: sorted[0]?.url ?? null,
    };
  });
}

export async function getVipListings(limit = 6): Promise<ListingCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "approved")
    .eq("is_vip", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getVipListings:", error.message);
    return [];
  }

  return mapToListingCards((data ?? []) as ListingRow[]);
}

export async function getHomeListings(limit = 12): Promise<ListingCardData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "approved")
    .eq("is_vip", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getHomeListings:", error.message);
    return [];
  }

  return mapToListingCards((data ?? []) as ListingRow[]);
}

export async function getApprovedListings(
  filters: SearchFilters = {}
): Promise<ListingCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (filters.region) query = query.ilike("region", `%${filters.region}%`);

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", filters.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (filters.minPrice) query = query.gte("price_per_night", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_per_night", filters.maxPrice);
  if (filters.guests) query = query.gte("max_guests", filters.guests);

  const { data, error } = await query;

  if (error) {
    console.error("getApprovedListings:", error.message);
    return [];
  }

  return mapToListingCards((data ?? []) as ListingRow[]);
}

export async function getSimilarListings(
  listingId: string,
  categoryId: string,
  region: string,
  limit = 4
): Promise<ListingCardData[]> {
  const supabase = await createClient();
  const results: ListingCardData[] = [];
  const excludeIds = new Set([listingId]);

  async function collect(applyRegion: boolean) {
    if (results.length >= limit) return;

    let query = supabase
      .from("listings")
      .select(CARD_SELECT)
      .eq("status", "approved")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .limit(limit * 2);

    if (applyRegion) query = query.ilike("region", region);

    const { data, error } = await query;
    if (error) {
      console.error("getSimilarListings:", error.message);
      return;
    }

    for (const row of (data ?? []) as ListingRow[]) {
      if (results.length >= limit) break;
      if (excludeIds.has(row.id)) continue;
      excludeIds.add(row.id);
      results.push(mapToListingCards([row])[0]);
    }
  }

  await collect(true);
  if (results.length < limit) await collect(false);

  return results;
}

export async function getListingById(
  id: string
): Promise<ListingWithRelations | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("listings").select(LISTING_SELECT).eq("id", id);

  const admin = user ? await isAdminUser(user.id) : false;
  if (!admin) {
    query = query.eq("status", "approved");
  }

  const { data, error } = await query.single();

  if (error || !data) return null;

  const listing = data as unknown as ListingWithRelations;
  listing.listing_images = [...(listing.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  if (Array.isArray(listing.owner)) {
    listing.owner = listing.owner[0] ?? null;
  }

  return listing;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getRegions(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("region")
    .eq("status", "approved");

  const unique = [...new Set((data ?? []).map((r) => r.region))];
  return unique.sort();
}
