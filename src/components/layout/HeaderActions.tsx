"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthMenu } from "@/components/layout/AuthMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { UserMenu } from "@/components/layout/UserMenu";
import { SupportButton } from "@/components/support/SupportButton";
import { SupportModal } from "@/components/support/SupportModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface HeaderActionsProps {
  user: { email?: string } | null;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin?: boolean;
}

export function HeaderActions({
  user,
  fullName,
  avatarUrl,
  isAdmin = false,
}: HeaderActionsProps) {
  const t = useTranslations("nav");
  const [supportOpen, setSupportOpen] = useState(false);

  if (!user) {
    return (
      <div className="header__actions">
        <ThemeToggle />
        <SupportButton isLoggedIn={false} />
        <LanguageSwitcher variant="mobile" />
        <LanguageSwitcher variant="desktop" />
        <div className="header__auth-desktop">
          <Link href="/auth/login" className="btn btn--ghost btn--header">
            {t("login")}
          </Link>
          <Link href="/auth/register" className="btn btn--primary btn--header">
            {t("register")}
          </Link>
        </div>
        <AuthMenu />
      </div>
    );
  }

  const showSupport = !isAdmin;

  return (
    <div className="header__actions">
      <ThemeToggle />
      {showSupport && (
        <SupportButton isLoggedIn onOpen={() => setSupportOpen(true)} />
      )}
      <LanguageSwitcher variant="mobile" />
      <LanguageSwitcher variant="desktop" />
      <Link
        href="/dashboard/listings/new"
        className="btn btn--primary btn--header header__cta"
      >
        <span className="header__cta-full">{t("postListing")}</span>
        <span className="header__cta-short">{t("postListingShort")}</span>
      </Link>
      <UserMenu
        fullName={fullName}
        email={user.email}
        avatarUrl={avatarUrl}
        isAdmin={isAdmin}
        onSupportClick={showSupport ? () => setSupportOpen(true) : undefined}
      />

      {/* Modal menyudan kənarda saxlanılır ki, menyu bağlananda yox olmasın */}
      {showSupport && (
        <SupportModal
          open={supportOpen}
          onClose={() => setSupportOpen(false)}
        />
      )}
    </div>
  );
}
