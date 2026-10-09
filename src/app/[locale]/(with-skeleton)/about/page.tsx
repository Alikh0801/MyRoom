import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildCanonicalAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("metaTitle"),
    alternates: buildCanonicalAlternates("/about", locale as Locale),
    // Məzmun hazırlanana qədər indekslənmir: boş səhifə Google tərəfindən
    // "thin content" sayılır. Mətn yazılandan sonra bu sətir silinməlidir
    // (sitemap-a əlavə etmək də o vaxt lazımdır).
    robots: { index: false, follow: true },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <div className="section">
      <div className="container">
        <h1 className="section__title">{t("title")}</h1>
      </div>
    </div>
  );
}
