export default function ProductsLoading() {
  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <div className="skeleton-heading" />
      <div style={{ display: "flex", gap: 24 }}>
        {/* Sidebar skeleton */}
        <div style={{ width: 220, flexShrink: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-line" style={{ marginBottom: 12 }} />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="skeleton-grid" style={{ flex: 1 }}>
          {Array.from({ length: 9 }).map((_, i) => (
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
