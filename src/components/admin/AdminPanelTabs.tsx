"use client";

import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { adminTabHref, type AdminTab } from "@/lib/admin/tabs";
import type { AdminTabCounts } from "@/lib/queries/admin";

const TABS: { id: AdminTab; label: string; showCount: boolean }[] = [
  { id: "pending", label: "Gözləyən elanlar", showCount: true },
  { id: "active", label: "Aktiv elanlar", showCount: true },
  { id: "deleted", label: "Silinmiş elanlar", showCount: true },
  { id: "stats", label: "Statistika", showCount: false },
  { id: "settings", label: "Bank kartı", showCount: false },
];

interface AdminPanelTabsProps {
  counts: AdminTabCounts;
  activeTab: AdminTab;
}

function countFor(counts: AdminTabCounts, tab: AdminTab): number {
  if (tab === "pending") return counts.pending;
  if (tab === "active") return counts.active;
  if (tab === "deleted") return counts.deleted;
  return 0;
}

export function AdminPanelTabs({ counts, activeTab }: AdminPanelTabsProps) {
  const searchParams = useSearchParams();
  const filterParams = {
    q: searchParams.get("q") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    vip: searchParams.get("vip") ?? undefined,
  };

  return (
    <nav
      className="admin-panel-tabs"
      role="tablist"
      aria-label="Admin panel tabları"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = countFor(counts, tab.id);

        return (
          <Link
            key={tab.id}
            href={adminTabHref(tab.id, filterParams)}
            className={`admin-panel-tabs__tab${
              isActive ? " admin-panel-tabs__tab--active" : ""
            }`}
            role="tab"
            aria-selected={isActive}
          >
            <span className="admin-panel-tabs__label">{tab.label}</span>
            {tab.showCount && (
              <span className="admin-panel-tabs__count">{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
