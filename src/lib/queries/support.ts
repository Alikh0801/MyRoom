import { createClient } from "@/lib/supabase/server";

export interface SupportMessageItem {
  id: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
}

const SELECT = `
  id, subject, body, is_read, created_at,
  user:profiles!support_messages_user_id_fkey(full_name, email, phone, whatsapp_phone)
`;

type Row = {
  id: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  user:
    | { full_name: string | null; email: string | null; phone: string | null; whatsapp_phone: string | null }
    | { full_name: string | null; email: string | null; phone: string | null; whatsapp_phone: string | null }[]
    | null;
};

export async function getSupportMessages(): Promise<SupportMessageItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_messages")
    .select(SELECT)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("getSupportMessages:", error.message);
    return [];
  }

  return ((data ?? []) as Row[]).map((row) => {
    const user = Array.isArray(row.user) ? row.user[0] : row.user;

    return {
      id: row.id,
      subject: row.subject,
      body: row.body,
      isRead: row.is_read,
      createdAt: row.created_at,
      userName: user?.full_name ?? null,
      userEmail: user?.email ?? null,
      userPhone: user?.phone ?? user?.whatsapp_phone ?? null,
    };
  });
}

export async function getUnreadSupportCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("support_messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadSupportCount:", error.message);
    return 0;
  }

  return count ?? 0;
}
