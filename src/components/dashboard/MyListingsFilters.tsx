import Link from "next/link";
import { isListingStatus, LISTING_STATUS_LABELS } from "@/lib/listings/status";
import type { ListingStatus } from "@/types/database";
import type { MyListingCounts } from "@/lib/queries/my-listings";

interface MyListingsFiltersProps {
  counts: MyListingCounts;
  activeStatus?: ListingStatus;
}

const FILTERS: { key: ListingStatus | "all"; label: string }[] = [
  { key: "all", label: "Hamısı" },
  { key: "pending", label: LISTING_STATUS_LABELS.pending },
  { key: "approved", label: LISTING_STATUS_LABELS.approved },
  { key: "rejected", label: LISTING_STATUS_LABELS.rejected },
];

function filterHref(status: ListingStatus | "all") {
  return status === "all"
    ? "/dashboard/listings"
    : `/dashboard/listings?status=${status}`;
}

function countFor(
  counts: MyListingCounts,
  status: ListingStatus | "all"
): number {
  if (status === "all") return counts.all;
  return counts[status];
}

export function MyListingsFilters({
  counts,
  activeStatus,
}: MyListingsFiltersProps) {
  return (
    <div className="my-listings-filters" role="tablist" aria-label="Elan statusu">
      {FILTERS.map((filter) => {
        const isActive =
          filter.key === "all" ? !activeStatus : activeStatus === filter.key;
        const count = countFor(counts, filter.key);

        return (
          <Link
            key={filter.key}
            href={filterHref(filter.key)}
            className={`my-listings-filters__tab${
              isActive ? " my-listings-filters__tab--active" : ""
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {filter.label}
            <span className="my-listings-filters__count">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function parseListingStatusFilter(
  value?: string
): ListingStatus | undefined {
  if (!value || !isListingStatus(value)) return undefined;
  return value;
}
