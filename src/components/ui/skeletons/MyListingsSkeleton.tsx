import { LoadingBar } from "@/components/ui/LoadingBar";
import { Skeleton } from "@/components/ui/Skeleton";

export function MyListingsSkeleton() {
  return (
    <>
      <LoadingBar />
      <div className="dashboard-page" aria-busy="true" aria-live="polite">
        <div className="container">
          <div className="dashboard__header-row">
            <div>
              <Skeleton className="skeleton--page-title" />
              <Skeleton className="skeleton--page-subtitle" />
            </div>
          </div>

          <div className="skeleton-my-listings__filters">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="skeleton-my-listings__filter" />
            ))}
          </div>

          <div className="my-listings">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton-my-listing-card">
                <Skeleton className="skeleton-my-listing-card__image" />
                <div className="skeleton-my-listing-card__body">
                  <Skeleton className="skeleton-my-listing-card__title" />
                  <Skeleton className="skeleton-my-listing-card__meta" />
                  <Skeleton className="skeleton-my-listing-card__actions" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
