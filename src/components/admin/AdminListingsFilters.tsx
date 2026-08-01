"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type {
  AdminListingsSort,
  AdminListingsVipFilter,
} from "@/lib/admin/listings-filter";
import {
  parseAdminListingsSort,
  parseAdminListingsVipFilter,
} from "@/lib/admin/listings-filter";
import type { AdminTab } from "@/lib/admin/tabs";

interface AdminListingsFiltersProps {
  tab: Exclude<AdminTab, "settings">;
}

type AdminFilterParams = {
  query: string;
  sort: AdminListingsSort;
  vip: AdminListingsVipFilter;
};

function buildAdminHref(
  pathname: string,
  tab: Exclude<AdminTab, "settings">,
  filters: AdminFilterParams
): string {
  const params = new URLSearchParams();

  if (tab !== "pending") {
    params.set("tab", tab);
  }

  const trimmedQuery = filters.query.trim();
  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  if (filters.vip !== "all" && tab !== "deleted") {
    params.set("vip", filters.vip);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function AdminListingsFilters({ tab }: AdminListingsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const sort = parseAdminListingsSort(searchParams.get("sort") ?? undefined);
  const vip = parseAdminListingsVipFilter(searchParams.get("vip") ?? undefined);
  const showVipFilter = tab !== "deleted";

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const pushFilters = useCallback(
    (nextFilters: AdminFilterParams) => {
      router.replace(buildAdminHref(pathname, tab, nextFilters));
    },
    [pathname, router, tab]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const currentQuery = searchParams.get("q") ?? "";
      if (query.trim() === currentQuery.trim()) return;
      pushFilters({ query, sort, vip });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, sort, vip, searchParams, pushFilters]);

  return (
    <div
      className={`admin-listings-filters${
        showVipFilter ? " admin-listings-filters--with-vip" : ""
      }`}
    >
      <label className="admin-listings-filters__field admin-listings-filters__field--search">
        <span className="admin-listings-filters__label">Axtarış</span>
        <input
          type="search"
          className="admin-listings-filters__input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Elan başlığı və ya elan sahibi adı"
          autoComplete="off"
        />
      </label>

      <label className="admin-listings-filters__field">
        <span className="admin-listings-filters__label">Tarixə görə</span>
        <select
          className="admin-listings-filters__select"
          value={sort}
          onChange={(event) =>
            pushFilters({
              query,
              sort: event.target.value as AdminListingsSort,
              vip,
            })
          }
        >
          <option value="newest">Ən yeni</option>
          <option value="oldest">Ən köhnə</option>
        </select>
      </label>

      {showVipFilter && (
        <label className="admin-listings-filters__field">
          <span className="admin-listings-filters__label">VIP</span>
          <select
            className="admin-listings-filters__select"
            value={vip}
            onChange={(event) =>
              pushFilters({
                query,
                sort,
                vip: event.target.value as AdminListingsVipFilter,
              })
            }
          >
            <option value="all">Hamısı</option>
            <option value="any">VIP elanlar</option>
            <option value="active">Aktiv VIP</option>
            <option value="pending">VIP sorğusu</option>
          </select>
        </label>
      )}
    </div>
  );
}
