import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="rethink-footer">
      <div className="rethink-footer__top">
        {/* Brand */}
        <div className="rethink-footer__brand">
          <div className="rethink-footer__brand-logo">
            VTNN <span>Tư Hồ</span>
          </div>
          <p>
            Chuyên cung cấp vật tư nông nghiệp chất lượng cao: phân bón, thuốc bảo vệ thực vật,
            hạt giống và dụng cụ nông nghiệp. Phục vụ bà con nông dân toàn quốc.
          </p>
          <div className="rethink-footer__brand-contact">
            <span><Phone size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Hotline: 0123 456 789</span>
            <span><Mail size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Email: vtnntuho@gmail.com</span>
            <span><MapPin size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Địa chỉ: Tư Hồ, ...</span>
          </div>
        </div>

        {/* Links */}
        <div className="rethink-footer__col">
          <h4>Sản phẩm</h4>
          <ul>
            <li><Link href="/san-pham?danh-muc=phan-bon">Phân bón</Link></li>
            <li><Link href="/san-pham?danh-muc=thuoc-bvtv">Thuốc BVTV</Link></li>
            <li><Link href="/san-pham?danh-muc=hat-giong">Hạt giống</Link></li>
            <li><Link href="/san-pham?danh-muc=dung-cu">Dụng cụ nông nghiệp</Link></li>
            <li><Link href="/khuyen-mai">Sản phẩm khuyến mãi</Link></li>
          </ul>
        </div>

        <div className="rethink-footer__col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><Link href="/chinh-sach/van-chuyen">Chính sách vận chuyển</Link></li>
            <li><Link href="/chinh-sach/doi-tra">Chính sách đổi trả</Link></li>
            <li><Link href="/chinh-sach/bao-mat">Chính sách bảo mật</Link></li>
            <li><Link href="/huong-dan/dat-hang">Hướng dẫn đặt hàng</Link></li>
            <li><Link href="/lien-he">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="rethink-footer__col">
          <h4>Tài khoản</h4>
          <ul>
            <li><Link href="/dang-nhap">Đăng nhập</Link></li>
            <li><Link href="/dang-ky">Đăng ký</Link></li>
            <li><Link href="/tai-khoan/don-hang">Đơn hàng của tôi</Link></li>
            <li><Link href="/tai-khoan/dia-chi">Sổ địa chỉ</Link></li>
          </ul>
        </div>
      </div>

      <div className="rethink-footer__bottom">
        <p>© {new Date().getFullYear()} VTNN Tư Hồ. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
