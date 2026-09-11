import "../../blog-pages.css";

/**
 * Bloq səhifələrinin stilləri yalnız bu marşrutda yüklənsin deyə burada
 * import olunur — əvvəl qlobal idi və hər səhifəyə düşürdü.
 */
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
