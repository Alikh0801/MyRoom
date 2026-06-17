import type { ListingStatus } from "@/types/database";

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  draft: "Qaralama",
  pending: "Gözləyir",
  approved: "Təsdiqlənib",
  rejected: "Rədd edilib",
};

export const LISTING_STATUS_HINTS: Record<ListingStatus, string> = {
  draft: "Elan hələ tamamlanmayıb.",
  pending: "Admin təsdiqini gözləyir.",
  approved: "Elan saytda görünür.",
  rejected: "Elan rədd edilib. Düzəliş edib yenidən göndərə bilərsiniz.",
};

export function isListingStatus(value: string): value is ListingStatus {
  return ["draft", "pending", "approved", "rejected"].includes(value);
}
