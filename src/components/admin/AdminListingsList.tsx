import { AdminActiveListingCard } from "@/components/admin/AdminActiveListingCard";
import { AdminDeletedListingCard } from "@/components/admin/AdminDeletedListingCard";
import { AdminListingsFilters } from "@/components/admin/AdminListingsFilters";
import { PendingListingCard } from "@/components/admin/PendingListingCard";
import type { AdminTab } from "@/lib/admin/tabs";
import { isListingsAdminTab } from "@/lib/admin/tabs";
import type {
  AdminListingItem,
  DeletedListingRecord,
} from "@/lib/queries/admin";
import { Suspense } from "react";

interface AdminListingsListProps {
  tab: Exclude<AdminTab, "settings">;
  listings: AdminListingItem[] | DeletedListingRecord[];
  hasActiveFilters: boolean;
}

const EMPTY_COPY: Record<
  Exclude<AdminTab, "settings">,
  { title: string; description: string }
> = {
  pending: {
    title: "Gözləyən elan yoxdur",
    description: "Yeni elan göndərildikdə burada görünəcək.",
  },
  active: {
    title: "Aktiv elan yoxdur",
    description: "Təsdiqlənmiş elanlar burada siyahılanır.",
  },
  deleted: {
    title: "Silinmiş elan yoxdur",
    description: "Admin tərəfindən silinən elanlar burada saxlanılır.",
  },
};

export function AdminListingsList({
  tab,
  listings,
  hasActiveSearch,
}: AdminListingsListProps) {
  if (!isListingsAdminTab(tab)) return null;

  return (
    <>
      <Suspense fallback={null}>
        <AdminListingsFilters tab={tab} />
      </Suspense>

      {listings.length === 0 ? (
        <div className="empty-state admin-panel__empty">
          {hasActiveSearch ? (
            <>
              <h3>Nəticə tapılmadı</h3>
              <p>Axtarış sorğusuna uyğun elan tapılmadı.</p>
            </>
          ) : (
            <>
              <h3>{EMPTY_COPY[tab].title}</h3>
              <p>{EMPTY_COPY[tab].description}</p>
            </>
          )}
        </div>
      ) : (
        <div className="admin-list">
          {tab === "deleted"
            ? (listings as DeletedListingRecord[]).map((record) => (
                <AdminDeletedListingCard key={record.id} record={record} />
              ))
            : tab === "active"
              ? (listings as AdminListingItem[]).map((listing) => (
                  <AdminActiveListingCard key={listing.id} listing={listing} />
                ))
              : (listings as AdminListingItem[]).map((listing) => (
                  <PendingListingCard key={listing.id} listing={listing} />
                ))}
        </div>
      )}
    </>
  );
}
