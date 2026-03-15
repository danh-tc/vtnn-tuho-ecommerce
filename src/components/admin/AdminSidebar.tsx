"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { type LucideIcon, LayoutDashboard, Package, FolderOpen, Tag, ShoppingCart, Users, Gift, Image, TrendingUp, Leaf, MessageSquare } from "lucide-react";

interface NavItem { href: string; label: string; icon: LucideIcon }
interface NavSection { label: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    label: "Tổng quan",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      { href: "/admin/san-pham", label: "Sản phẩm", icon: Package },
      { href: "/admin/danh-muc", label: "Danh mục", icon: FolderOpen },
      { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: Tag },
    ],
  },
  {
    label: "Bán hàng",
    items: [
      { href: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingCart },
      { href: "/admin/khach-hang", label: "Khách hàng", icon: Users },
      { href: "/admin/khuyen-mai", label: "Khuyến mãi", icon: Gift },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { href: "/admin/banner", label: "Banner", icon: Image },
      { href: "/admin/bao-cao", label: "Báo cáo", icon: TrendingUp },
      { href: "/admin/lien-he", label: "Liên hệ", icon: MessageSquare },
    ],
  },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="rethink-admin-sidebar">
      <div className="rethink-admin-sidebar__logo">
        <div className="rethink-admin-sidebar__logo-icon"><Leaf size={28} /></div>
        <div className="rethink-admin-sidebar__logo-text">
          VTNN <span>Admin</span>
        </div>
        <div className="rethink-admin-sidebar__logo-sub">Quản trị hệ thống</div>
      </div>

      <nav className="rethink-admin-sidebar__nav">
        {NAV.map((section) => (
          <div key={section.label} className="rethink-admin-sidebar__nav-section">
            <div className="rethink-admin-sidebar__nav-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rethink-admin-sidebar__nav-link${isActive(item.href) ? " rethink-admin-sidebar__nav-link--active" : ""}`}
              >
                <span className="rethink-admin-sidebar__nav-icon"><item.icon size={18} /></span>
                <span className="rethink-admin-sidebar__nav-text">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="rethink-admin-sidebar__footer">
        <p>{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/dang-nhap" })}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, padding: 0, marginTop: 4 }}
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
