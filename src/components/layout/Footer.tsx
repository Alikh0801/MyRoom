import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import { getCategories } from "@/lib/queries/listings";

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const categories = await getCategories();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__logo">
              My<span>Room</span><span className="brand-az">AZ</span>
            </p>
            <p className="footer__tagline">{t("tagline")}</p>
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{t("listingsTitle")}</h3>
            <div className="footer__links">
              <Link href="/search">{t("allListings")}</Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/search?category=${category.slug}`}
                >
                  {getLocalizedName(category, locale)}
                </Link>
              ))}
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
