"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { LISTINGS_CACHE_TAG } from "@/lib/queries/listings";
import { createClient } from "@/lib/supabase/server";

export async function approveListing(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  const markVip = formData.get("markVip") === "on";

  if (!listingId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "approved", is_vip: markVip })
    .eq("id", listingId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/pending");
  revalidatePath("/");
  revalidatePath("/search");
  revalidateTag(LISTINGS_CACHE_TAG);
}

export async function rejectListing(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  if (!listingId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/pending");
  revalidateTag(LISTINGS_CACHE_TAG);
}
