import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { updateBlogPost } from "@/lib/blog/admin-actions";
import { getAdminBlogPost } from "@/lib/queries/blog-admin";

export const metadata = { title: "Blog məqaləsini redaktə et" };
export const dynamic = "force-dynamic";

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  await requireAdmin();
  const { id } = await params;
  const post = await getAdminBlogPost(id);

  if (!post) notFound();

  return (
    <div className="container dashboard admin-panel-page">
      <header className="admin-panel-page__header">
        <h1 className="section__title">Məqaləni redaktə et</h1>
        <p className="section__subtitle">
          <Link href="/admin?tab=blog">← Blog siyahısına qayıt</Link>
        </p>
      </header>
      <BlogPostForm post={post} action={updateBlogPost.bind(null, post.id)} />
    </div>
  );
}
