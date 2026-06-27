import { HeaderActions } from "@/components/layout/HeaderActions";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { getHeaderAuth } from "@/lib/auth/session";

export async function Header() {
  const { user, fullName, avatarUrl, isAdmin } = await getHeaderAuth();

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
