import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

/**
 * Kök 404 sərhədi. Kök layout yalnız children qaytardığı üçün (locale layout-u
 * <html> verir) bu səhifə öz <html>/<body>-sini özü qurmalıdır. Bu fayl olmadan
 * notFound() çağırılan səhifələr 404 əvəzinə 200 status qaytarır — yəni
 * axtarış motorları üçün "soft 404" yaranır.
 */
export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeScript />
        <div className="page-wrapper">
          <main className="main-content">
            <div className="container empty-state">
              <h1 className="section__title">{t("pageNotFound")}</h1>
              <p className="section__subtitle">{t("pageNotFoundText")}</p>
              <Link href="/" className="btn btn--primary" style={{ marginTop: "1rem" }}>
                {t("backHome")}
              </Link>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
