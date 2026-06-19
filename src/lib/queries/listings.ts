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

export interface SearchListingsResult {
  vipListings: ListingCardData[];
  regularListings: ListingCardData[];
  total: number;
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

export const HOME_LISTINGS_PAGE_SIZE = 12;

export interface PaginatedListings {
  listings: ListingCardData[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function getHomeListingsPaginated(
  page = 1,
  pageSize = HOME_LISTINGS_PAGE_SIZE
): Promise<PaginatedListings> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("listings")
    .select(CARD_SELECT, { count: "exact" })
    .eq("status", "approved")
    .eq("is_vip", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getHomeListingsPaginated:", error.message);
    return {
      listings: [],
      page: 1,
      pageSize,
      total: 0,
      totalPages: 1,
    };
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(safePage, totalPages);

  if (clampedPage !== safePage && total > 0) {
    return getHomeListingsPaginated(clampedPage, pageSize);
  }

  return {
    listings: mapToListingCards((data ?? []) as ListingRow[]),
    page: clampedPage,
    pageSize,
    total,
    totalPages,
  };
}

export async function getHomeListings(limit = 12): Promise<ListingCardData[]> {
  const { listings } = await getHomeListingsPaginated(1, limit);
  return listings;
}

async function resolveCategoryId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categorySlug?: string
) {
  if (!categorySlug) return null;

  const slug = categorySlug === "otel" ? "hotel" : categorySlug;

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  return cat?.id ?? null;
}

function applySearchFilters<
  T extends {
    ilike: (col: string, val: string) => T;
    eq: (col: string, val: string | number | boolean) => T;
    gte: (col: string, val: number) => T;
    lte: (col: string, val: number) => T;
  },
>(query: T, filters: SearchFilters, categoryId: string | null): T {
  if (filters.region) query = query.ilike("region", `%${filters.region}%`);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (filters.minPrice) query = query.gte("price_per_night", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_per_night", filters.maxPrice);
  if (filters.guests) query = query.gte("max_guests", filters.guests);
  return query;
}

export async function getSearchListings(
  filters: SearchFilters = {}
): Promise<SearchListingsResult> {
  const supabase = await createClient();
  const categoryId = await resolveCategoryId(supabase, filters.category);

  const base = () =>
    applySearchFilters(
      supabase
        .from("listings")
        .select(CARD_SELECT)
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      filters,
      categoryId
    );

  const [vipRes, regularRes] = await Promise.all([
    base().eq("is_vip", true),
    base().eq("is_vip", false),
  ]);

  if (vipRes.error) {
    console.error("getSearchListings vip:", vipRes.error.message);
  }
  if (regularRes.error) {
    console.error("getSearchListings regular:", regularRes.error.message);
  }

  const vipListings = mapToListingCards((vipRes.data ?? []) as ListingRow[]);
  const regularListings = mapToListingCards(
    (regularRes.data ?? []) as ListingRow[]
  );

  return {
    vipListings,
    regularListings,
    total: vipListings.length + regularListings.length,
  };
}

export async function getApprovedListings(
  filters: SearchFilters = {}
): Promise<ListingCardData[]> {
  const { vipListings, regularListings } = await getSearchListings(filters);
  return [...vipListings, ...regularListings];
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
    if (user) {
      query = query.or(`status.eq.approved,owner_id.eq.${user.id}`);
    } else {
      query = query.eq("status", "approved");
    }
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
