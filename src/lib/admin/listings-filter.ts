import type {
  AdminListingItem,
  DeletedListingRecord,
} from "@/lib/queries/admin";
import { isVipCurrentlyActive } from "@/lib/listings/vip-payment";

export type AdminListingsSort = "newest" | "oldest";
export type AdminListingsVipFilter = "all" | "active" | "pending" | "any";

export function parseAdminListingsSort(
  value: string | undefined
): AdminListingsSort {
  return value === "oldest" ? "oldest" : "newest";
}

export function parseAdminListingsVipFilter(
  value: string | undefined
): AdminListingsVipFilter {
  if (value === "active" || value === "pending" || value === "any") {
    return value;
  }
  return "all";
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query);
}

function getListingVipState(listing: AdminListingItem) {
  const active = isVipCurrentlyActive(listing.is_vip, listing.vip_expires_at);
  const pending =
    listing.vip_payment_status === "pending" && !!listing.requested_vip_plan;

  return { active, pending };
}

function matchesVipFilter(
  listing: AdminListingItem,
  vipFilter: AdminListingsVipFilter
): boolean {
  if (vipFilter === "all") return true;

  const { active, pending } = getListingVipState(listing);

  if (vipFilter === "active") return active;
  if (vipFilter === "pending") return pending;
  return active || pending;
}

export function filterAdminListingItems(
  listings: AdminListingItem[],
  query: string,
  sort: AdminListingsSort,
  vipFilter: AdminListingsVipFilter = "all"
): AdminListingItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  let result = listings;

  if (normalizedQuery) {
    result = result.filter((listing) => {
      const ownerName = listing.owner?.full_name ?? "";
      return (
        matchesQuery(listing.title, normalizedQuery) ||
        matchesQuery(ownerName, normalizedQuery)
      );
    });
  }

  if (vipFilter !== "all") {
    result = result.filter((listing) => matchesVipFilter(listing, vipFilter));
  }

  return [...result].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sort === "oldest" ? dateA - dateB : dateB - dateA;
  });
}

export function filterDeletedListingRecords(
  records: DeletedListingRecord[],
  query: string,
  sort: AdminListingsSort
): DeletedListingRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  let result = records;

  if (normalizedQuery) {
    result = result.filter((record) => {
      const ownerName = record.owner_name ?? "";
      return (
        matchesQuery(record.title, normalizedQuery) ||
        matchesQuery(ownerName, normalizedQuery)
      );
    });
  }

  return [...result].sort((a, b) => {
    const dateA = new Date(a.deleted_at).getTime();
    const dateB = new Date(b.deleted_at).getTime();
    return sort === "oldest" ? dateA - dateB : dateB - dateA;
  });
}
