import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Phone, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";
import SignOutButton from "@/components/store/SignOutButton";
import "@/styles/components/auth.scss";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/dang-nhap?from=tai-khoan");

  const user = session.user;

  const roleMap: Record<string, string> = { admin: "Quản trị viên", staff: "Nhân viên", customer: "Khách hàng" };
  const roleLabel = roleMap[user.role] ?? "Khách hàng";

  return (
    <div className="rethink-account">
      <div className="rethink-account__header">
        <div className="rethink-account__avatar">
          <User size={40} />
        </div>
        <div>
          <h1 className="rethink-account__name">{user.name}</h1>
          <p className="rethink-account__role">{roleLabel}</p>
        </div>
      </div>

      <div className="rethink-account__info">
        <div className="rethink-account__info-item">
          <Phone size={16} />
          <span>{(user as { phone?: string }).phone ?? "-"}</span>
        </div>
      </div>

      <div className="rethink-account__actions">
        <Link href="/tai-khoan/don-hang" className="rethink-account__action-btn">
          <ShoppingBag size={18} />
          Đơn hàng của tôi
        </Link>
        <Link href="/tai-khoan/dia-chi" className="rethink-account__action-btn">
          <MapPin size={18} />
          Địa chỉ giao hàng
        </Link>

        {(user.role === "admin" || user.role === "staff") && (
          <Link href="/admin" className="rethink-account__action-btn">
            Trang quản trị
          </Link>
        )}

        <SignOutButton />
      </div>
    </div>
  );
}
