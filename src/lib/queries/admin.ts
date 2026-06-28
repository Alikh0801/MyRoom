import { createClient } from "@/lib/supabase/server";
import type { AdminTab } from "@/lib/admin/tabs";
import type { PriceUnit, VipPaymentStatus, VipPlan } from "@/types/database";

export interface AdminListingItem {
  id: string;
  title: string;
  status: string;
  is_vip: boolean;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  whatsapp_phone: string;
  created_at: string;
  requested_vip_plan: VipPlan | null;
  vip_payment_status: VipPaymentStatus;
  category: { name_az: string } | null;
  owner: { full_name: string | null; phone: string | null } | null;
  cover_image: string | null;
}

/** @deprecated Use AdminListingItem */
export type PendingListing = AdminListingItem;

export interface DeletedListingRecord {
  id: string;
  listing_id: string;
  title: string;
  city: string | null;
  region: string | null;
  price_per_night: number | null;
  price_unit: string | null;
  currency: string | null;
  category_name_az: string | null;
  owner_name: string | null;
  cover_image_url: string | null;
  delete_reason: string;
  deleted_at: string;
}

export interface AdminTabCounts {
  pending: number;
  active: number;
  deleted: number;
}

const LISTING_EMBEDS = `
  category:categories(name_az),
  owner:profiles!listings_owner_id_fkey(full_name, phone),
  listing_images(url, is_cover, sort_order)
`;

const LISTING_CORE = `
  id, title, status, is_vip, price_per_night, price_unit, currency, city, region,
  max_guests, whatsapp_phone, created_at
`;

const LISTING_VIP = "requested_vip_plan, vip_payment_status";

type AdminListingRow = {
  id: string;
  title: string;
  status: string;
  is_vip: boolean;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  whatsapp_phone: string;
  created_at: string;
  requested_vip_plan?: VipPlan | null;
  vip_payment_status?: VipPaymentStatus;
  category:
    | { name_az: string }
    | { name_az: string }[]
    | null;
  owner:
    | { full_name: string | null; phone: string | null }
    | { full_name: string | null; phone: string | null }[]
    | null;
  listing_images?: { url: string; is_cover: boolean; sort_order: number }[];
};

function mapAdminListing(row: AdminListingRow): AdminListingItem {
  const images = row.listing_images ?? [];
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.sort_order - b.sort_order;
  });

  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const owner = Array.isArray(row.owner) ? row.owner[0] : row.owner;

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
    max_guests: row.max_guests,
    whatsapp_phone: row.whatsapp_phone,
    created_at: row.created_at,
    requested_vip_plan: row.requested_vip_plan ?? null,
    vip_payment_status: row.vip_payment_status ?? "none",
    category: category ?? null,
    owner: owner ?? null,
    cover_image: sorted[0]?.url ?? null,
  };
}

async function fetchListingsByStatus(
  status: "pending" | "approved"
): Promise<AdminListingItem[]> {
  const supabase = await createClient();

  const selectVariants = [
    `${LISTING_CORE}, ${LISTING_VIP}, ${LISTING_EMBEDS}`,
    `${LISTING_CORE}, ${LISTING_EMBEDS}`,
    `${LISTING_CORE}, ${LISTING_VIP}, category:categories(name_az), owner:profiles(full_name, phone)`,
    `${LISTING_CORE}, category:categories(name_az), owner:profiles(full_name, phone)`,
    LISTING_CORE,
  ];

  const ascending = status === "pending";

  for (const select of selectVariants) {
    const result = await supabase
      .from("listings")
      .select(select)
      .eq("status", status)
      .order("created_at", { ascending });

    if (!result.error) {
      return ((result.data ?? []) as unknown as AdminListingRow[]).map(
        mapAdminListing
      );
    }
  }

  console.error(`fetchListingsByStatus(${status}): query failed`);
  return [];
}

const DELETED_TAB_HIDDEN_STATUSES = new Set(["pending", "approved"]);

async function filterVisibleDeletions(
  records: DeletedListingRecord[]
): Promise<DeletedListingRecord[]> {
  if (records.length === 0) return [];

  const supabase = await createClient();
  const listingIds = [...new Set(records.map((record) => record.listing_id))];

  const { data: listings } = await supabase
    .from("listings")
    .select("id, status")
    .in("id", listingIds);

  const statusById = new Map(
    (listings ?? []).map((listing) => [listing.id, listing.status])
  );

  return records.filter((record) => {
    const status = statusById.get(record.listing_id);
    if (!status) return true;
    return !DELETED_TAB_HIDDEN_STATUSES.has(status);
  });
}

export async function getAdminTabCounts(): Promise<AdminTabCounts> {
  const supabase = await createClient();

  const [pending, active, deletedRecords] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    getDeletedListings(),
  ]);

  return {
    pending: pending.count ?? 0,
    active: active.count ?? 0,
    deleted: deletedRecords.length,
  };
}

export async function getPendingListings(): Promise<AdminListingItem[]> {
  return fetchListingsByStatus("pending");
}

export async function getActiveListings(): Promise<AdminListingItem[]> {
  return fetchListingsByStatus("approved");
}

export async function getDeletedListings(): Promise<DeletedListingRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_deletion_log")
    .select(
      `
      id, listing_id, title, city, region, price_per_night, price_unit, currency,
      category_name_az, owner_name, cover_image_url, delete_reason, deleted_at
    `
    )
    .order("deleted_at", { ascending: false });

  if (error) {
    console.error("getDeletedListings:", error.message);
    return [];
  }

  return filterVisibleDeletions((data ?? []) as DeletedListingRecord[]);
}

export async function getAdminListingsForTab(
  tab: AdminTab
): Promise<AdminListingItem[] | DeletedListingRecord[]> {
  if (tab === "active") return getActiveListings();
  if (tab === "deleted") return getDeletedListings();
  return getPendingListings();
}

/** @deprecated Use getAdminTabCounts */
export async function getAdminStats() {
  const counts = await getAdminTabCounts();
  return {
    pending: counts.pending,
    approved: counts.active,
    rejected: 0,
  };
}
