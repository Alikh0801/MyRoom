import { createClient } from "@/lib/supabase/server";
import type { ListingStatus, PriceUnit } from "@/types/database";

const MY_LISTING_SELECT = `
  id, title, status, is_vip, price_per_night, price_unit, currency,
  city, region, created_at, updated_at,
  category:categories(slug, name_az),
  listing_images(url, is_cover, sort_order)
`;

type MyListingRow = {
  id: string;
  title: string;
  status: ListingStatus;
  is_vip: boolean;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  created_at: string;
  updated_at: string;
  category: { slug: string; name_az: string } | { slug: string; name_az: string }[];
  listing_images: { url: string; is_cover: boolean; sort_order: number }[];
};

export interface MyListingItem {
  id: string;
  title: string;
  status: ListingStatus;
  is_vip: boolean;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  created_at: string;
  updated_at: string;
  category: { slug: string; name_az: string };
  cover_image: string | null;
}

export interface MyListingCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
}

function mapMyListing(row: MyListingRow): MyListingItem {
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
    status: row.status,
    is_vip: row.is_vip,
    price_per_night: row.price_per_night,
    price_unit: row.price_unit ?? "day",
    currency: row.currency,
    city: row.city,
    region: row.region,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: category ?? { slug: "", name_az: "" },
    cover_image: sorted[0]?.url ?? null,
  };
}

export async function getMyListings(
  ownerId: string,
  statusFilter?: ListingStatus
): Promise<MyListingItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(MY_LISTING_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getMyListings:", error.message);
    return [];
  }

  return ((data ?? []) as MyListingRow[]).map(mapMyListing);
}

export async function getMyListingCounts(
  ownerId: string
): Promise<MyListingCounts> {
  const supabase = await createClient();

  const statuses: ListingStatus[] = [
    "pending",
    "approved",
    "rejected",
    "draft",
  ];

  const results = await Promise.all(
    statuses.map((status) =>
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", ownerId)
        .eq("status", status)
    )
  );

  const counts = Object.fromEntries(
    statuses.map((status, i) => [status, results[i].count ?? 0])
  ) as Record<ListingStatus, number>;

  return {
    all:
      counts.pending + counts.approved + counts.rejected + counts.draft,
    pending: counts.pending,
    approved: counts.approved,
    rejected: counts.rejected,
    draft: counts.draft,
  };
}
