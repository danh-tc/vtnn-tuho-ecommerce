import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Users, MapPin, ShoppingCart, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Chi tiết khách hàng" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

async function toggleActive(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const current = formData.get("isActive") === "true";
  if (!id) return;
  await prisma.user.update({ where: { id }, data: { isActive: !current } });
  revalidatePath(`/admin/khach-hang/${id}`);
  revalidatePath("/admin/khach-hang");
}

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  if (isNaN(id)) notFound();

  const customer = await prisma.user.findUnique({
    where: { id, role: "customer" },
    include: {
      addresses: { orderBy: { isDefault: "desc" } },
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          code: true,
          status: true,
          total: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      },
    },
  });

  if (!customer) notFound();

  const fullName = `${customer.firstName} ${customer.lastName}`.trim();
  const totalSpent = customer.orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="rethink-admin-content">
      {/* Topbar */}
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/admin/khach-hang"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "#616161", textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} /> Danh sách khách hàng
          </Link>
          <span style={{ color: "#bdbdbd" }}>/</span>
          <span className="rethink-admin-topbar__title">
            <Users size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            {fullName}
          </span>
          <span className={`rethink-admin-badge rethink-admin-badge--${customer.isActive ? "confirmed" : "cancelled"}`}>
            {customer.isActive ? "Hoạt động" : "Đã khóa"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

          {/* Order history */}
          <div className="rethink-admin-table-card">
            <div className="rethink-admin-table-card__header">
              <h3>
                <ShoppingCart size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Lịch sử đơn hàng ({customer.orders.length})
              </h3>
            </div>
            {customer.orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9e9e9e", fontSize: 14 }}>
                Chưa có đơn hàng nào.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="rethink-admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th style={{ textAlign: "center" }}>Sản phẩm</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: "right" }}>Tổng tiền</th>
                      <th>Ngày đặt</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <a
                            href={`/admin/don-hang/${order.id}`}
                            style={{ color: "#2E7D32", fontWeight: 700, textDecoration: "none" }}
                          >
                            {order.code}
                          </a>
                        </td>
                        <td style={{ textAlign: "center" }}>{order._count.items} SP</td>
                        <td>
                          <span className={`rethink-admin-badge rethink-admin-badge--${order.status}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{formatPrice(order.total)}</td>
                        <td style={{ fontSize: 13, color: "#616161" }}>
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td>
                          <a href={`/admin/don-hang/${order.id}`} className="rethink-admin-btn--edit">
                            Xem
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>
                <MapPin size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Địa chỉ ({customer.addresses.length})
              </h3>
            </div>
            {customer.addresses.length === 0 ? (
              <div style={{ padding: "20px 24px", color: "#9e9e9e", fontSize: 14 }}>
                Chưa có địa chỉ nào.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {customer.addresses.map((addr, idx) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: "14px 20px",
                      borderTop: idx > 0 ? "1px solid #f5f5f5" : undefined,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    {addr.isDefault && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: "#E8F5E9", color: "#2E7D32",
                        padding: "2px 6px", borderRadius: 4,
                        flexShrink: 0, marginTop: 2,
                      }}>
                        Mặc định
                      </span>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{addr.recipientName}</div>
                      <div style={{ fontSize: 13, color: "#616161", marginTop: 2 }}>{addr.phone}</div>
                      <div style={{ fontSize: 13, color: "#424242", marginTop: 2 }}>
                        {addr.street}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Profile info */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Thông tin tài khoản</h3>
            </div>
            <div className="rethink-admin-form-card__body" style={{ gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Họ tên</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Số điện thoại</div>
                <div style={{ fontSize: 14 }}>{customer.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Email</div>
                <div style={{ fontSize: 14 }}>{customer.email ?? "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Ngày đăng ký</div>
                <div style={{ fontSize: 14 }}>
                  {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Thống kê</h3>
            </div>
            <div className="rethink-admin-form-card__body" style={{ gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#616161" }}>Tổng đơn hàng</span>
                <span style={{ fontWeight: 700 }}>{customer.orders.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#616161" }}>Đã giao thành công</span>
                <span style={{ fontWeight: 700, color: "#2E7D32" }}>
                  {customer.orders.filter((o) => o.status === "delivered").length}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#616161" }}>Đã hủy</span>
                <span style={{ fontWeight: 700, color: "#e53935" }}>
                  {customer.orders.filter((o) => o.status === "cancelled").length}
                </span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 8, borderTop: "1px solid #f0f0f0",
              }}>
                <span style={{ fontSize: 13, color: "#616161" }}>Tổng chi tiêu</span>
                <span style={{ fontWeight: 700, color: "#1b5e20", fontSize: 15 }}>
                  {totalSpent > 0 ? formatPrice(totalSpent) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Lock / unlock */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Quản lý tài khoản</h3>
            </div>
            <div className="rethink-admin-form-card__body">
              <p style={{ fontSize: 13, color: "#616161" }}>
                {customer.isActive
                  ? "Tài khoản đang hoạt động. Khóa tài khoản sẽ ngăn khách hàng đăng nhập."
                  : "Tài khoản đang bị khóa. Mở khóa để cho phép đăng nhập lại."}
              </p>
            </div>
            <div className="rethink-admin-form-card__footer">
              <form action={toggleActive}>
                <input type="hidden" name="id" value={customer.id} />
                <input type="hidden" name="isActive" value={String(customer.isActive)} />
                <button
                  type="submit"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13,
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
                    background: customer.isActive ? "#FFEBEE" : "#E8F5E9",
                    color: customer.isActive ? "#c62828" : "#2E7D32",
                  }}
                >
                  {customer.isActive
                    ? <><Lock size={13} /> Khóa tài khoản</>
                    : <><Unlock size={13} /> Mở khóa</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
