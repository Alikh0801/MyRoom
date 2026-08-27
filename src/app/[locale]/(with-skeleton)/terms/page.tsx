import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getTermsContent } from "@/lib/legal/content";
import type { Locale } from "@/i18n/routing";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("termsMetaTitle"),
    description: t("termsMetaDescription"),
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal");
  const { intro, sections } = getTermsContent(locale as Locale);

  return (
    <div className="legal-page">
      <div className="container">
        <LegalDocument
          locale={locale as Locale}
          title={t("termsTitle")}
          intro={intro}
          sections={sections}
          relatedHref="/privacy"
          relatedLabel={t("privacyTitle")}
        />
      </div>
    </div>
  );
}
