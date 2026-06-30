import { Link } from "@/i18n/navigation";

export function HeaderShell() {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__start">
          <Link href="/" className="header__logo">
            My<span>Room</span>
          </Link>
          <span className="header__skeleton-pill" aria-hidden="true" />
        </div>
        <div className="header__actions header__actions--skeleton" aria-hidden="true">
          <span className="theme-toggle theme-toggle--placeholder" aria-hidden="true" />
          <span className="header__skeleton-avatar" />
        </div>
      </div>
    </header>
  );
}
