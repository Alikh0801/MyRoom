"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { parseRequestedVipPlan } from "@/lib/listings/vip-payment";
import { LISTINGS_CACHE_TAG } from "@/lib/queries/listings";
import { getPublicUrl } from "@/lib/storage/s3";
import { createClient } from "@/lib/supabase/server";
import type { VipPlan } from "@/types/database";

export type VipRequestState = {
  error?: string;
  success?: string;
} | null;

export async function attachVipReceipt(
  listingId: string,
  storagePath: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Giriş tələb olunur." };

  const expectedPrefix = `${user.id}/${listingId}/`;
  if (!storagePath.startsWith(expectedPrefix)) {
    return { error: "Yanlış fayl yolu." };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, is_vip, vip_payment_status")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!listing) return { error: "Elan tapılmadı." };
  if (listing.is_vip || listing.vip_payment_status === "paid") {
    return { error: "Bu elan artıq VIP-dir." };
  }

  const { error } = await supabase
    .from("listings")
    .update({
      vip_payment_receipt_url: getPublicUrl(storagePath),
      vip_payment_receipt_path: storagePath,
    })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };
  return {};
}

export async function requestListingVip(
  _prev: VipRequestState,
  formData: FormData
): Promise<VipRequestState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Giriş tələb olunur." };

  const listingId = formData.get("listingId") as string;
  const plan = parseRequestedVipPlan(formData.get("premiumPlan") as string);
  const storagePath = (formData.get("receiptStoragePath") as string)?.trim();

  if (!listingId || !plan) {
    return { error: "VIP paketi seçin." };
  }

  if (!storagePath) {
    return { error: "Ödəniş çeki yükləyin." };
  }

  const expectedPrefix = `${user.id}/${listingId}/`;
  if (!storagePath.startsWith(expectedPrefix)) {
    return { error: "Yanlış fayl yolu." };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, status, is_vip, vip_payment_status")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!listing) return { error: "Elan tapılmadı." };
  if (listing.status !== "approved" && listing.status !== "pending") {
    return { error: "Bu elan üçün VIP sorğusu göndərilə bilməz." };
  }
  if (listing.is_vip || listing.vip_payment_status === "paid") {
    return { error: "Bu elan artıq VIP-dir." };
  }

  const { error } = await supabase
    .from("listings")
    .update({
      requested_vip_plan: plan,
      vip_payment_status: "pending",
      vip_payment_receipt_url: getPublicUrl(storagePath),
      vip_payment_receipt_path: storagePath,
    })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  revalidatePath("/admin");
  revalidateTag(LISTINGS_CACHE_TAG);

  return { success: "VIP sorğusu göndərildi. Admin ödəniş çeki yoxlayacaq." };
}

export type { VipPlan };
