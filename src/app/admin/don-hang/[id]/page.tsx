import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ShoppingCart, MapPin, CreditCard, ClipboardList, Package } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "COD (Thanh toán khi nhận hàng)",
  bank_transfer: "Chuyển khoản ngân hàng",
  vnpay: "VNPay",
  momo: "MoMo",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

async function updateOrderStatus(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const status = formData.get("status") as string;
  if (!id || !status) return;
  await prisma.order.update({ where: { id }, data: { status: status as never } });
  revalidatePath(`/admin/don-hang/${id}`);
  revalidatePath("/admin/don-hang");
}

async function updateAdminNote(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const adminNote = (formData.get("adminNote") as string) ?? "";
  if (!id) return;
  await prisma.order.update({ where: { id }, data: { adminNote } });
  revalidatePath(`/admin/don-hang/${id}`);
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  if (isNaN(id)) notFound();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { orderBy: { id: "asc" } },
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="rethink-admin-content">
      {/* Topbar */}
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/admin/don-hang"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "#616161", textDecoration: "none",
            }}
          >
            <ArrowLeft size={15} /> Danh sách đơn hàng
          </Link>
          <span style={{ color: "#bdbdbd" }}>/</span>
          <span className="rethink-admin-topbar__title">
            <ShoppingCart size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            {order.code}
          </span>
          <span className={`rethink-admin-badge rethink-admin-badge--${order.status}`} style={{ marginLeft: 4 }}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>

          {/* Order items */}
          <div className="rethink-admin-table-card">
            <div className="rethink-admin-table-card__header">
              <h3><Package size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Sản phẩm đặt mua</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="rethink-admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>SKU</th>
                    <th style={{ textAlign: "right" }}>Đơn giá</th>
                    <th style={{ textAlign: "center" }}>SL</th>
                    <th style={{ textAlign: "right" }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ color: "#9e9e9e", fontSize: 13 }}>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.productName}</div>
                        {item.variantName && (
                          <div style={{ fontSize: 12, color: "#757575", marginTop: 2 }}>
                            Phân loại: {item.variantName}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: "#757575", fontFamily: "monospace" }}>{item.sku}</td>
                      <td style={{ textAlign: "right", fontSize: 14 }}>{formatPrice(item.unitPrice)}</td>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{item.quantity}</td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#2E7D32" }}>
                        {formatPrice(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial summary */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, marginLeft: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#616161" }}>
                  <span>Tạm tính</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#e53935" }}>
                    <span>Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}</span>
                    <span>- {formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#616161" }}>
                  <span>Phí vận chuyển</span>
                  <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : "Miễn phí"}</span>
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 16, fontWeight: 700, color: "#1b5e20",
                  paddingTop: 8, borderTop: "1px solid #f0f0f0",
                }}>
                  <span>Tổng cộng</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3><MapPin size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Địa chỉ giao hàng</h3>
            </div>
            <div className="rethink-admin-form-card__body" style={{ gap: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{order.shippingName}</div>
              <div style={{ fontSize: 14, color: "#616161" }}>{order.shippingPhone}</div>
              <div style={{ fontSize: 14, color: "#424242", marginTop: 4 }}>
                {order.shippingStreet}, {order.shippingWard}, {order.shippingDistrict}, {order.shippingProvince}
              </div>
              {order.note && (
                <div style={{
                  marginTop: 8, padding: "8px 12px",
                  background: "#fff8e1", borderRadius: 6,
                  fontSize: 13, color: "#5d4037",
                  borderLeft: "3px solid #FFB300",
                }}>
                  <strong>Ghi chú khách hàng:</strong> {order.note}
                </div>
              )}
            </div>
          </div>

          {/* Admin note */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3><ClipboardList size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Ghi chú nội bộ</h3>
            </div>
            <form action={updateAdminNote}>
              <input type="hidden" name="id" value={order.id} />
              <div className="rethink-admin-form-card__body">
                <textarea
                  name="adminNote"
                  defaultValue={order.adminNote ?? ""}
                  placeholder="Ghi chú dành cho nội bộ, không hiển thị cho khách..."
                  rows={3}
                  className="rethink-admin-form-group"
                  style={{ width: "100%", resize: "vertical", fontSize: 13, padding: "8px 10px" }}
                />
              </div>
              <div className="rethink-admin-form-card__footer">
                <button type="submit" className="rethink-admin-btn--add" style={{ fontSize: 13 }}>
                  Lưu ghi chú
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Update status */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Cập nhật trạng thái</h3>
            </div>
            <form action={updateOrderStatus}>
              <input type="hidden" name="id" value={order.id} />
              <div className="rethink-admin-form-card__body">
                <div className="rethink-admin-form-group">
                  <label>Trạng thái đơn hàng</label>
                  <select name="status" defaultValue={order.status}>
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rethink-admin-form-card__footer">
                <button type="submit" className="rethink-admin-btn--add" style={{ fontSize: 13, width: "100%" }}>
                  Cập nhật
                </button>
              </div>
            </form>
          </div>

          {/* Payment info */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3><CreditCard size={15} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Thanh toán</h3>
            </div>
            <div className="rethink-admin-form-card__body" style={{ gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Phương thức</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 4 }}>Trạng thái thanh toán</div>
                <span className={`rethink-admin-badge rethink-admin-badge--${order.paymentStatus}`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order meta */}
          <div className="rethink-admin-form-card">
            <div className="rethink-admin-form-card__header">
              <h3>Thông tin đơn hàng</h3>
            </div>
            <div className="rethink-admin-form-card__body" style={{ gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Mã đơn hàng</div>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>{order.code}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Ngày đặt</div>
                <div style={{ fontSize: 14 }}>
                  {new Date(order.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Cập nhật lần cuối</div>
                <div style={{ fontSize: 14 }}>
                  {new Date(order.updatedAt).toLocaleString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>
              {order.user && (
                <div>
                  <div style={{ fontSize: 12, color: "#9e9e9e", marginBottom: 2 }}>Tài khoản khách hàng</div>
                  <div style={{ fontSize: 14 }}>
                  {[order.user.firstName, order.user.lastName].filter(Boolean).join(" ") || order.user.email}
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
