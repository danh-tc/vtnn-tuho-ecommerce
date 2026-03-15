import Link from "next/link";
import { ShoppingCart, ClipboardList, Truck, CheckCircle } from "lucide-react";
import "@/styles/components/policy.scss";

export const metadata = {
  title: "Hướng dẫn đặt hàng – VTNN Tư Hồ",
};

const steps = [
  {
    icon: ShoppingCart,
    title: "Bước 1: Chọn sản phẩm",
    desc: 'Duyệt qua danh mục sản phẩm, chọn mặt hàng cần mua và nhấn "Thêm vào giỏ" hoặc "Mua ngay".',
  },
  {
    icon: ClipboardList,
    title: "Bước 2: Xác nhận giỏ hàng",
    desc: "Kiểm tra lại các sản phẩm, số lượng trong giỏ hàng. Điều chỉnh số lượng hoặc xóa sản phẩm nếu cần.",
  },
  {
    icon: Truck,
    title: "Bước 3: Điền thông tin giao hàng",
    desc: "Nhập họ tên, số điện thoại và địa chỉ giao hàng chính xác. Chọn phương thức thanh toán phù hợp.",
  },
  {
    icon: CheckCircle,
    title: "Bước 4: Xác nhận đặt hàng",
    desc: 'Kiểm tra lại toàn bộ thông tin và nhấn "Đặt hàng". Nhân viên sẽ liên hệ xác nhận trong vòng 2 giờ làm việc.',
  },
];

export default function OrderGuidePage() {
  return (
    <div className="rethink-policy">
      <nav className="rethink-policy__breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <span>Hướng dẫn đặt hàng</span>
      </nav>

      <div className="rethink-policy__header">
        <h1>Hướng dẫn đặt hàng</h1>
        <p>Mua sắm tại VTNN Tư Hồ chỉ với 4 bước đơn giản</p>
      </div>

      <div className="rethink-policy__body">
        {/* Steps visual */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} style={{
                background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
                border: "1px solid #c8e6c9",
                borderRadius: 10,
                padding: "20px 16px",
                textAlign: "center",
              }}>
                <div style={{
                  width: 48, height: 48,
                  background: "#2E7D32",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#1B5E20", marginBottom: 6 }}>{step.title}</p>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 0 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>

        <h2>1. Đặt hàng trực tuyến</h2>
        <h3>Bước 1: Tìm kiếm và chọn sản phẩm</h3>
        <ul>
          <li>Truy cập <Link href="/san-pham">trang sản phẩm</Link> và tìm kiếm theo tên hoặc lọc theo danh mục.</li>
          <li>Nhấp vào sản phẩm để xem chi tiết, thông tin kỹ thuật và hướng dẫn sử dụng.</li>
          <li>Chọn quy cách (nếu có) và nhấn <strong>&ldquo;Thêm vào giỏ&rdquo;</strong> hoặc <strong>&ldquo;Mua ngay&rdquo;</strong>.</li>
        </ul>

        <h3>Bước 2: Kiểm tra giỏ hàng</h3>
        <ul>
          <li>Nhấn biểu tượng giỏ hàng ở góc trên để xem các sản phẩm đã chọn.</li>
          <li>Điều chỉnh số lượng bằng nút <strong>+</strong> / <strong>−</strong> hoặc xóa sản phẩm không cần.</li>
          <li>Kiểm tra tổng tiền và phí vận chuyển (miễn phí từ 500.000đ).</li>
          <li>Nhấn <strong>&ldquo;Tiến hành đặt hàng&rdquo;</strong> để tiếp tục.</li>
        </ul>

        <h3>Bước 3: Điền thông tin giao hàng</h3>
        <ul>
          <li>Nhập <strong>Họ tên</strong> người nhận hàng (đầy đủ, không viết tắt).</li>
          <li>Nhập <strong>Số điện thoại</strong> liên lạc (bắt buộc để xác nhận đơn).</li>
          <li>Chọn <strong>Tỉnh/Thành</strong> → <strong>Quận/Huyện</strong> → <strong>Phường/Xã</strong>.</li>
          <li>Nhập <strong>Địa chỉ cụ thể</strong>: số nhà, tên đường, ấp/khu phố.</li>
        </ul>

        <h3>Bước 4: Chọn phương thức thanh toán</h3>
        <table>
          <thead>
            <tr><th>Phương thức</th><th>Mô tả</th></tr>
          </thead>
          <tbody>
            <tr><td>Tiền mặt (COD)</td><td>Thanh toán khi nhận hàng</td></tr>
            <tr><td>Chuyển khoản</td><td>Chuyển khoản ngân hàng trước khi giao</td></tr>
            <tr><td>VNPay</td><td>Thanh toán qua cổng VNPay (ATM, Visa, QR)</td></tr>
            <tr><td>MoMo</td><td>Thanh toán qua ví điện tử MoMo</td></tr>
          </tbody>
        </table>

        <h2>2. Đặt hàng qua điện thoại</h2>
        <p>
          Bạn cũng có thể đặt hàng trực tiếp qua hotline <strong>098 99 77 884</strong>.
          Nhân viên sẽ hỗ trợ tư vấn sản phẩm và xử lý đơn hàng trong giờ làm việc
          (Thứ 2 – Chủ Nhật: 7:00 – 22:00).
        </p>

        <h2>3. Theo dõi và nhận đơn hàng</h2>
        <ul>
          <li>Sau khi đặt hàng thành công, bạn nhận được mã đơn hàng để tra cứu.</li>
          <li>Nhân viên xác nhận đơn trong vòng 2 giờ làm việc.</li>
          <li>Đơn hàng được đóng gói và giao cho đơn vị vận chuyển trong ngày.</li>
          <li>Bạn nhận được mã vận đơn để theo dõi tình trạng giao hàng.</li>
        </ul>

        <div className="highlight-box">
          <p>📞 Mọi thắc mắc về đơn hàng, liên hệ ngay hotline 098 99 77 884 - chúng tôi luôn sẵn sàng hỗ trợ bạn!</p>
        </div>
      </div>
    </div>
  );
}
