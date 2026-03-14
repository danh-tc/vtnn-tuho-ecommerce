"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Search, User, ShoppingCart, Flame } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function Header() {
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <header className="rethink-header">
      {/* Top bar */}
      <div className="rethink-header__top-bar">
        <div className="rethink-header__top-bar-inner">
          <span><Phone size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />Hotline: 0123 456 789 | Giao hàng toàn quốc</span>
          <span>Thứ 2 – Thứ 7: 7:00 – 17:30</span>
        </div>
      </div>

      {/* Main header */}
      <div className="rethink-header__main">
        {/* Logo */}
        <Link href="/" className="rethink-header__logo">
          <Image src="/favicon.ico" alt="VTNN Tư Hồ" width={36} height={36} className="rethink-header__logo-icon" />
          <div>
            <div className="rethink-header__logo-text">
              VTNN <span>Tư Hồ</span>
            </div>
            <div className="rethink-header__logo-sub">Vật tư nông nghiệp</div>
          </div>
        </Link>

        {/* Search */}
        <div className="rethink-header__search">
          <form action="/san-pham" method="GET">
            <input
              name="q"
              type="search"
              placeholder="Tìm phân bón, thuốc BVTV, hạt giống..."
              autoComplete="off"
            />
            <button type="submit" aria-label="Tìm kiếm">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="rethink-header__actions">
          <Link href="/dang-nhap" className="rethink-header__action-btn">
            <span className="rethink-header__action-icon"><User size={22} /></span>
            <span>Tài khoản</span>
          </Link>

          <Link href="/gio-hang" className="rethink-header__action-btn">
            <span className="rethink-header__action-icon">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="rethink-header__cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </span>
            <span>Giỏ hàng</span>
          </Link>
        </div>
      </div>

      {/* Category nav */}
      <nav className="rethink-header__nav">
        <div className="rethink-header__nav-inner">
          <Link href="/san-pham" className="rethink-header__nav-link">Tất cả sản phẩm</Link>
          <Link href="/san-pham?danh-muc=phan-bon" className="rethink-header__nav-link">Phân bón</Link>
          <Link href="/san-pham?danh-muc=thuoc-bvtv" className="rethink-header__nav-link">Thuốc BVTV</Link>
          <Link href="/san-pham?danh-muc=hat-giong" className="rethink-header__nav-link">Hạt giống</Link>
          <Link href="/san-pham?danh-muc=dung-cu" className="rethink-header__nav-link">Dụng cụ nông nghiệp</Link>
          <Link href="/khuyen-mai" className="rethink-header__nav-link"><Flame size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />Khuyến mãi</Link>
        </div>
      </nav>
    </header>
  );
}
