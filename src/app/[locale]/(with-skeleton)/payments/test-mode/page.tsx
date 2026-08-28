import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type PaymentsTestModePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PaymentsTestModePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "paymentsTestMode" });

  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

/**
 * Onlayn ödəniş şlüzü bankın test mühitində sınaqdan keçirilənə qədər
 * istifadəçi bank səhifəsi əvəzinə buraya yönləndirilir.
 */
export default async function PaymentsTestModePage({
  params,
}: PaymentsTestModePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("paymentsTestMode");

  return (
    <div className="payments-notice-page">
      <div className="container">
        <div className="payments-notice">
          <span className="payments-notice__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M12 7.75v5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </span>

          <h1 className="payments-notice__title">{t("title")}</h1>
          <p className="payments-notice__text">{t("description")}</p>

          <div className="payments-notice__actions">
            <Link href="/dashboard/listings" className="btn btn--primary">
              {t("backToListings")}
            </Link>
            <Link href="/" className="btn btn--ghost">
              {t("backHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
