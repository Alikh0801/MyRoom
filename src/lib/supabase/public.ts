import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Cookie tələb etməyən client — cache edilə bilən ictimai sorğular üçün */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
