import type { ListingStatus } from "@/types/database";
import { LISTING_STATUS_LABELS } from "@/lib/listings/status";

const STATUS_CLASS: Record<ListingStatus, string> = {
  draft: "listing-status--draft",
  pending: "listing-status--pending",
  approved: "listing-status--approved",
  rejected: "listing-status--rejected",
};

interface ListingStatusBadgeProps {
  status: ListingStatus;
}

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
  return (
    <span className={`listing-status ${STATUS_CLASS[status]}`}>
      {LISTING_STATUS_LABELS[status]}
    </span>
  );
}
