import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MyListingsFilters,
  parseListingStatusFilter,
} from "@/components/dashboard/MyListingsFilters";
import { MyListingCard } from "@/components/dashboard/MyListingCard";
import { LISTING_STATUS_LABELS } from "@/lib/listings/status";
import {
  getMyListingCounts,
  getMyListings,
} from "@/lib/queries/my-listings";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Mənim elanlarım",
};

interface MyListingsPageProps {
  searchParams: Promise<{ status?: string; created?: string }>;
}

export default async function MyListingsPage({
  searchParams,
}: MyListingsPageProps) {
  const params = await searchParams;
  const statusFilter = parseListingStatusFilter(params.status);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/listings");

  const [listings, counts] = await Promise.all([
    getMyListings(user.id, statusFilter),
    getMyListingCounts(user.id),
  ]);

  const pageTitle = statusFilter
    ? LISTING_STATUS_LABELS[statusFilter]
    : "Mənim elanlarım";

  return (
    <div className="container dashboard">
      <div className="dashboard__header-row">
        <div>
          <h1 className="section__title">{pageTitle}</h1>
          <p className="section__subtitle dashboard__subtitle">
            Elanlarınızın statusunu izləyin və idarə edin.
          </p>
        </div>
        <Link href="/dashboard/listings/new" className="btn btn--primary">
          + Yeni elan
        </Link>
      </div>

      {params.created === "1" && (
        <div className="dashboard__alert">
          Elanınız uğurla göndərildi. Admin təsdiqindən sonra saytda görünəcək.
        </div>
      )}

      <MyListingsFilters counts={counts} activeStatus={statusFilter} />

      {listings.length > 0 ? (
        <div className="my-listings">
          {listings.map((listing) => (
            <MyListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>
            {statusFilter
              ? `${LISTING_STATUS_LABELS[statusFilter]} elan yoxdur`
              : "Hələ elanınız yoxdur"}
          </h3>
          <p>
            {statusFilter
              ? "Bu statusda elan tapılmadı."
              : "İlk elanınızı yerləşdirərək qonaqları qəbul etməyə başlayın."}
          </p>
          {!statusFilter && (
            <Link
              href="/dashboard/listings/new"
              className="btn btn--primary"
              style={{ marginTop: "1rem" }}
            >
              Elan yerləşdir
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
