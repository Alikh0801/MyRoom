import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCover } from "@/components/blog/BlogCover";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getBlogPost, getBlogSlugs, getRelatedPosts } from "@/lib/blog/content";
import { formatBlogDate } from "@/lib/blog/format";
import {
  buildCanonicalAlternates,
  getAbsoluteUrl,
  getOpenGraphLocale,
} from "@/lib/seo";
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo/structured-data";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const post = await getBlogPost(slug, typedLocale);

  // Yalnız komponentdə notFound() çağırmaq kifayət etmir: metadata uğurla
  // qayıdanda cavab 200 kimi bağlanır və "soft 404" yaranır.
  if (!post) notFound();

  const path = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: buildCanonicalAlternates(path, typedLocale),
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: getAbsoluteUrl(path, typedLocale),
      type: "article",
      locale: getOpenGraphLocale(typedLocale),
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const post = await getBlogPost(slug, typedLocale);

  if (!post) notFound();

  const t = await getTranslations("blog");
  const related = await getRelatedPosts(slug, typedLocale);

  const breadcrumb = buildBreadcrumbJsonLd(
    [
      { name: t("home"), path: "/" },
      { name: t("title"), path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ],
    typedLocale
  );

  return (
    <article className="blog-post">
      <script
        {...jsonLdScriptProps(buildBlogPostingJsonLd(post, typedLocale))}
        type="application/ld+json"
      />
      <script {...jsonLdScriptProps(breadcrumb)} type="application/ld+json" />

      <header className="blog-post__hero">
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="blog-post__hero-img"
          />
        ) : (
          <BlogCover
            accent={post.accent}
            uid={`hero-${post.slug}`}
            className="blog-post__hero-art"
            anchor="bottom"
          />
        )}
        <div className="blog-post__hero-overlay" />
        <div className="container blog-post__hero-inner">
          <nav className="blog-post__breadcrumb" aria-label="breadcrumb">
            <Link href="/">{t("home")}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">{t("title")}</Link>
          </nav>
          <h1 className="blog-post__title">{post.title}</h1>
          <div className="blog-post__meta">
            {post.region && (
              <span className="blog-post__region">{post.region}</span>
            )}
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt, typedLocale)}
            </time>
            <span className="blog-post__dot" aria-hidden="true" />
            <span>{t("readMinutes", { minutes: post.readMinutes })}</span>
          </div>
        </div>
      </header>

      <div className="container blog-post__body">
        {post.intro
          .split("\n\n")
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph} className="blog-post__intro">
              {paragraph}
            </p>
          ))}

        {post.highlights && post.highlights.length > 0 && (
          <aside className="blog-highlights">
            <h2 className="blog-highlights__title">{t("highlightsTitle")}</h2>
            <ul className="blog-highlights__list">
              {post.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        )}

        {post.sections.map((section) => (
          <section key={section.heading} className="blog-section">
            <h2 className="blog-section__heading">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="blog-section__text">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="blog-section__list">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {post.region && (
          <aside className="blog-cta">
            <div className="blog-cta__text">
              <h2 className="blog-cta__title">
                {t("ctaTitle", { region: post.region })}
              </h2>
              <p className="blog-cta__desc">{t("ctaText")}</p>
            </div>
            <Link
              href={`/search?region=${encodeURIComponent(post.region)}`}
              className="btn btn--primary blog-cta__btn"
            >
              {t("ctaButton")}
            </Link>
          </aside>
        )}

        <div className="blog-post__back">
          <Link href="/blog">← {t("backToBlog")}</Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="blog-related">
          <div className="container">
            <h2 className="blog-related__title">{t("relatedTitle")}</h2>
            <div className="blog-grid">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} locale={typedLocale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
