const CARDS = ["a","b","c","d","e","f","g","h","i"];

export default function ProductsLoading() {
  return (
    <div className="skeleton-page__section">
      <div className="skeleton-heading" />
      <div className="skeleton-catalog">
        <div className="skeleton-catalog__sidebar">
          {["a","b","c","d","e"].map((k) => (
            <div key={k} className="skeleton-line" style={{ marginBottom: 12 }} />
          ))}
        </div>
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
    </div>
  );
}
