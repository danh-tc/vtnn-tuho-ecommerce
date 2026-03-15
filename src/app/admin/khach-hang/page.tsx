import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import AutoSubmitSelect from "@/components/ui/AutoSubmitSelect";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Quản lý khách hàng" };

const PAGE_SIZE = 20;

interface SearchParams {
  trang?: string;
  q?: string;
  status?: string;
}

export default async function AdminCustomersPage({
  searchParams,
}: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const { trang, q, status } = await searchParams;
  const page = Math.max(1, Number.parseInt(trang ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    role: "customer" as const,
    ...(status === "active" && { isActive: true }),
    ...(status === "inactive" && { isActive: false }),
    ...(q && {
      OR: [
        { firstName: { contains: q, mode: "insensitive" as const } },
        { lastName: { contains: q, mode: "insensitive" as const } },
        { phone: { contains: q } },
        { email: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { total: true },
          where: { status: "delivered" },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildUrl = (newPage: number, overrides?: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("trang", String(newPage));
    if (overrides) Object.entries(overrides).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    return `/admin/khach-hang?${params}`;
  };

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title">
          <Users size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          Quản lý khách hàng
        </span>
      </div>

      <div className="rethink-admin-table-card">
        <div className="rethink-admin-table-card__header">
          <h3>Tất cả khách hàng ({total})</h3>
          <div className="rethink-admin-table-card__actions">
            <form method="GET">
              {status && <input type="hidden" name="status" value={status} />}
              <input
                name="q"
                className="rethink-admin-search-input"
                placeholder="Tìm tên, SĐT, email..."
                defaultValue={q}
              />
            </form>
            <form method="GET">
              {q && <input type="hidden" name="q" value={q} />}
              <AutoSubmitSelect
                name="status"
                defaultValue={status ?? ""}
                className="rethink-admin-search-input"
                style={{ width: "auto" }}
              >
                <option value="">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </AutoSubmitSelect>
            </form>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="rethink-admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Email</th>
                <th style={{ textAlign: "center" }}>Đơn hàng</th>
                <th style={{ textAlign: "right" }}>Đã mua</th>
                <th>Ngày đăng ký</th>
                <th style={{ textAlign: "center" }}>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#9e9e9e", padding: "40px 0" }}>
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const fullName = `${c.firstName} ${c.lastName}`.trim();
                  const totalSpent = c.orders.reduce((sum, o) => sum + o.total, 0);
                  return (
                    <tr key={c.id}>
                      <td style={{ color: "#9e9e9e", fontSize: 13 }}>{c.id}</td>
                      <td>
                        <a
                          href={`/admin/khach-hang/${c.id}`}
                          style={{ fontWeight: 600, color: "#2E7D32", textDecoration: "none" }}
                        >
                          {fullName}
                        </a>
                      </td>
                      <td style={{ fontSize: 13 }}>{c.phone}</td>
                      <td style={{ fontSize: 13, color: "#616161" }}>{c.email ?? "—"}</td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{c._count.orders}</td>
                      <td style={{ textAlign: "right", fontSize: 13 }}>
                        {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
                      </td>
                      <td style={{ fontSize: 13, color: "#616161" }}>
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span
                          className={`rethink-admin-badge rethink-admin-badge--${c.isActive ? "confirmed" : "cancelled"}`}
                        >
                          {c.isActive ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td>
                        <div className="rethink-admin-action-btns">
                          <a href={`/admin/khach-hang/${c.id}`} className="rethink-admin-btn--edit">
                            Chi tiết
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}>
            {page > 1 && (
              <a href={buildUrl(page - 1)} className="rethink-admin-btn--edit" style={{ fontSize: 13 }}>
                ← Trước
              </a>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} style={{ color: "#9e9e9e" }}>…</span>
                  )}
                  <a
                    key={p}
                    href={buildUrl(p)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      fontSize: 13,
                      background: p === page ? "#2E7D32" : "#f5f5f5",
                      color: p === page ? "#fff" : "#424242",
                      textDecoration: "none",
                      fontWeight: p === page ? 700 : 400,
                    }}
                  >
                    {p}
                  </a>
                </>
              ))}
            {page < totalPages && (
              <a href={buildUrl(page + 1)} className="rethink-admin-btn--edit" style={{ fontSize: 13 }}>
                Sau →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
