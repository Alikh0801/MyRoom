import { LoadingBar } from "@/components/ui/LoadingBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { ListingGridSkeleton } from "@/components/ui/skeletons/ListingGridSkeleton";

export function ListingDetailSkeleton() {
  return (
    <>
      <LoadingBar />
      <article className="listing-detail" aria-busy="true" aria-live="polite">
        <div className="container">
          <div className="listing-detail__top">
            <div className="listing-detail__gallery-col">
              <Skeleton className="skeleton-detail__gallery" />
              <Skeleton className="skeleton-detail__block" />
            </div>

            <aside className="listing-detail__contact skeleton-detail__contact">
              <Skeleton className="skeleton-detail__price" />
              <div className="skeleton-detail__facts">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton-detail__fact">
                    <Skeleton className="skeleton-detail__fact-label" />
                    <Skeleton className="skeleton-detail__fact-value" />
                  </div>
                ))}
              </div>
              <Skeleton className="skeleton-detail__owner" />
              <Skeleton className="skeleton-detail__btn" />
              <Skeleton className="skeleton-detail__btn skeleton-detail__btn--secondary" />
            </aside>
          </div>

          <div className="listing-detail__content">
            <Skeleton className="skeleton-detail__badge" />
            <Skeleton className="skeleton-detail__title" />
            <Skeleton className="skeleton-detail__line" />
            <Skeleton className="skeleton-detail__line skeleton-detail__line--short" />
            <Skeleton className="skeleton-detail__line" />
          </div>
        </div>

        <section className="listing-detail__similar">
          <div className="container">
            <ListingGridSkeleton count={4} showTitle />
          </div>
        </section>
      </article>
    </>
  );
}
