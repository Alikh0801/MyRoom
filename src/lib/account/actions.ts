"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { normalizePhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export interface AccountState {
  error?: string;
  success?: string;
}

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 80;

export async function updateAccount(
  _prev: AccountState | null,
  formData: FormData
): Promise<AccountState> {
  const t = await getTranslations("account");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: t("errors.authRequired") };

  const fullName = (formData.get("fullName") as string)?.trim() ?? "";
  const phoneRaw = (formData.get("phone") as string)?.trim() ?? "";
  const sameAsPhone = formData.get("whatsappSameAsPhone") === "on";
  const whatsappRaw = sameAsPhone
    ? phoneRaw
    : ((formData.get("whatsappPhone") as string)?.trim() ?? "");

  if (fullName.length < MIN_NAME_LENGTH || fullName.length > MAX_NAME_LENGTH) {
    return { error: t("errors.invalidName") };
  }

  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return { error: t("errors.invalidPhone") };
  }

  const whatsappPhone = normalizePhone(whatsappRaw);
  if (!whatsappPhone) {
    return { error: t("errors.invalidWhatsapp") };
  }

  // Nömrə qeydiyyatda unikaldır — profil dəyişikliyində də eyni qayda
  // tətbiq olunmalıdır, yoxsa iki hesab eyni nömrəni daşıya bilər.
  const { data: phoneOwner } = await supabase
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .neq("id", user.id)
    .maybeSingle();

  if (phoneOwner) {
    return { error: t("errors.phoneTaken") };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone, whatsapp_phone: whatsappPhone })
    .eq("id", user.id);

  if (error) {
    console.error("updateAccount:", error.message);
    return { error: t("errors.updateFailed") };
  }

  revalidatePath("/dashboard/account");

  return { success: t("saved") };
}
