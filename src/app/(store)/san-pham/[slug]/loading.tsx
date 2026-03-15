export default function ProductDetailLoading() {
  return (
    <div className="skeleton-page__section">
      <div className="skeleton-detail">
        <div className="skeleton-detail__img skeleton-rect" />
        <div className="skeleton-detail__info">
          <div className="skeleton-line skeleton-line--60" style={{ height: 28, marginBottom: 16 }} />
          <div className="skeleton-line skeleton-line--30" style={{ height: 22, marginBottom: 24 }} />
          <div className="skeleton-line skeleton-line--80" />
          <div className="skeleton-line skeleton-line--80" />
          <div className="skeleton-line skeleton-line--50" style={{ marginBottom: 32 }} />
          <div className="skeleton-rect skeleton-detail__btn" />
        </div>
      </div>
    </div>
  );
}
