import { createClient } from "@supabase/supabase-js";

/**
 * RLS-i keçən (bypass edən) service-role client. Yalnız etibarlı server
 * kodunda işlədilməlidir (məs. bank ödəniş callback-i VIP statusunu təsdiq
 * edərkən) — heç vaxt istifadəçi sorğusundan gələn məlumatla birbaşa
 * çağırılmamalıdır.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase service-role konfiqurasiyası yoxdur (SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
