import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { deleteBlogPost } from "@/lib/blog/admin-actions";
import type { AdminBlogPost } from "@/lib/blog/types";

interface AdminBlogListProps {
  posts: AdminBlogPost[];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

export function AdminBlogList({ posts }: AdminBlogListProps) {
  return (
    <div className="admin-blog">
      <div className="admin-blog__toolbar">
        <Link href="/admin/blog/new" className="btn btn--primary">
          + Yeni məqalə
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state empty-state--compact">
          <p>Hələ məqalə yoxdur.</p>
        </div>
      ) : (
        <ul className="admin-blog__list">
          {posts.map((post) => (
            <li key={post.id} className="admin-blog-card">
              <div className="admin-blog-card__cover">
                {post.coverUrl ? (
                  <Image
                    src={post.coverUrl}
                    alt=""
                    fill
                    sizes="120px"
                    className="admin-blog-card__img"
                  />
                ) : (
                  <span className="admin-blog-card__no-cover">Şəkilsiz</span>
                )}
              </div>

              <div className="admin-blog-card__body">
                <div className="admin-blog-card__top">
                  <h3 className="admin-blog-card__title">{post.titleAz}</h3>
                  <span
                    className={`admin-blog-card__status admin-blog-card__status--${post.status}`}
                  >
                    {post.status === "published" ? "Dərc olunub" : "Qaralama"}
                  </span>
                </div>

                <p className="admin-blog-card__meta">
                  /blog/{post.slug} · {formatDate(post.publishedAt)} ·{" "}
                  {post.readMinutes} dəq
                  {post.region ? ` · ${post.region}` : ""}
                </p>

                <p className="admin-blog-card__langs">
                  Tərcümələr: AZ
                  {post.titleRu ? " · RU" : ""}
                  {post.titleTr ? " · TR" : ""}
                </p>
              </div>

              <div className="admin-blog-card__actions">
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="btn btn--ghost"
                >
                  Redaktə et
                </Link>
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="btn btn--ghost"
                  >
                    Bax
                  </Link>
                )}
                <form action={deleteBlogPost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="btn btn--danger">
                    Sil
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
