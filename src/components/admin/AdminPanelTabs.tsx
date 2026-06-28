import { Link } from "@/i18n/navigation";
import { adminTabHref, type AdminTab } from "@/lib/admin/tabs";
import type { AdminTabCounts } from "@/lib/queries/admin";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "pending", label: "Gözləyən elanlar" },
  { id: "active", label: "Aktiv elanlar" },
  { id: "deleted", label: "Silinmiş elanlar" },
];

interface AdminPanelTabsProps {
  counts: AdminTabCounts;
  activeTab: AdminTab;
}

function countFor(counts: AdminTabCounts, tab: AdminTab): number {
  if (tab === "pending") return counts.pending;
  if (tab === "active") return counts.active;
  return counts.deleted;
}

export function AdminPanelTabs({ counts, activeTab }: AdminPanelTabsProps) {
  return (
    <nav
      className="admin-panel-tabs"
      role="tablist"
      aria-label="Admin elan tabları"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = countFor(counts, tab.id);

        return (
          <Link
            key={tab.id}
            href={adminTabHref(tab.id)}
            className={`admin-panel-tabs__tab${
              isActive ? " admin-panel-tabs__tab--active" : ""
            }`}
            role="tab"
            aria-selected={isActive}
          >
            <span className="admin-panel-tabs__label">{tab.label}</span>
            <span className="admin-panel-tabs__count">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}
