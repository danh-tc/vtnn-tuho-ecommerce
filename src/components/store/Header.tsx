"use client";

import Link from "next/link";

import { Phone, Search, User, ShoppingCart, Flame } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { usePathname } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const cartCount = useCartStore((s) => s.totalItems());
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const isHeroPage = pathname === "/";
  const isOverlay = isHeroPage && !scrolled;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Set --header-h CSS var to the real rendered height — runs before paint
  useLayoutEffect(() => {
    const update = () => {
      if (!headerRef.current) return;
      document.documentElement.style.setProperty("--header-h", `${headerRef.current.offsetHeight}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isOverlay]); // re-measure when top bar appears/disappears

  return (
    <header ref={headerRef} className={`rethink-header${isOverlay ? " rethink-header--overlay" : ""}`}>
      {/* Top bar */}
      <div className="rethink-header__top-bar">
        <div className="rethink-header__top-bar-inner">
          <span><Phone size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />Hotline: 098 99 77 884 | Giao hàng toàn quốc</span>
          <span>Thứ 2 – Thứ 7: 7:00 – 17:30</span>
        </div>
      </div>

      {/* Main header */}
      <div className="rethink-header__main">
        <Link href="/" className="rethink-header__logo">
          <div>
            <div className="rethink-header__logo-text">
              VTNN <span>Tư Hồ</span>
            </div>
            <div className="rethink-header__logo-sub">Đồng hành cùng nhà nông</div>
          </div>
        </Link>

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

        <div className="rethink-header__actions">
          <Link href={session ? "/tai-khoan" : "/dang-nhap"} className="rethink-header__action-btn">
            <span className="rethink-header__action-icon"><User size={20} /></span>
            <span>{session ? session.user.name?.split(" ").pop() : "Tài khoản"}</span>
          </Link>

          <Link href="/gio-hang" className="rethink-header__action-btn">
            <span className="rethink-header__action-icon">
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && (
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
          <Link href="/khuyen-mai" className="rethink-header__nav-link">
            <Flame size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />Khuyến mãi
          </Link>
        </div>
      </nav>
    </header>
  );
}
