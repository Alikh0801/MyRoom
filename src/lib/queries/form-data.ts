import type { Category } from "@/types/database";
import { getAmenitiesGrouped } from "@/lib/queries/amenities";
import { getCategories } from "@/lib/queries/listings";
import { createClient } from "@/lib/supabase/server";

export { getAmenitiesGrouped };

export async function getCategoriesForForm(): Promise<Category[]> {
  return getCategories();
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
