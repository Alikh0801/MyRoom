import Link from "next/link";
import { UserMenu } from "@/components/layout/UserMenu";

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
  if (!user) {
    return (
      <div className="header__actions">
        <Link href="/auth/login" className="btn btn--ghost btn--header">
          Daxil ol
        </Link>
        <Link href="/auth/register" className="btn btn--primary btn--header">
          Qeydiyyat
        </Link>
      </div>
    );
  }

  return (
    <div className="header__actions">
      <Link
        href="/dashboard/listings/new"
        className="btn btn--primary btn--header header__cta"
      >
        <span className="header__cta-full">+ Elan yerləşdir</span>
        <span className="header__cta-short">+ Elan</span>
      </Link>
      <UserMenu
        fullName={fullName}
        email={user.email}
        avatarUrl={avatarUrl}
        isAdmin={isAdmin}
      />
    </div>
  );
}
