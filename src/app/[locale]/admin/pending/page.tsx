import Link from "next/link";
import { PendingListingCard } from "@/components/admin/PendingListingCard";
import { requireAdmin } from "@/lib/admin/auth";
import { getPendingListings } from "@/lib/queries/admin";

export const metadata = {
  title: "Gözləyən elanlar",
};

export default async function AdminPendingPage() {
  await requireAdmin();
  const listings = await getPendingListings();

  return (
    <div className="container dashboard">
      <Link href="/admin" className="admin-back">
        ← Admin panel
      </Link>

      <h1 className="section__title">Gözləyən elanlar</h1>
      <p className="section__subtitle">
        {listings.length} elan təsdiq gözləyir
      </p>

      {listings.length > 0 ? (
        <div className="admin-list">
          {listings.map((listing) => (
            <PendingListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>Gözləyən elan yoxdur</h3>
          <p>Yeni elan göndərildikdə burada görünəcək.</p>
        </div>
      )}
    </div>
  );
}
