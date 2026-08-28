"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SUBJECT_MAX = 120;
const BODY_MIN = 10;
const BODY_MAX = 2000;

export type SupportSubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Xəta mətnləri açar kimi qaytarılır ki, komponent onları istifadəçinin
 * dilinə tərcümə edə bilsin.
 */
export async function submitSupportMessage(
  formData: FormData
): Promise<SupportSubmitResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "unauthorized" };

  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!subject || subject.length > SUBJECT_MAX) {
    return { ok: false, error: "invalidSubject" };
  }
  if (body.length < BODY_MIN || body.length > BODY_MAX) {
    return { ok: false, error: "invalidBody" };
  }

  const { error } = await supabase.from("support_messages").insert({
    user_id: user.id,
    subject,
    body,
  });

  if (error) {
    console.error("submitSupportMessage:", error.message);
    return { ok: false, error: "failed" };
  }

  revalidatePath("/admin");
  return { ok: true };
}
