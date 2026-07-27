import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  CARD_SELECT,
  LISTINGS_CACHE_TAG,
  LISTINGS_REVALIDATE_SECONDS,
  mapToListingCards,
  type ListingRow,
} from "@/lib/queries/listings";
import type { ListingCardData } from "@/types/database";

export interface OwnerPublicProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const getOwnerPublicProfileCached = unstable_cache(
  async (ownerId: string): Promise<OwnerPublicProfile | null> => {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", ownerId)
      .maybeSingle();

    if (error) {
      console.error("getOwnerPublicProfile:", error.message);
      return null;
    }

    return data;
  },
  ["owner-public-profile"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export async function getOwnerPublicProfile(
  ownerId: string
): Promise<OwnerPublicProfile | null> {
  return getOwnerPublicProfileCached(ownerId);
}

const getOwnerApprovedListingsCached = unstable_cache(
  async (ownerId: string): Promise<ListingCardData[]> => {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("listings")
      .select(CARD_SELECT)
      .eq("owner_id", ownerId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getOwnerApprovedListings:", error.message);
      return [];
    }

    return mapToListingCards((data ?? []) as ListingRow[]);
  },
  ["owner-approved-listings"],
  { revalidate: LISTINGS_REVALIDATE_SECONDS, tags: [LISTINGS_CACHE_TAG] }
);

export async function getOwnerApprovedListings(
  ownerId: string
): Promise<ListingCardData[]> {
  return getOwnerApprovedListingsCached(ownerId);
}
