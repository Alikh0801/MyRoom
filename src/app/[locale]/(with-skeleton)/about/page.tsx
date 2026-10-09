import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAboutContent } from "@/lib/about/content";
import { buildCanonicalAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import "@/app/about-page.css";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildCanonicalAlternates("/about", locale as Locale),
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const content = getAboutContent(locale as Locale);

  return (
    <div className="about-page">
      <div className="container">
        <header className="about-page__header">
          <h1 className="about-page__title">{t("title")}</h1>
          <p className="about-page__intro">{content.intro}</p>
        </header>

        <div className="about-page__sections">
          {content.sections.map((section) => (
            <section key={section.id} className="about-card">
              <h2 className="about-card__title">
                <span className="about-card__icon" aria-hidden="true">
                  {section.icon}
                </span>
                {section.title}
              </h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="about-card__text">
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="about-card__list">
                  {section.list.map((item) => (
                    <li key={item.title} className="about-card__list-item">
                      <strong>{item.title}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="about-cta">
          <h2 className="about-cta__title">{content.closingTitle}</h2>
          <p className="about-cta__text">{content.closingText}</p>
          <div className="about-cta__actions">
            <Link href="/search" className="btn btn--primary">
              {content.ctaBrowse}
            </Link>
            <Link href="/dashboard/listings/new" className="btn btn--ghost">
              {content.ctaPost}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
