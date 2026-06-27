import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { LEGAL_DOCUMENT_VERSION } from "@/lib/legal/constants";
import type { LegalSection } from "@/lib/legal/types";

interface LegalDocumentProps {
  locale: Locale;
  title: string;
  intro: string;
  sections: LegalSection[];
  relatedHref?: "/terms" | "/privacy";
  relatedLabel?: string;
}

const DATE_LOCALE: Record<Locale, string> = {
  az: "az-AZ",
  ru: "ru-RU",
};

export async function LegalDocument({
  locale,
  title,
  intro,
  sections,
  relatedHref,
  relatedLabel,
}: LegalDocumentProps) {
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <article className="legal-document">
      <header className="legal-document__header">
        <h1 className="legal-document__title">{title}</h1>
        <p className="legal-document__meta">
          {t("lastUpdated")}:{" "}
          {new Date(LEGAL_DOCUMENT_VERSION).toLocaleDateString(DATE_LOCALE[locale], {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="legal-document__intro">{intro}</p>
      </header>

      <nav className="legal-document__toc" aria-label={t("toc")}>
        <h2 className="legal-document__toc-title">{t("toc")}</h2>
        <ol className="legal-document__toc-list">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="legal-document__sections">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="legal-document__section">
            <h2 className="legal-document__section-title">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="legal-document__paragraph">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="legal-document__list">
                {section.list.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            )}
            {section.footerParagraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="legal-document__paragraph">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      {relatedHref && relatedLabel && (
        <p className="legal-document__related">
          {t("seeAlso")}: <Link href={relatedHref}>{relatedLabel}</Link>
        </p>
      )}
    </article>
  );
}
