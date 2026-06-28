import { AdminActiveListingCard } from "@/components/admin/AdminActiveListingCard";
import { AdminDeletedListingCard } from "@/components/admin/AdminDeletedListingCard";
import { PendingListingCard } from "@/components/admin/PendingListingCard";
import type { AdminTab } from "@/lib/admin/tabs";
import type {
  AdminListingItem,
  DeletedListingRecord,
} from "@/lib/queries/admin";

interface AdminListingsListProps {
  tab: AdminTab;
  listings: AdminListingItem[] | DeletedListingRecord[];
}

const EMPTY_COPY: Record<
  AdminTab,
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

export function AdminListingsList({ tab, listings }: AdminListingsListProps) {
  if (listings.length === 0) {
    const copy = EMPTY_COPY[tab];
    return (
      <div className="empty-state admin-panel__empty">
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
      </div>
    );
  }

  return (
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
  );
}
