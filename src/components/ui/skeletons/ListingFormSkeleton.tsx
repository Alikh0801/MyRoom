import { LoadingBar } from "@/components/ui/LoadingBar";
import { Skeleton } from "@/components/ui/Skeleton";

export function ListingFormSkeleton() {
  return (
    <>
      <LoadingBar />
      <div className="dashboard-page dashboard-page--form" aria-busy="true">
        <div className="container listing-form-page">
          <Skeleton className="skeleton-form__back" />
          <Skeleton className="skeleton--page-title" />
          <Skeleton className="skeleton--page-subtitle skeleton--page-subtitle-wide" />

          <div className="listing-form">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-form__section">
                <div className="skeleton-form__section-header">
                  <Skeleton className="skeleton-form__step" />
                  <div className="skeleton-form__section-heading">
                    <Skeleton className="skeleton-form__section-title" />
                    <Skeleton className="skeleton-form__section-desc" />
                  </div>
                </div>
                <Skeleton className="skeleton-form__field" />
                <Skeleton className="skeleton-form__field skeleton-form__field--short" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
