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

  const userId = Number.parseInt(session.user.id);

  // Try Address table first
  const addressRows = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  });

  type DisplayAddress = {
    key: string;
    recipientName: string;
    phone: string;
    street: string;
    wardName: string;
    districtName: string;
    provinceName: string;
    isDefault: boolean;
    meta?: string;
  };

  let displayAddresses: DisplayAddress[] = [];

  if (addressRows.length > 0) {
    displayAddresses = addressRows.map((a) => ({
      key: String(a.id),
      recipientName: a.recipientName,
      phone: a.phone,
      street: a.street,
      wardName: a.wardName,
      districtName: a.districtName,
      provinceName: a.provinceName,
      isDefault: a.isDefault,
    }));
  } else {
    // Fallback: deduplicate from order history
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

    const seen = new Set<string>();
    displayAddresses = orders
      .filter((o) => {
        const key = [o.shippingStreet, o.shippingWard, o.shippingDistrict, o.shippingProvince].join("|");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((o) => ({
        key: String(o.id),
        recipientName: o.shippingName,
        phone: o.shippingPhone,
        street: o.shippingStreet,
        wardName: o.shippingWard,
        districtName: o.shippingDistrict,
        provinceName: o.shippingProvince,
        isDefault: false,
        meta: `Dùng lần cuối: ${new Date(o.createdAt).toLocaleDateString("vi-VN")} · Đơn #${o.code}`,
      }));
  }

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

      {displayAddresses.length === 0 ? (
        <div className="rethink-address__empty">
          <Package size={56} />
          <h2>Chưa có địa chỉ nào</h2>
          <p>Địa chỉ giao hàng sẽ được lưu tự động sau khi bạn đặt hàng.</p>
          <Link href="/san-pham">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="rethink-address__list">
          {displayAddresses.map((addr) => (
            <div key={addr.key} className="rethink-address__card">
              <MapPin size={18} />
              <div className="rethink-address__info">
                <strong>
                  {addr.recipientName} · {addr.phone}
                  {addr.isDefault && (
                    <span style={{
                      marginLeft: 8, fontSize: 11, fontWeight: 700,
                      background: "#E8F5E9", color: "#2E7D32",
                      padding: "1px 6px", borderRadius: 4,
                    }}>
                      Mặc định
                    </span>
                  )}
                </strong>
                <p>{addr.street}, {addr.wardName}, {addr.districtName}, {addr.provinceName}</p>
                {addr.meta && <span className="rethink-address__meta">{addr.meta}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
