import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogFeatureRow } from "@/components/blog/BlogFeatureRow";
import { routing, type Locale } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog/content";
import { buildCanonicalAlternates, getAbsoluteUrl } from "@/lib/seo";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildCanonicalAlternates("/blog", typedLocale),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: getAbsoluteUrl("/blog", typedLocale),
      type: "website",
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const t = await getTranslations("blog");
  const posts = await getBlogPosts(typedLocale);

  return (
    <div className="blog-page">
      <header className="blog-hero">
        <div className="container blog-hero__inner">
          <span className="blog-hero__eyebrow">{t("eyebrow")}</span>
          <h1 className="blog-hero__title">{t("title")}</h1>
          <p className="blog-hero__subtitle">{t("subtitle")}</p>
        </div>
      </header>

      <div className="container blog-page__inner">
        <section className="blog-about">
          <h2 className="blog-about__title">{t("aboutTitle")}</h2>
          <p className="blog-about__text">{t("aboutText")}</p>
        </section>

        {posts.length > 0 ? (
          <div className="blog-feature-list">
            {posts.map((post, index) => (
              <BlogFeatureRow
                key={post.slug}
                post={post}
                locale={typedLocale}
                reversed={index % 2 === 1}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t("empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
