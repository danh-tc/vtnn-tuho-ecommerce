import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import "@/styles/components/orders.scss";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đơn hàng của tôi – VTNN Tư Hồ" };

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session) redirect("/dang-nhap?from=tai-khoan/don-hang");

  const userId = parseInt(session.user.id);

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        take: 3,
        select: {
          productName: true,
          variantName: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
        },
      },
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="rethink-orders">
      <div className="rethink-orders__header">
        <ShoppingBag size={22} style={{ color: "#2E7D32", flexShrink: 0 }} />
        <h1>Đơn hàng của tôi</h1>
        <Link href="/tai-khoan">
          <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Tài khoản
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rethink-orders__empty">
          <Package size={56} />
          <h2>Chưa có đơn hàng nào</h2>
          <p>Hãy đặt mua sản phẩm để bắt đầu nhé!</p>
          <Link href="/san-pham">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="rethink-orders__list">
          {orders.map((order) => {
            const statusClass = `rethink-orders__badge--${order.status}`;
            const extraItems = order._count.items - order.items.length;
            return (
              <div key={order.id} className="rethink-orders__card">
                <div className="rethink-orders__card-header">
                  <span className="rethink-orders__code">#{order.code}</span>
                  <span className="rethink-orders__date">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                    })}
                  </span>
                  <span className={`rethink-orders__badge ${statusClass}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                <div className="rethink-orders__items">
                  {order.items.map((item, i) => (
                    <div key={i} className="rethink-orders__item">
                      <div className="rethink-orders__item-name">
                        {item.productName}
                        {item.variantName && (
                          <span style={{ color: "#757575", fontWeight: 400 }}> - {item.variantName}</span>
                        )}
                      </div>
                      <span className="rethink-orders__item-qty">x{item.quantity}</span>
                      <span className="rethink-orders__item-price">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                  {extraItems > 0 && (
                    <p className="rethink-orders__more-items">và {extraItems} sản phẩm khác...</p>
                  )}
                </div>

                <div className="rethink-orders__card-footer">
                  <span className="rethink-orders__total">
                    Tổng cộng: <span>{formatPrice(order.total)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
