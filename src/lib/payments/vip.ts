"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";
import { createKapitalOrder } from "@/lib/payments/kapital-client";
import {
  parseRequestedVipPlan,
  vipExpiresAtFromPlan,
  VIP_PLAN_PRICE_AZN,
} from "@/lib/listings/vip-payment";
import { LISTINGS_CACHE_TAG } from "@/lib/queries/listings";
import { getSiteUrl } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { VipPlan } from "@/types/database";

export type VipCheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string };

/**
 * VIP planı üçün Kapital Bank-da ödəniş sifarişi yaradır və istifadəçinin
 * yönləndiriləcəyi bank ödəniş səhifəsinin URL-ini qaytarır.
 */
export async function createVipCheckout(
  listingId: string,
  planRaw: string
): Promise<VipCheckoutResult> {
  const plan = parseRequestedVipPlan(planRaw);
  if (!listingId || !plan) {
    return { ok: false, error: "VIP paketi seçin." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Giriş tələb olunur." };

  const { data: listing } = await supabase
    .from("listings")
    .select("id, is_vip, vip_payment_status")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!listing) return { ok: false, error: "Elan tapılmadı." };
  if (listing.is_vip) return { ok: false, error: "Bu elan artıq VIP-dir." };

  const amount = VIP_PLAN_PRICE_AZN[plan];
  const locale = await getLocale();

  // Bank callback URL-inə öz "?ID=...&STATUS=..." parametrlərini necə əlavə
  // etdiyi sənəddə dəqiq göstərilmir (nümunə sadə birləşdirmədir) — URL-də
  // artıq "?" olması qırıq keçid yarada bilər. Ona görə query string
  // işlətmirik: dili path seqmentinə qoyuruq, elanı isə callback-də bankın
  // qaytardığı sifariş ID-sindən öz vip_payment_orders qeydimizlə taparıq.
  const hppRedirectUrl = `${getSiteUrl()}/api/payments/kapital/callback/${locale}`;

  let order;
  try {
    order = await createKapitalOrder({
      amount: amount.toFixed(2),
      currency: "AZN",
      description: `VIP (${plan === "day" ? "1 gün" : "1 həftə"}) — elan #${listingId.slice(0, 8)}`,
      language: locale,
      hppRedirectUrl,
    });
  } catch (err) {
    console.error("createVipCheckout:", err);
    return { ok: false, error: "Ödəniş sistemi ilə əlaqə qurulmadı. Bir azdan yenidən cəhd edin." };
  }

  const { error: insertError } = await supabase
    .from("vip_payment_orders")
    .insert({
      listing_id: listingId,
      owner_id: user.id,
      plan,
      amount,
      currency: "AZN",
      bank_order_id: String(order.id),
      status: "preparing",
    });

  if (insertError) {
    console.error("createVipCheckout insert:", insertError.message);
    return { ok: false, error: "Sifariş qeydə alınmadı." };
  }

  await supabase
    .from("listings")
    .update({ requested_vip_plan: plan, vip_payment_status: "pending" })
    .eq("id", listingId)
    .eq("owner_id", user.id);

  // QEYD: Sənəddəki "URL nümunəsi" {{hppUrl}}/flex?id=...&password=... kimi
  // göstərilib, amma sənədin öz nümunə cavabında hppUrl artıq "/flex" ilə
  // bitir (məs. "https://txpgtst.kapitalbank.az/flex") — şablonu olduğu kimi
  // izləsək "/flex/flex" kimi qırıq URL yaranır. Bunu sənədləşmə uyğunsuzluğu
  // sayıb hppUrl-i tam URL kimi qəbul edirik, yalnız query əlavə edirik.
  // BU, real bank cavabı ilə TƏSDİQLƏNMƏYİB (bu mühitdən bankın şəbəkəsinə
  // çıxış yoxdur) — ilk test ödənişində mütləq yoxlanılmalıdır.
  const redirectUrl = order.hppUrl.includes("?")
    ? `${order.hppUrl}&id=${order.id}&password=${order.password}`
    : `${order.hppUrl}?id=${order.id}&password=${order.password}`;

  return { ok: true, redirectUrl };
}

/**
 * Bank callback-i uğurlu ödənişi təsdiqlədikdə çağırılır. VIP statusunu
 * (is_vip, vip_expires_at) yalnız admin dəyişə bilər (bax:
 * listings_protect_workflow trigger) — burada callback sahibin öz
 * sessiyası ilə işlədiyi üçün RLS-i keçən service-role client lazımdır.
 */
export async function markVipOrderPaid(
  bankOrderId: string,
  listingId: string,
  plan: VipPlan
): Promise<{ error?: string }> {
  const supabase = createServiceClient();

  const { error: orderError } = await supabase
    .from("vip_payment_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("bank_order_id", bankOrderId);

  if (orderError) return { error: orderError.message };

  const { error } = await supabase
    .from("listings")
    .update({
      is_vip: true,
      vip_payment_status: "paid",
      vip_expires_at: vipExpiresAtFromPlan(plan).toISOString(),
    })
    .eq("id", listingId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/listings");
  revalidatePath("/admin");
  revalidatePath(`/listings/${listingId}`);
  revalidateTag(LISTINGS_CACHE_TAG);

  return {};
}

export async function markVipOrderFailed(
  bankOrderId: string,
  listingId: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("vip_payment_orders")
    .update({ status: "failed" })
    .eq("bank_order_id", bankOrderId);

  // Sıfırlayırıq ki, sahib yenidən cəhd etsin — əks halda dashboard "pending"
  // vəziyyətdə donmuş görünər.
  await supabase
    .from("listings")
    .update({ vip_payment_status: "none", requested_vip_plan: null })
    .eq("id", listingId)
    .eq("vip_payment_status", "pending");
}
