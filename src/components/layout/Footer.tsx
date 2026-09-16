import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getLocalizedName } from "@/lib/i18n/localized-name";
import { getCategories } from "@/lib/queries/listings";
import { formatSitePhone, getSiteSettings } from "@/lib/queries/site-settings";

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.4 1.5h2.5a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 9.3a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__logo">
              My<span>Room</span><span className="brand-az">AZ</span>
            </p>
            <p className="footer__tagline">{t("tagline")}</p>

            {(settings.instagramUrl || settings.phone) && (
              <div className="footer__socials">
                {settings.instagramUrl && (
                  <a
                    className="footer__social"
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon />
                    <span>{t("instagram")}</span>
                  </a>
                )}

                {settings.phone && (
                  <a className="footer__social" href={`tel:${settings.phone}`}>
                    <PhoneIcon />
                    <span>{formatSitePhone(settings.phone)}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="footer__col">
            <h3 className="footer__col-title">{t("listingsTitle")}</h3>
            <div className="footer__links">
              <Link href="/search">{t("allListings")}</Link>
              <Link href="/blog">{t("blog")}</Link>
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
