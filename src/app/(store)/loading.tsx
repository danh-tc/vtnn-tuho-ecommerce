export default function StoreLoading() {
  return (
    <div className="skeleton-page">
      {/* Hero skeleton */}
      <div className="skeleton-hero" />

      {/* Product grid skeleton */}
      <div className="container" style={{ padding: "40px 16px" }}>
        <div className="skeleton-heading" />
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card__img" />
              <div className="skeleton-card__body">
                <div className="skeleton-line skeleton-line--80" />
                <div className="skeleton-line skeleton-line--50" />
                <div className="skeleton-line skeleton-line--30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
