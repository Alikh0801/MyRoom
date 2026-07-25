"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  PAYMENT_SETTINGS_CACHE_TAG,
  updatePaymentSettings,
} from "@/lib/queries/payment-settings";

export type PaymentSettingsState = {
  error?: string;
  success?: string;
} | null;

export async function savePaymentSettings(
  _prev: PaymentSettingsState,
  formData: FormData
): Promise<PaymentSettingsState> {
  const admin = await requireAdmin();

  const bankName = (formData.get("bankName") as string)?.trim() ?? "";
  const cardNumber = (formData.get("cardNumber") as string)?.trim() ?? "";
  const cardholderName =
    (formData.get("cardholderName") as string)?.trim() ?? "";

  if (!cardNumber || cardNumber.replace(/\s/g, "").length < 8) {
    return { error: "Kart nömrəsi düzgün daxil edilməyib." };
  }

  const result = await updatePaymentSettings({
    bankName,
    cardNumber,
    cardholderName,
    adminId: admin.id,
  });

  if (result.error) {
    return { error: result.error };
  }

  revalidateTag(PAYMENT_SETTINGS_CACHE_TAG);
  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  revalidatePath("/dashboard/listings");
  revalidatePath("/dashboard/listings/new");

  return { success: "Bank kartı məlumatları yadda saxlanıldı." };
}
