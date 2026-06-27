import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { localizedRedirect } from "@/lib/i18n/server-redirect";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) await localizedRedirect("/auth/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role !== "admin") await localizedRedirect("/");

  return user!;
}

export const isAdminUser = cache(async (userId: string): Promise<boolean> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role === "admin";
});
