import Link from "next/link";

export function Header() {
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
        <div className="header__actions">
          <Link href="/auth/login" className="btn btn--ghost">
            Daxil ol
          </Link>
          <Link href="/dashboard/listings/new" className="btn btn--primary">
            Elan yerləşdir
          </Link>
        </div>
      </div>
    </header>
  );
}
