import type { VipPaymentStatus, VipPlan } from "@/types/database";

export type { VipPaymentStatus, VipPlan };

export function parseRequestedVipPlan(
  value: string | null | undefined
): VipPlan | null {
  if (value === "day" || value === "week") return value;
  return null;
}

export function hasPaidVipPayment(status: VipPaymentStatus): boolean {
  return status === "paid";
}

export function vipPlanLabel(plan: VipPlan): string {
  return plan === "day" ? "1 gün VIP" : "1 həftə VIP";
}
