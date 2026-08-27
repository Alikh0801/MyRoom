import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createBlogPost } from "@/lib/blog/admin-actions";

export const metadata = { title: "Yeni blog məqaləsi" };
export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="container dashboard admin-panel-page">
      <header className="admin-panel-page__header">
        <h1 className="section__title">Yeni məqalə</h1>
        <p className="section__subtitle">
          <Link href="/admin?tab=blog">← Blog siyahısına qayıt</Link>
        </p>
      </header>
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
