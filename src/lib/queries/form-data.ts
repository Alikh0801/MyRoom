import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";
import { getAmenitiesGrouped } from "@/lib/queries/amenities";

export { getAmenitiesGrouped };

export async function getCategoriesForForm(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getProfileContact(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("phone, whatsapp_phone")
    .eq("id", userId)
    .single();
  return data;
}
