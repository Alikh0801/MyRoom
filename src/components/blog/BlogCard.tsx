import { getTranslations } from "next-intl/server";
import { BlogCover } from "@/components/blog/BlogCover";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate } from "@/lib/blog/format";
import type { BlogPost } from "@/lib/blog/types";

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  /** Siyahının başındakı böyük kart */
  featured?: boolean;
}

export async function BlogCard({ post, locale, featured = false }: BlogCardProps) {
  const t = await getTranslations("blog");

  return (
    <article className={`blog-card${featured ? " blog-card--featured" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <div className="blog-card__cover">
          <BlogCover
            accent={post.accent}
            uid={`${featured ? "f" : "c"}-${post.slug}`}
            className="blog-card__cover-art"
          />
          {featured && (
            <span className="blog-card__featured-badge">{t("featured")}</span>
          )}
          {post.region && (
            <span className="blog-card__region">{post.region}</span>
          )}
        </div>

        <div className="blog-card__body">
          <h3 className="blog-card__title">{post.title}</h3>
          <p className="blog-card__excerpt">{post.excerpt}</p>
          <div className="blog-card__meta">
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt, locale)}
            </time>
            <span className="blog-card__dot" aria-hidden="true" />
            <span>{t("readMinutes", { minutes: post.readMinutes })}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
