import { NextResponse, type NextRequest } from "next/server";
import { getKapitalOrderStatus } from "@/lib/payments/kapital-client";
import { markVipOrderFailed, markVipOrderPaid } from "@/lib/payments/vip";
import { getSiteUrl } from "@/lib/seo";
import { createServiceClient } from "@/lib/supabase/service";
import { routing, type Locale } from "@/i18n/routing";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import type { VipPlan } from "@/types/database";

type RouteParams = { params: Promise<{ locale: string }> };

function resultRedirect(locale: Locale, listingId: string | null, outcome: "success" | "failed") {
  const path = withLocalePrefix("/dashboard/listings", locale);
  const url = new URL(`${getSiteUrl()}${path}`);
  url.searchParams.set("vip", outcome);
  if (listingId) url.searchParams.set("listingId", listingId);
  return NextResponse.redirect(url);
}

/**
 * Kapital Bank ödəniş səhifəsindən geri qayıdışda çağırılır. Sənədə görə
 * bankın göndərdiyi STATUS query parametri müvəqqəti ola bilər — status
 * mütləq GET /order/{ID} ilə təsdiqlənməlidir, callback parametrinə etibar
 * edilmir.
 *
 * Service-role client işlədilir: bank yönləndirməsi zamanı istifadəçinin
 * sessiya kukiləri itmiş ola bilər (məs. bank ödənişi ayrı brauzer/tətbiq
 * pəncərəsində açırsa) — ödənişin təsdiqlənməsi istifadəçi sessiyasından
 * asılı olmamalıdır.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { locale: localeParam } = await params;
  const locale = routing.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : routing.defaultLocale;

  const bankOrderId = request.nextUrl.searchParams.get("ID");
  if (!bankOrderId) {
    return resultRedirect(locale, null, "failed");
  }

  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from("vip_payment_orders")
    .select("listing_id, plan, status")
    .eq("bank_order_id", bankOrderId)
    .maybeSingle();

  if (!order) {
    return resultRedirect(locale, null, "failed");
  }

  if (order.status === "paid") {
    return resultRedirect(locale, order.listing_id, "success");
  }

  try {
    const bankStatus = await getKapitalOrderStatus(bankOrderId);

    if (bankStatus.status === "FullyPaid") {
      const result = await markVipOrderPaid(
        bankOrderId,
        order.listing_id,
        order.plan as VipPlan
      );
      if (result.error) {
        console.error("kapital callback markVipOrderPaid:", result.error);
        return resultRedirect(locale, order.listing_id, "failed");
      }
      return resultRedirect(locale, order.listing_id, "success");
    }

    await markVipOrderFailed(bankOrderId, order.listing_id);
    return resultRedirect(locale, order.listing_id, "failed");
  } catch (err) {
    console.error("kapital callback:", err);
    return resultRedirect(locale, order.listing_id, "failed");
  }
}
