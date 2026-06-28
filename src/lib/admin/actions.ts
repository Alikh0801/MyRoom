"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { hasPaidVipPayment } from "@/lib/listings/vip-payment";
import { LISTINGS_CACHE_TAG } from "@/lib/queries/listings";
import { createClient } from "@/lib/supabase/server";
import type { VipPaymentStatus } from "@/types/database";

const MIN_REASON_LENGTH = 10;

const DELETION_SNAPSHOT_SELECT = `
  id, title, city, region, price_per_night, price_unit, currency,
  category:categories(name_az),
  owner:profiles!listings_owner_id_fkey(full_name),
  listing_images(url, is_cover, sort_order)
`;

function revalidateListingPaths(listingId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/pending");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/dashboard/listings");
  if (listingId) {
    revalidatePath(`/listings/${listingId}`);
  }
  revalidateTag(LISTINGS_CACHE_TAG);
}

function validateReason(reason: string | undefined, label: string) {
  if (!reason || reason.length < MIN_REASON_LENGTH) {
    throw new Error(`${label} ən azı ${MIN_REASON_LENGTH} simvol olmalıdır.`);
  }
}

export async function approveListing(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;

  if (!listingId) return;

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("vip_payment_status")
    .eq("id", listingId)
    .eq("status", "pending")
    .maybeSingle();

  if (!listing) return;

  const { error } = await supabase
    .from("listings")
    .update({
      status: "approved",
      is_vip: hasPaidVipPayment(
        (listing.vip_payment_status ?? "none") as VipPaymentStatus
      ),
      rejection_reason: null,
    })
    .eq("id", listingId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  await supabase
    .from("listing_deletion_log")
    .delete()
    .eq("listing_id", listingId);

  revalidateListingPaths(listingId);
}

export async function deleteListingAsAdmin(formData: FormData) {
  const admin = await requireAdmin();

  const listingId = formData.get("listingId") as string;
  const deleteReason = (formData.get("deleteReason") as string)?.trim();

  if (!listingId) return;

  validateReason(deleteReason, "Silinmə səbəbi");

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select(DELETION_SNAPSHOT_SELECT)
    .eq("id", listingId)
    .maybeSingle();

  if (!listing) return;

  const images = (listing.listing_images ?? []) as {
    url: string;
    is_cover: boolean;
    sort_order: number;
  }[];
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.sort_order - b.sort_order;
  });

  const category = Array.isArray(listing.category)
    ? listing.category[0]
    : listing.category;
  const owner = Array.isArray(listing.owner) ? listing.owner[0] : listing.owner;

  const { error: logError } = await supabase.from("listing_deletion_log").insert({
    listing_id: listingId,
    title: listing.title,
    city: listing.city,
    region: listing.region,
    price_per_night: listing.price_per_night,
    price_unit: listing.price_unit,
    currency: listing.currency,
    category_name_az: category?.name_az ?? null,
    owner_name: owner?.full_name ?? null,
    cover_image_url: sorted[0]?.url ?? null,
    delete_reason: deleteReason,
    deleted_by: admin.id,
  });

  if (logError) {
    console.error("listing_deletion_log insert:", logError.message);
  }

  const { error } = await supabase
    .from("listings")
    .update({
      status: "rejected",
      is_vip: false,
      rejection_reason: deleteReason,
    })
    .eq("id", listingId);

  if (error) throw new Error(error.message);

  revalidateListingPaths(listingId);
}
