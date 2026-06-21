import Link from "next/link";

export function HeaderShell() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          My<span>Room</span>
        </Link>
        <div className="header__actions header__actions--skeleton" aria-hidden="true">
          <span className="header__skeleton-btn" />
          <span className="header__skeleton-avatar" />
        </div>
      </div>
    </header>
  );
}
