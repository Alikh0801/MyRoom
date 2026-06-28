import { unstable_cache } from "next/cache";
import { cache } from "react";
import { isAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { ListingCardData, ListingWithRelations } from "@/types/database";

const LISTINGS_CACHE_TAG = "listings";
const LISTINGS_REVALIDATE_SECONDS = 60;

export { LISTINGS_CACHE_TAG };

const LISTING_SELECT = `
  *,
  category:categories(*),
  listing_images(*),
  listing_amenities(amenity:amenities(*, category:amenity_categories(*))),
  listing_room_types(*, listing_room_type_amenities(amenity:amenities(*, category:amenity_categories(*)))),
  owner:profiles!listings_owner_id_fkey(full_name, phone, whatsapp_phone, avatar_url)
`;

export { LISTING_SELECT };

function normalizeListingWithRelations(
  data: unknown
): ListingWithRelations | null {
  if (!data) return null;

  const listing = data as ListingWithRelations;
  listing.listing_images = [...(listing.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  if (Array.isArray(listing.owner)) {
    listing.owner = listing.owner[0] ?? null;
  }

  return listing;
}

const CARD_SELECT = `
  id, title, title_ru, price_per_night, price_unit, currency, city, region, max_guests, created_at,
  category:categories(slug, name_az, name_ru),
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

export type ListingRow = {
  id: string;
  title: string;
  title_ru?: string | null;
  price_per_night: number;
  price_unit: "day" | "week" | "month";
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  created_at: string;
  category: { slug: string; name_az: string; name_ru?: string | null } | { slug: string; name_az: string; name_ru?: string | null }[];
  listing_images: { url: string; is_cover: boolean; sort_order: number }[];
};

export function mapToListingCards(rows: ListingRow[]): ListingCardData[] {
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
      title_ru: row.title_ru ?? null,
      price_per_night: row.price_per_night,
      price_unit: row.price_unit ?? "day",
      currency: row.currency,
      city: row.city,
      region: row.region,
      max_guests: row.max_guests,
      created_at: row.created_at,
      category: category ?? { slug: "", name_az: "" },
      cover_image: sorted[0]?.url ?? null,
    };
  });
}

export async function getVipListings(limit = 6): Promise<ListingCardData[]> {
  return getVipListingsCached(limit);
}

const getVipListingsCached = unstable_cache(
  async (limit: number) => {
    const supabase = createPublicClient();

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
  },
  ["vip-listings"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export const HOME_LISTINGS_PAGE_SIZE = 12;

export interface PaginatedListings {
  listings: ListingCardData[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const getHomeListingsPageData = unstable_cache(
  async (safePage: number, pageSize: number): Promise<PaginatedListings> => {
    const supabase = createPublicClient();
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

    return {
      listings: mapToListingCards((data ?? []) as ListingRow[]),
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  },
  ["home-listings-page"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export async function getHomeListingsPaginated(
  page = 1,
  pageSize = HOME_LISTINGS_PAGE_SIZE
): Promise<PaginatedListings> {
  const safePage = Math.max(1, page);
  const result = await getHomeListingsPageData(safePage, pageSize);

  if (result.total > 0 && safePage > result.totalPages) {
    return getHomeListingsPageData(result.totalPages, pageSize);
  }

  return result;
}

export async function getHomeListings(limit = 12): Promise<ListingCardData[]> {
  const { listings } = await getHomeListingsPaginated(1, limit);
  return listings;
}

async function resolveCategoryIdPublic(categorySlug?: string) {
  if (!categorySlug) return null;

  const slug = categorySlug === "otel" ? "hotel" : categorySlug;
  const supabase = createPublicClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  return cat?.id ?? null;
}

function buildPublicSearchQuery(
  supabase: ReturnType<typeof createPublicClient>,
  filters: SearchFilters,
  categoryId: string | null,
  isVip: boolean
) {
  let query = supabase
    .from("listings")
    .select(CARD_SELECT)
    .eq("status", "approved")
    .eq("is_vip", isVip)
    .order("created_at", { ascending: false });

  if (filters.region) query = query.ilike("region", `%${filters.region}%`);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (filters.minPrice) query = query.gte("price_per_night", filters.minPrice);
  if (filters.maxPrice) query = query.lte("price_per_night", filters.maxPrice);
  if (filters.guests) query = query.gte("max_guests", filters.guests);

  return query;
}

const getSearchListingsCached = unstable_cache(
  async (filtersKey: string): Promise<SearchListingsResult> => {
    const filters = JSON.parse(filtersKey) as SearchFilters;
    const supabase = createPublicClient();
    const categoryId = await resolveCategoryIdPublic(filters.category);

    const [vipRes, regularRes] = await Promise.all([
      buildPublicSearchQuery(supabase, filters, categoryId, true),
      buildPublicSearchQuery(supabase, filters, categoryId, false),
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
  },
  ["search-listings"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export async function getSearchListings(
  filters: SearchFilters = {}
): Promise<SearchListingsResult> {
  const filtersKey = JSON.stringify({
    region: filters.region ?? "",
    category: filters.category ?? "",
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    guests: filters.guests ?? null,
  });

  return getSearchListingsCached(filtersKey);
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
  return getSimilarListingsCached(listingId, categoryId, region, limit);
}

const getSimilarListingsCached = unstable_cache(
  async (
    listingId: string,
    categoryId: string,
    region: string,
    limit: number
  ) => {
    const supabase = createPublicClient();
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
  },
  ["similar-listings"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export const getListingById = cache(async function getListingById(
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

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("getListingById:", error.message);
    return null;
  }

  return normalizeListingWithRelations(data);
});

export async function getListingByIdForAdmin(
  id: string
): Promise<ListingWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getListingByIdForAdmin:", error.message);
    return null;
  }

  return normalizeListingWithRelations(data);
}

export const getCategories = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    return data ?? [];
  },
  ["categories"],
  { revalidate: 3600 }
);

export async function getRegions(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("region")
    .eq("status", "approved");

  const unique = [...new Set((data ?? []).map((r) => r.region))];
  return unique.sort();
}
