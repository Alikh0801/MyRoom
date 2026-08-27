import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { BlogCover } from "@/components/blog/BlogCover";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatBlogDate } from "@/lib/blog/format";
import type { BlogPost } from "@/lib/blog/types";

interface BlogFeatureRowProps {
  post: BlogPost;
  locale: Locale;
  /** Cüt sıralarda şəkil sağda, mətn solda göstərilir */
  reversed?: boolean;
  priority?: boolean;
}

export async function BlogFeatureRow({
  post,
  locale,
  reversed = false,
  priority = false,
}: BlogFeatureRowProps) {
  const t = await getTranslations("blog");

  return (
    <article
      className={`blog-feature${reversed ? " blog-feature--reversed" : ""}`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="blog-feature__media"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.coverUrl ? (
          <Image
            src={post.coverUrl}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 860px) 100vw, 50vw"
            className="blog-feature__img"
          />
        ) : (
          <BlogCover
            accent={post.accent}
            uid={`f-${post.slug}`}
            className="blog-feature__art"
          />
        )}
      </Link>

      <div className="blog-feature__body">
        {post.region && (
          <span className="blog-feature__region">{post.region}</span>
        )}
        <h2 className="blog-feature__title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="blog-feature__excerpt">{post.excerpt}</p>
        <div className="blog-feature__meta">
          <time dateTime={post.publishedAt}>
            {formatBlogDate(post.publishedAt, locale)}
          </time>
          <span className="blog-feature__dot" aria-hidden="true" />
          <span>{t("readMinutes", { minutes: post.readMinutes })}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="blog-feature__cta">
          {t("readMore")} →
        </Link>
      </div>
    </article>
  );
}
