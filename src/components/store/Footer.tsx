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
            <span><Phone size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Hotline: 098 99 77 884</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 48 48" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}><path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path></svg>Zalo: 098 99 77 884</span>
            <span><Mail size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Email: vtnntuho.2010@gmail.com</span>
            <span><MapPin size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Địa chỉ: 98 Ấp Thạnh Lập, xã Thạnh Phú, huyện Thạnh Hóa, tỉnh Long An.</span>
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
