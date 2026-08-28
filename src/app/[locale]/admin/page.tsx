import { AdminBlogList } from "@/components/admin/AdminBlogList";
import { AdminListingsList } from "@/components/admin/AdminListingsList";
import { AdminPanelTabs } from "@/components/admin/AdminPanelTabs";
import { AdminStatsPanel } from "@/components/admin/AdminStatsPanel";
import { AdminSupportList } from "@/components/admin/AdminSupportList";
import { requireAdmin } from "@/lib/admin/auth";
import {
  filterAdminListingItems,
  filterDeletedListingRecords,
  parseAdminListingsSort,
  parseAdminListingsVipFilter,
} from "@/lib/admin/listings-filter";
import { isListingsAdminTab, parseAdminTab } from "@/lib/admin/tabs";
import {
  getAdminListingsForTab,
  getAdminTabCounts,
  type AdminListingItem,
  type DeletedListingRecord,
} from "@/lib/queries/admin";
import { getAdminBlogPosts } from "@/lib/queries/blog-admin";
import { getSiteStats } from "@/lib/queries/stats";
import { getSupportMessages } from "@/lib/queries/support";
import { Suspense } from "react";

export const metadata = {
  title: "Admin panel",
};

export const dynamic = "force-dynamic";

const TAB_SUBTITLES = {
  pending: "Təsdiq gözləyən elanlar",
  active: "Saytda aktiv olan elanlar",
  deleted: "Admin tərəfindən silinmiş elanlar",
  support: "İstifadəçilərdən gələn şikayət və təkliflər",
  blog: "Sayt blogundakı bələdçi məqalələri",
  stats: "Sayt ziyarətləri və elan baxışları üzrə statistika",
} as const;

type AdminPageProps = {
  searchParams: Promise<{ tab?: string; q?: string; sort?: string; vip?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();

  const { tab: tabParam, q = "", sort: sortParam, vip: vipParam } =
    await searchParams;
  const tab = parseAdminTab(tabParam);
  const sort = parseAdminListingsSort(sortParam);
  const vipFilter = parseAdminListingsVipFilter(vipParam);
  const searchQuery = q.trim();
  const hasActiveFilters =
    searchQuery.length > 0 ||
    sort !== "newest" ||
    (tab !== "deleted" && vipFilter !== "all");

  const [counts, listings, siteStats, blogPosts, supportMessages] =
    await Promise.all([
      getAdminTabCounts(),
      isListingsAdminTab(tab) ? getAdminListingsForTab(tab) : Promise.resolve([]),
      tab === "stats" ? getSiteStats() : Promise.resolve(null),
      tab === "blog" ? getAdminBlogPosts() : Promise.resolve([]),
      tab === "support" ? getSupportMessages() : Promise.resolve([]),
    ]);

  const filteredListings = isListingsAdminTab(tab)
    ? tab === "deleted"
      ? filterDeletedListingRecords(
          listings as DeletedListingRecord[],
          searchQuery,
          sort
        )
      : filterAdminListingItems(
          listings as AdminListingItem[],
          searchQuery,
          sort,
          vipFilter
        )
    : [];

  return (
    <div className="container dashboard admin-panel-page">
      <header className="admin-panel-page__header">
        <h1 className="section__title">Admin panel</h1>
        <p className="section__subtitle">{TAB_SUBTITLES[tab]}</p>
      </header>

      <div className="admin-panel">
        <Suspense fallback={null}>
          <AdminPanelTabs counts={counts} activeTab={tab} />
        </Suspense>

        <section className="admin-panel__content" role="tabpanel">
          {tab === "support" ? (
            <AdminSupportList messages={supportMessages} />
          ) : tab === "blog" ? (
            <AdminBlogList posts={blogPosts} />
          ) : tab === "stats" && siteStats ? (
            <AdminStatsPanel stats={siteStats} />
          ) : (
            isListingsAdminTab(tab) && (
              <AdminListingsList
                tab={tab}
                listings={filteredListings}
                hasActiveSearch={searchQuery.length > 0}
              />
            )
          )}
        </section>
      </div>
    </div>
  );
}
