import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowLeft, Package } from "lucide-react";
import "@/styles/components/orders.scss";

export const dynamic = "force-dynamic";
export const metadata = { title: "Địa chỉ giao hàng – VTNN Tư Hồ" };

export default async function AddressPage() {
  const session = await auth();
  if (!session) redirect("/dang-nhap?from=tai-khoan/dia-chi");

  const userId = parseInt(session.user.id);

  // Collect unique shipping addresses from past orders
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      createdAt: true,
      shippingName: true,
      shippingPhone: true,
      shippingStreet: true,
      shippingWard: true,
      shippingDistrict: true,
      shippingProvince: true,
    },
  });

  // Deduplicate by full address string
  const seen = new Set<string>();
  const uniqueAddresses = orders.filter((o) => {
    const key = [o.shippingStreet, o.shippingWard, o.shippingDistrict, o.shippingProvince].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="rethink-address">
      <div className="rethink-address__header">
        <MapPin size={22} style={{ color: "#2E7D32", flexShrink: 0 }} />
        <h1>Địa chỉ giao hàng</h1>
        <Link href="/tai-khoan">
          <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          Tài khoản
        </Link>
      </div>

      {uniqueAddresses.length === 0 ? (
        <div className="rethink-address__empty">
          <Package size={56} />
          <h2>Chưa có địa chỉ nào</h2>
          <p>Địa chỉ giao hàng sẽ được lưu tự động sau khi bạn đặt hàng.</p>
          <Link href="/san-pham">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="rethink-address__list">
          {uniqueAddresses.map((addr) => (
            <div key={addr.id} className="rethink-address__card">
              <MapPin size={18} />
              <div className="rethink-address__info">
                <strong>{addr.shippingName} · {addr.shippingPhone}</strong>
                <p>
                  {addr.shippingStreet}, {addr.shippingWard}, {addr.shippingDistrict}, {addr.shippingProvince}
                </p>
                <span className="rethink-address__meta">
                  Dùng lần cuối: {new Date(addr.createdAt).toLocaleDateString("vi-VN")} · Đơn #{addr.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
