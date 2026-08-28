"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function markSupportMessageRead(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) throw new Error("Müraciət tapılmadı.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("support_messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
