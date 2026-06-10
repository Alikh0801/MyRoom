import { createClient } from "@/lib/supabase/server";
import type { ListingCardData, ListingWithRelations } from "@/types/database";

const LISTING_SELECT = `
  *,
  category:categories(*),
  listing_images(*),
  listing_amenities(amenity:amenities(*))
`;

export interface SearchFilters {
  region?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
}

export async function getApprovedListings(
  filters: SearchFilters = {}
): Promise<ListingCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(
      `
      id, title, price_per_night, currency, city, region, max_guests,
      category:categories(slug, name_az),
      listing_images(url, is_cover, sort_order)
    `
    )
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

  return (data ?? []).map((row) => {
    const images = (row.listing_images ?? []) as {
      url: string;
      is_cover: boolean;
      sort_order: number;
    }[];
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
      currency: row.currency,
      city: row.city,
      region: row.region,
      max_guests: row.max_guests,
      category: category ?? { slug: "", name_az: "" },
      cover_image: sorted[0]?.url ?? null,
    };
  });
}

export async function getListingById(
  id: string
): Promise<ListingWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !data) return null;

  const listing = data as unknown as ListingWithRelations;
  listing.listing_images = [...(listing.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

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
