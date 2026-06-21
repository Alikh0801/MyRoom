export function PageLoading() {
  return (
    <div className="page-loading" aria-live="polite" aria-busy="true">
      <div className="page-loading__bar" />
      <div className="container page-loading__content">
        <div className="page-loading__title" />
        <div className="page-loading__grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="page-loading__card" />
          ))}
        </div>
      </div>
    </div>
  );
}
