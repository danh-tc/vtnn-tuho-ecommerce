export default function AdminLoading() {
  return (
    <div style={{ padding: 32 }}>
      <div className="skeleton-heading" style={{ width: 200, marginBottom: 24 }} />
      <div className="skeleton-table">
        <div className="skeleton-table__header" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-table__row">
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
