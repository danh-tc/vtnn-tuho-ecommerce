const CARDS = ["a","b","c","d","e","f","g","h"];

export default function StoreLoading() {
  return (
    <div className="skeleton-page">
      {/* rethink-hero-banner triggers padding-top: 0 on store-main — same as real hero */}
      <div className="rethink-hero-banner">
        <div className="skeleton-hero" />
      </div>
      <div className="skeleton-page__section">
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
    </div>
  );
}
