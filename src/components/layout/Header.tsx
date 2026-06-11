import Link from "next/link";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          My<span>Room</span>
        </Link>
        <nav className="header__nav">
          <Link href="/search">Axtar</Link>
          <Link href="/search?category=a-frame">A-frame</Link>
          <Link href="/search?category=hostel">Hostel</Link>
        </nav>
        <HeaderActions user={user} fullName={fullName} />
      </div>
    </header>
  );
}
