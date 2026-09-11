import "../../admin-blog.css";

/**
 * Admin paneldəki bloq idarəetmə stilləri yalnız admin marşrutunda
 * yüklənsin deyə burada import olunur.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
