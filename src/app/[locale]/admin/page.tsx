import { AdminListingsList } from "@/components/admin/AdminListingsList";
import { AdminPanelTabs } from "@/components/admin/AdminPanelTabs";
import { requireAdmin } from "@/lib/admin/auth";
import { parseAdminTab } from "@/lib/admin/tabs";
import {
  getAdminListingsForTab,
  getAdminTabCounts,
} from "@/lib/queries/admin";

export const metadata = {
  title: "Admin panel",
};

export const dynamic = "force-dynamic";

const TAB_SUBTITLES = {
  pending: "Təsdiq gözləyən elanlar",
  active: "Saytda aktiv olan elanlar",
  deleted: "Admin tərəfindən silinmiş elanlar",
} as const;

type AdminPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await requireAdmin();

  const { tab: tabParam } = await searchParams;
  const tab = parseAdminTab(tabParam);

  const [counts, listings] = await Promise.all([
    getAdminTabCounts(),
    getAdminListingsForTab(tab),
  ]);

  return (
    <div className="container dashboard admin-panel-page">
      <header className="admin-panel-page__header">
        <h1 className="section__title">Admin panel</h1>
        <p className="section__subtitle">{TAB_SUBTITLES[tab]}</p>
      </header>

      <div className="admin-panel">
        <AdminPanelTabs counts={counts} activeTab={tab} />

        <section className="admin-panel__content" role="tabpanel">
          <AdminListingsList tab={tab} listings={listings} />
        </section>
      </div>
    </div>
  );
}
