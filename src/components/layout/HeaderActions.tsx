import Link from "next/link";
import { signOut } from "@/lib/auth/actions";

interface HeaderActionsProps {
  user: { email?: string } | null;
  fullName: string | null;
}

export function HeaderActions({ user, fullName }: HeaderActionsProps) {
  if (!user) {
    return (
      <div className="header__actions">
        <Link href="/auth/login" className="btn btn--ghost">
          Daxil ol
        </Link>
        <Link href="/auth/register" className="btn btn--primary">
          Qeydiyyat
        </Link>
      </div>
    );
  }

  const displayName = fullName ?? user.email ?? "Hesab";

  return (
    <div className="header__actions">
      <Link href="/dashboard" className="header__user">
        {displayName}
      </Link>
      <Link href="/dashboard/listings/new" className="btn btn--primary">
        Elan yerləşdir
      </Link>
      <form action={signOut}>
        <button type="submit" className="btn btn--ghost">
          Çıxış
        </button>
      </form>
    </div>
  );
}
