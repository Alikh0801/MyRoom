import { LoadingBar } from "@/components/ui/LoadingBar";
import { Skeleton } from "@/components/ui/Skeleton";

interface ListingGridSkeletonProps {
  count?: number;
  showTitle?: boolean;
  className?: string;
}

export function ListingGridSkeleton({
  count = 4,
  showTitle = false,
  className,
}: ListingGridSkeletonProps) {
  return (
    <div className={className}>
      {showTitle && <Skeleton className="skeleton--section-title" />}
      <div className="listing-grid skeleton-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton-listing-card">
            <Skeleton className="skeleton-listing-card__image" />
            <div className="skeleton-listing-card__body">
              <Skeleton className="skeleton-listing-card__title" />
              <Skeleton className="skeleton-listing-card__meta" />
              <Skeleton className="skeleton-listing-card__price" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListingGridPageSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      <LoadingBar />
      <div className="page-loading">
        <div className="container page-loading__content">
          <Skeleton className="skeleton--page-title" />
          <ListingGridSkeleton count={count} />
        </div>
      </div>
    </>
  );
}
