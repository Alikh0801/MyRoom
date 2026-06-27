import { Link } from "@/i18n/navigation";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  let fullName: string | null = null;
  let avatarUrl: string | null = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, avatar_url")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
    avatarUrl = profile?.avatar_url ?? null;
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__start">
          <Link href="/" className="header__logo">
            My<span>Room</span>
          </Link>
          <LanguageSwitcher variant="mobile" />
        </div>
        <HeaderActions
          user={user}
          fullName={fullName}
          avatarUrl={avatarUrl}
          isAdmin={isAdmin}
        />
      </div>
    </header>
  );
}
