import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard" };

async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalOrders,
    pendingOrders,
    monthRevenue,
    totalProducts,
    lowStockVariants,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: thisMonth },
        paymentStatus: "paid",
      },
      _sum: { total: true },
    }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        shippingName: true,
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    monthRevenue: monthRevenue._sum.total ?? 0,
    totalProducts,
    lowStockVariants,
    recentOrders,
  };
}

const ORDER_STATUS_LABELS: Record<string, string> = {
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

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title"><LayoutDashboard size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Dashboard</span>
      </div>

      {/* Stat cards */}
      <div className="rethink-admin-stats-grid">
        <div className="rethink-admin-stat-card">
          <div className="rethink-admin-stat-card__label">Doanh thu tháng này</div>
          <div className="rethink-admin-stat-card__value">{formatPrice(stats.monthRevenue)}</div>
          <div className="rethink-admin-stat-card__sub">Đơn đã thanh toán</div>
        </div>
        <div className="rethink-admin-stat-card rethink-admin-stat-card--warning">
          <div className="rethink-admin-stat-card__label">Đơn chờ xác nhận</div>
          <div className="rethink-admin-stat-card__value">{stats.pendingOrders}</div>
          <div className="rethink-admin-stat-card__sub">Cần xử lý ngay</div>
        </div>
        <div className="rethink-admin-stat-card">
          <div className="rethink-admin-stat-card__label">Tổng đơn hàng</div>
          <div className="rethink-admin-stat-card__value">{stats.totalOrders}</div>
          <div className="rethink-admin-stat-card__sub">Tất cả trạng thái</div>
        </div>
        <div className={`rethink-admin-stat-card${stats.lowStockVariants > 0 ? " rethink-admin-stat-card--danger" : ""}`}>
          <div className="rethink-admin-stat-card__label">Sắp hết hàng</div>
          <div className="rethink-admin-stat-card__value">{stats.lowStockVariants}</div>
          <div className="rethink-admin-stat-card__sub">Sản phẩm ≤ 5 cái</div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rethink-admin-table-card">
        <div className="rethink-admin-table-card__header">
          <h3>Đơn hàng gần đây</h3>
          <Link href="/admin/don-hang" className="rethink-admin-btn--add">Xem tất cả</Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="rethink-admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <a href={`/admin/don-hang/${order.id}`} style={{ color: "#2E7D32", fontWeight: 700 }}>
                      {order.code}
                    </a>
                  </td>
                  <td>{order.shippingName}</td>
                  <td>{PAYMENT_LABELS[order.paymentMethod]}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.total)}</td>
                  <td>
                    <span className={`rethink-admin-badge rethink-admin-badge--${order.status}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td style={{ color: "#616161", fontSize: 13 }}>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
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
