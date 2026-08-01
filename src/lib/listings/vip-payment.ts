import { addCalendarDaysInBaku } from "@/lib/datetime/baku";
import type { VipPaymentStatus, VipPlan } from "@/types/database";

export type { VipPaymentStatus, VipPlan };

export const VIP_PLAN_DURATIONS: Record<VipPlan, { days: number; labelAz: string }> = {
  day: { days: 1, labelAz: "1 gün VIP" },
  week: { days: 7, labelAz: "1 həftə VIP" },
};

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
  return VIP_PLAN_DURATIONS[plan].labelAz;
}

export function vipExpiresAtFromPlan(plan: VipPlan, from = new Date()): Date {
  return addCalendarDaysInBaku(from, VIP_PLAN_DURATIONS[plan].days);
}

export function isVipCurrentlyActive(
  isVip: boolean,
  expiresAt?: string | null
): boolean {
  if (!isVip) return false;
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() > Date.now();
}
