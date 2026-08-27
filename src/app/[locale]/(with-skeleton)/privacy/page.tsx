import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getPrivacyContent } from "@/lib/legal/content";
import type { Locale } from "@/i18n/routing";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("privacyMetaTitle"),
    description: t("privacyMetaDescription"),
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legal");
  const { intro, sections } = getPrivacyContent(locale as Locale);

  return (
    <div className="legal-page">
      <div className="container">
        <LegalDocument
          locale={locale as Locale}
          title={t("privacyTitle")}
          intro={intro}
          sections={sections}
          relatedHref="/terms"
          relatedLabel={t("termsTitle")}
        />
      </div>
    </div>
  );
}
