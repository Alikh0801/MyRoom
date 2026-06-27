"use client";

import { useTranslations } from "next-intl";
import type { ListingStatus } from "@/types/database";

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
  const t = useTranslations("dashboard.status");

  return (
    <span className={`listing-status ${STATUS_CLASS[status]}`}>
      {t(status)}
    </span>
  );
}
