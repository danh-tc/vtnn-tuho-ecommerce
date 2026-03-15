export default function ProductDetailLoading() {
  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Image */}
        <div className="skeleton-rect" style={{ width: 420, height: 420, flexShrink: 0 }} />
        {/* Info */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="skeleton-line skeleton-line--60" style={{ height: 28, marginBottom: 16 }} />
          <div className="skeleton-line skeleton-line--30" style={{ height: 22, marginBottom: 24 }} />
          <div className="skeleton-line skeleton-line--80" style={{ marginBottom: 8 }} />
          <div className="skeleton-line skeleton-line--80" style={{ marginBottom: 8 }} />
          <div className="skeleton-line skeleton-line--50" style={{ marginBottom: 32 }} />
          <div className="skeleton-rect" style={{ width: 160, height: 44 }} />
        </div>
      </div>
    </div>
  );
}
