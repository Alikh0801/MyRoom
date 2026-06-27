import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface HeaderAuth {
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string;
  } | null;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

/** Header üçün — eyni request daxilində təkrar sorğu göndərilmir */
export const getHeaderAuth = cache(async (): Promise<HeaderAuth> => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  if (!user) {
    return { user: null, fullName: null, avatarUrl: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  return {
    user,
    fullName: profile?.full_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    isAdmin: profile?.role === "admin",
  };
});
