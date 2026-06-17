import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  hash?: string;
}

function pageHref(basePath: string, page: number, hash?: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  const path = query ? `${basePath}?${query}` : basePath;
  return hash ? `${path}${hash}` : path;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/",
  hash,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Səhifələmə">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1, hash)}
          className="pagination__btn pagination__btn--nav"
          aria-label="Əvvəlki səhifə"
        >
          ‹ Əvvəlki
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--nav pagination__btn--disabled">
          ‹ Əvvəlki
        </span>
      )}

      <div className="pagination__pages">
        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="pagination__ellipsis">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={pageHref(basePath, page, hash)}
              className={`pagination__page${
                page === currentPage ? " pagination__page--active" : ""
              }`}
              aria-label={`Səhifə ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1, hash)}
          className="pagination__btn pagination__btn--nav"
          aria-label="Növbəti səhifə"
        >
          Növbəti ›
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--nav pagination__btn--disabled">
          Növbəti ›
        </span>
      )}
    </nav>
  );
}
