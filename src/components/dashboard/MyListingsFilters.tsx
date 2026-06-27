"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ListingStatus } from "@/types/database";
import type { MyListingCounts } from "@/lib/queries/my-listings";

interface MyListingsFiltersProps {
  counts: MyListingCounts;
  activeStatus?: ListingStatus;
}

const FILTER_KEYS: (ListingStatus | "all")[] = [
  "all",
  "pending",
  "approved",
  "rejected",
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
  const t = useTranslations("dashboard");

  return (
    <div
      className="my-listings-filters"
      role="tablist"
      aria-label={t("filters.ariaLabel")}
    >
      {FILTER_KEYS.map((key) => {
        const isActive = key === "all" ? !activeStatus : activeStatus === key;
        const count = countFor(counts, key);
        const label = key === "all" ? t("filters.all") : t(`status.${key}`);

        return (
          <Link
            key={key}
            href={filterHref(key)}
            className={`my-listings-filters__tab${
              isActive ? " my-listings-filters__tab--active" : ""
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {label}
            <span className="my-listings-filters__count">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
