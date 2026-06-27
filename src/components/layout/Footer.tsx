import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__logo">
              My<span>Room</span>
            </p>
            <p className="footer__tagline">{t("tagline")}</p>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{t("listingsTitle")}</h3>
            <div className="footer__links">
              <Link href="/search">{t("allListings")}</Link>
              <Link href="/search?category=a-frame">A-frame (Glamping)</Link>
              <Link href="/search?category=rayon-evi">{t("rayonHomes")}</Link>
            </div>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{t("legalTitle")}</h3>
            <div className="footer__links">
              <Link href="/terms">{t("terms")}</Link>
              <Link href="/privacy">{t("privacy")}</Link>
            </div>
          </div>
        </div>

        <p className="footer__copy">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
