"use server";

import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ToggleFavoriteState {
  favorited?: boolean;
  error?: string;
}

export async function toggleFavorite(
  listingId: string
): Promise<ToggleFavoriteState> {
  const t = await getTranslations("favorites.errors");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t("authRequired") };
  }

  if (!listingId) {
    return { error: t("invalidListing") };
  }

  const { data: existing } = await supabase
    .from("listing_favorites")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("listing_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);

    if (error) {
      console.error("toggleFavorite remove:", error.message);
      return { error: t("updateFailed") };
    }

    revalidatePath("/dashboard/favorites");
    revalidatePath(`/listings/${listingId}`);
    return { favorited: false };
  }

  const { error } = await supabase.from("listing_favorites").insert({
    user_id: user.id,
    listing_id: listingId,
  });

  if (error) {
    console.error("toggleFavorite add:", error.message);
    return { error: t("updateFailed") };
  }

  revalidatePath("/dashboard/favorites");
  revalidatePath(`/listings/${listingId}`);
  return { favorited: true };
}
