"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateTimeInBaku } from "@/lib/datetime/baku";
import { sendEmail } from "@/lib/email/client";
import { listingApprovedEmail } from "@/lib/email/templates/listing-approved";
import {
  parseRequestedVipPlan,
  vipExpiresAtFromPlan,
} from "@/lib/listings/vip-payment";
import { LISTINGS_CACHE_TAG } from "@/lib/queries/listings";
import { createClient } from "@/lib/supabase/server";

const MIN_REASON_LENGTH = 10;

/**
 * Supabase əlaqəli (embedded) sahəni bəzən obyekt, bəzən massiv kimi qaytarır —
 * hər iki halda e-poçtu çıxarırıq.
 */
function normalizeOwnerEmail(owner: unknown): string | null {
  const record = Array.isArray(owner) ? owner[0] : owner;
  const email = (record as { email?: string | null } | null)?.email;
  return email?.trim() ? email.trim() : null;
}

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
  const vipPlan = parseRequestedVipPlan(formData.get("activateVip") as string);

  if (!listingId) return;

  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("id, title, owner:profiles!listings_owner_id_fkey(email)")
    .eq("id", listingId)
    .eq("status", "pending")
    .maybeSingle();

  if (!listing) return;

  const updatePayload: Record<string, unknown> = {
    status: "approved",
    rejection_reason: null,
  };

  if (vipPlan) {
    updatePayload.is_vip = true;
    updatePayload.requested_vip_plan = vipPlan;
    updatePayload.vip_payment_status = "paid";
    updatePayload.vip_expires_at = vipExpiresAtFromPlan(vipPlan).toISOString();
  } else {
    updatePayload.is_vip = false;
    updatePayload.vip_expires_at = null;
  }

  const { error } = await supabase
    .from("listings")
    .update(updatePayload)
    .eq("id", listingId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  await supabase
    .from("listing_deletion_log")
    .delete()
    .eq("listing_id", listingId);

  // Sahibə bildiriş göndəririk. sendEmail xəta atmır və nəticəsi burada
  // yoxlanılmır — poçt xidməti işləməsə belə elan təsdiqlənmiş qalmalıdır.
  const ownerEmail = normalizeOwnerEmail(listing.owner);

  if (ownerEmail) {
    const { subject, html } = listingApprovedEmail({
      listingTitle: listing.title ?? "",
      listingId,
      vipUntil: vipPlan
        ? formatDateTimeInBaku(vipExpiresAtFromPlan(vipPlan).toISOString())
        : null,
    });

    await sendEmail({ to: ownerEmail, subject, html });
  }

  revalidateListingPaths(listingId);
}

export async function setListingVip(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  const plan = parseRequestedVipPlan(formData.get("vipPlan") as string);

  if (!listingId || !plan) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({
      is_vip: true,
      requested_vip_plan: plan,
      vip_payment_status: "paid",
      vip_expires_at: vipExpiresAtFromPlan(plan).toISOString(),
    })
    .eq("id", listingId)
    .eq("status", "approved");

  if (error) throw new Error(error.message);

  revalidateListingPaths(listingId);
}

export async function removeListingVip(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  if (!listingId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({
      is_vip: false,
      vip_expires_at: null,
      vip_payment_status: "none",
    })
    .eq("id", listingId);

  if (error) throw new Error(error.message);

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
      vip_expires_at: null,
      rejection_reason: deleteReason,
    })
    .eq("id", listingId);

  if (error) throw new Error(error.message);

  revalidateListingPaths(listingId);
}

const MAX_VIEW_BOOST = 100_000;

export async function boostListingViews(formData: FormData) {
  await requireAdmin();

  const listingId = formData.get("listingId") as string;
  const amountRaw = Number(formData.get("amount"));

  if (!listingId || !Number.isFinite(amountRaw)) return;

  const amount = Math.floor(amountRaw);
  if (amount < 1 || amount > MAX_VIEW_BOOST) {
    throw new Error(`Baxış sayı 1–${MAX_VIEW_BOOST} arasında olmalıdır.`);
  }

  const supabase = await createClient();

  const { data: listing, error: fetchError } = await supabase
    .from("listings")
    .select("view_count")
    .eq("id", listingId)
    .eq("status", "approved")
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);
  if (!listing) return;

  const nextCount = (listing.view_count ?? 0) + amount;

  const { error } = await supabase
    .from("listings")
    .update({ view_count: nextCount })
    .eq("id", listingId)
    .eq("status", "approved");

  if (error) throw new Error(error.message);

  revalidateListingPaths(listingId);
}
