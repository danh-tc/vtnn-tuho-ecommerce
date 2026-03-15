import { prisma } from "@/lib/prisma";
import AutoSubmitSelect from "@/components/ui/AutoSubmitSelect";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "COD",
  bank_transfer: "Chuyển khoản",
  vnpay: "VNPay",
  momo: "MoMo",
};

interface SearchParams {
  trang?: string;
  status?: string;
  q?: string;
}

export default async function AdminOrdersPage({ searchParams }: Readonly<{ searchParams: Promise<SearchParams> }>) {
  const { trang, status, q } = await searchParams;
  const page = Number.parseInt(trang ?? "1");
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status && { status: status as never }),
    ...(q && {
      OR: [
        { code: { contains: q, mode: "insensitive" as const } },
        { shippingName: { contains: q, mode: "insensitive" as const } },
        { shippingPhone: { contains: q } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        shippingName: true,
        shippingPhone: true,
        total: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title"><ShoppingCart size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Quản lý đơn hàng</span>
      </div>

      <div className="rethink-admin-table-card">
        <div className="rethink-admin-table-card__header">
          <h3>Tất cả đơn hàng ({total})</h3>
          <div className="rethink-admin-table-card__actions">
            <form method="GET">
              <input
                name="q"
                className="rethink-admin-search-input"
                placeholder="Tìm mã đơn, tên, SĐT..."
                defaultValue={q}
              />
            </form>
            <form method="GET">
              <AutoSubmitSelect
                name="status"
                defaultValue={status ?? ""}
                className="rethink-admin-search-input"
                style={{ width: "auto" }}
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </AutoSubmitSelect>
            </form>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="rethink-admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>SP</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <a
                      href={`/admin/don-hang/${order.id}`}
                      style={{ color: "#2E7D32", fontWeight: 700 }}
                    >
                      {order.code}
                    </a>
                  </td>
                  <td>{order.shippingName}</td>
                  <td>{order.shippingPhone}</td>
                  <td>{order._count.items} SP</td>
                  <td>{PAYMENT_LABELS[order.paymentMethod]}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`rethink-admin-badge rethink-admin-badge--${order.status}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "#616161" }}>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <div className="rethink-admin-action-btns">
                      <a href={`/admin/don-hang/${order.id}`} className="rethink-admin-btn--edit">
                        Chi tiết
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
