import { getTranslations } from "next-intl/server";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { HEADER_NAV_LINKS } from "@/components/layout/nav-links";
import { Link } from "@/i18n/navigation";
import { getHeaderAuth } from "@/lib/auth/session";

export async function Header() {
  const { user, fullName, avatarUrl, isAdmin } = await getHeaderAuth();
  const t = await getTranslations("nav");

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__start">
          <Link href="/" className="header__logo">
            My<span>Room</span><span className="brand-az">AZ</span>
          </Link>
        </div>

        {/* Mobildə gizlidir — orada eyni keçidlər hesab menyusundadır */}
        <nav className="header__nav" aria-label={t("mainNav")}>
          {HEADER_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="header__nav-link">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
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
