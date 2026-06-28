"use server";

import { createClient } from "@/lib/supabase/server";
import type { VipPlan } from "@/types/database";

/**
 * Ödəniş sistemi uğurla tamamlandıqda çağırılır.
 */
export async function markListingVipPaymentPaid(
  listingId: string,
  plan: VipPlan
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("listings")
    .update({
      requested_vip_plan: plan,
      vip_payment_status: "paid",
    })
    .eq("id", listingId)
    .in("status", ["pending", "draft"]);

  if (error) {
    return { error: error.message };
  }

  return {};
}
