const CARDS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

export default function ProductsLoading() {
  return (
    <>
      {/* Use rethink-catalog__sidebar so :has() rule triggers the flex layout on rethink-store-main */}
      <aside className="rethink-catalog__sidebar" aria-hidden="true">
        <div className="skeleton-line" style={{ height: 16, marginBottom: 16 }} />
        {["a", "b", "c", "d", "e"].map((k) => (
          <div key={k} className="skeleton-line" style={{ marginBottom: 12 }} />
        ))}
        <div className="skeleton-line" style={{ height: 16, marginBottom: 16, marginTop: 24 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div className="skeleton-rect" style={{ height: 34, flex: 1, borderRadius: 6 }} />
          <div className="skeleton-rect" style={{ height: 34, flex: 1, borderRadius: 6 }} />
        </div>
        <div className="skeleton-rect" style={{ height: 34, borderRadius: 6 }} />
      </aside>

      <div style={{ flex: 1, minWidth: 0, padding: "24px 0" }}>
        <div className="skeleton-heading" />
        <div className="skeleton-grid">
          {CARDS.map((k) => (
            <div key={k} className="skeleton-card">
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
    </>
  );
}
