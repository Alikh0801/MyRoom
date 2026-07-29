"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordListingView(listingId: string) {
  if (!listingId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("owner_id, status")
    .eq("id", listingId)
    .maybeSingle();

  if (listingError || !listing || listing.status !== "approved") return;

  // Sahibin öz elanına baxması sayılmasın
  if (user && user.id === listing.owner_id) return;

  const { error } = await supabase.rpc("increment_listing_view_count", {
    p_listing_id: listingId,
  });

  if (error) {
    console.error("recordListingView:", error.message);
  }
}
