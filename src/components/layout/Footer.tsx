import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__logo">
              My<span>Room</span>
            </p>
            <p className="footer__tagline">
              Azərbaycan üzrə qısamüddətli istirahət və günlük icarə elanları
            </p>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Elanlar</h3>
            <div className="footer__links">
              <Link href="/search">Bütün elanlar</Link>
              <Link href="/search?category=a-frame">A-frame (Glamping)</Link>
              <Link href="/search?category=rayon-evi">Rayon evləri</Link>
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">Hüquqi</h3>
            <div className="footer__links">
              <Link href="/terms">Şərtlər və qaydalar</Link>
              <Link href="/privacy">Məxfilik siyasəti</Link>
            </div>
          </div>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} MyRoom. Bütün hüquqlar qorunur.
        </p>
      </div>
    </footer>
  );
}
