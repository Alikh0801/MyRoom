import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminStats } from "@/lib/queries/admin";

export const metadata = {
  title: "Admin panel",
};

export default async function AdminPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  return (
    <div className="container dashboard">
      <h1 className="section__title">Admin panel</h1>
      <p className="section__subtitle">Elanları idarə edin</p>

      <div className="admin-stats">
        <div className="admin-stat admin-stat--pending">
          <span className="admin-stat__num">{stats.pending}</span>
          <span className="admin-stat__label">Gözləyən</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__num">{stats.approved}</span>
          <span className="admin-stat__label">Təsdiqlənmiş</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__num">{stats.rejected}</span>
          <span className="admin-stat__label">Rədd edilmiş</span>
        </div>
      </div>

      <Link href="/admin/pending" className="dashboard__card admin-link-card">
        <h2>Gözləyən elanlar</h2>
        <p>
          {stats.pending > 0
            ? `${stats.pending} elan təsdiq gözləyir`
            : "Gözləyən elan yoxdur"}
        </p>
      </Link>
    </div>
  );
}
