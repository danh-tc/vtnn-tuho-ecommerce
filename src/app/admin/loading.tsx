const ROWS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function AdminLoading() {
  return (
    <div className="rethink-admin-content">
      {/* Topbar placeholder */}
      <div style={{ marginBottom: 24, height: 32, display: "flex", alignItems: "center" }}>
        <div className="skeleton-rect" style={{ width: 220, height: 22 }} />
      </div>

      {/* Table card */}
      <div className="rethink-admin-table-card">
        {/* Card header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div className="skeleton-rect" style={{ width: 160, height: 18 }} />
          <div style={{ display: "flex", gap: 12 }}>
            <div className="skeleton-rect" style={{ width: 200, height: 34, borderRadius: 6 }} />
            <div className="skeleton-rect" style={{ width: 140, height: 34, borderRadius: 6 }} />
          </div>
        </div>

        {/* Table */}
        <div className="skeleton-table" style={{ border: "none", borderRadius: 0 }}>
          <div className="skeleton-table__header" />
          {ROWS.map((k) => (
            <div key={k} className="skeleton-table__row" style={{ gridTemplateColumns: "1fr 2fr 1.5fr 1fr 1fr 1fr" }}>
              <div className="skeleton-line skeleton-line--60" />
              <div className="skeleton-line skeleton-line--80" />
              <div className="skeleton-line skeleton-line--50" />
              <div className="skeleton-line skeleton-line--40" />
              <div className="skeleton-line skeleton-line--30" />
              <div className="skeleton-line skeleton-line--20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
