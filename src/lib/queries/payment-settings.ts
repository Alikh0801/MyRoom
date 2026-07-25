import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type PaymentSettings = {
  bank_name: string | null;
  card_number: string | null;
  cardholder_name: string | null;
};

export const PAYMENT_SETTINGS_CACHE_TAG = "payment-settings";

export const getPaymentSettings = unstable_cache(
  async (): Promise<PaymentSettings> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_payment_settings")
      .select("bank_name, card_number, cardholder_name")
      .eq("id", 1)
      .maybeSingle();

    return {
      bank_name: data?.bank_name ?? null,
      card_number: data?.card_number ?? null,
      cardholder_name: data?.cardholder_name ?? null,
    };
  },
  ["payment-settings"],
  { revalidate: 300, tags: [PAYMENT_SETTINGS_CACHE_TAG] }
);

export function hasConfiguredPaymentCard(settings: PaymentSettings): boolean {
  return Boolean(settings.card_number?.trim());
}

export async function updatePaymentSettings(input: {
  bankName: string;
  cardNumber: string;
  cardholderName: string;
  adminId: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_payment_settings")
    .update({
      bank_name: input.bankName || null,
      card_number: input.cardNumber,
      cardholder_name: input.cardholderName || null,
      updated_at: new Date().toISOString(),
      updated_by: input.adminId,
    })
    .eq("id", 1);

  if (error) return { error: error.message };
  return {};
}
