"use client";

import { useEffect } from "react";
import { recordListingView } from "@/lib/listings/view-actions";

interface RecordListingViewProps {
  listingId: string;
}

export function RecordListingView({ listingId }: RecordListingViewProps) {
  useEffect(() => {
    if (!listingId || typeof window === "undefined") return;

    const storageKey = `myroom:viewed:${listingId}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage əlçatmazdırsa yenə də cəhd et
    }

    void recordListingView(listingId);
  }, [listingId]);

  return null;
}
