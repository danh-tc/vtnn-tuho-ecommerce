const ROWS = ["a","b","c","d","e","f"];

export default function AdminLoading() {
  return (
    <div className="skeleton-page__section">
      <div className="skeleton-heading" style={{ width: 200, marginBottom: 24 }} />
      <div className="skeleton-table">
        <div className="skeleton-table__header" />
        {ROWS.map((k) => (
          <div key={k} className="skeleton-table__row">
            <div className="skeleton-line skeleton-line--30" />
            <div className="skeleton-line skeleton-line--60" />
            <div className="skeleton-line skeleton-line--40" />
            <div className="skeleton-line skeleton-line--20" />
          </div>
        ))}
      </div>
    </div>
  );
}
