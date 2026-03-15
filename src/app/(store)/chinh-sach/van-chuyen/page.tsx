import Link from "next/link";
import "@/styles/components/policy.scss";

export const metadata = {
  title: "Chính sách vận chuyển – VTNN Tư Hồ",
};

export default function ShippingPolicyPage() {
  return (
    <div className="rethink-policy">
      <nav className="rethink-policy__breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <span>Chính sách vận chuyển</span>
      </nav>

      <div className="rethink-policy__header">
        <h1>Chính sách vận chuyển</h1>
        <p>Thông tin về phí vận chuyển, thời gian giao hàng và khu vực phục vụ</p>
      </div>

      <div className="rethink-policy__body">
        <div className="highlight-box">
          <p>🚚 Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ</p>
        </div>

        <h2>1. Phạm vi giao hàng</h2>
        <p>
          VTNN Tư Hồ giao hàng toàn quốc thông qua các đối tác vận chuyển uy tín. Chúng tôi hỗ trợ giao
          hàng đến tất cả 63 tỉnh thành trên cả nước.
        </p>

        <h2>2. Phí vận chuyển</h2>
        <table>
          <thead>
            <tr>
              <th>Giá trị đơn hàng</th>
              <th>Phí vận chuyển</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dưới 500.000đ</td>
              <td>30.000đ</td>
              <td>Áp dụng toàn quốc</td>
            </tr>
            <tr>
              <td>Từ 500.000đ trở lên</td>
              <td>Miễn phí</td>
              <td>Toàn quốc</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Thời gian giao hàng</h2>
        <p>Thời gian giao hàng tính từ khi đơn hàng được xác nhận:</p>
        <ul>
          <li><strong>Khu vực nội thành Bến Tre:</strong> 1 – 2 ngày làm việc</li>
          <li><strong>Các tỉnh Đồng bằng sông Cửu Long:</strong> 2 – 3 ngày làm việc</li>
          <li><strong>TP. Hồ Chí Minh & các tỉnh miền Nam:</strong> 2 – 4 ngày làm việc</li>
          <li><strong>Miền Trung & Tây Nguyên:</strong> 3 – 5 ngày làm việc</li>
          <li><strong>Miền Bắc:</strong> 4 – 7 ngày làm việc</li>
        </ul>

        <p>
          Lưu ý: Thời gian trên chỉ mang tính chất tham khảo. Trong trường hợp thời tiết xấu,
          lễ tết hoặc tình huống bất khả kháng, thời gian giao hàng có thể kéo dài hơn.
        </p>

        <h2>4. Quy trình xử lý đơn hàng</h2>
        <ol>
          <li>Sau khi đặt hàng, bạn sẽ nhận được thông báo xác nhận qua số điện thoại.</li>
          <li>Nhân viên sẽ liên hệ xác nhận lại thông tin đơn hàng trong vòng 2 giờ làm việc.</li>
          <li>Đơn hàng được đóng gói và chuyển cho đơn vị vận chuyển trong ngày làm việc.</li>
          <li>Bạn nhận được mã vận đơn để theo dõi tình trạng giao hàng.</li>
        </ol>

        <h2>5. Theo dõi đơn hàng</h2>
        <p>
          Sau khi đơn hàng được bàn giao cho đơn vị vận chuyển, chúng tôi sẽ gửi mã vận đơn
          qua số điện thoại. Bạn có thể tra cứu trực tiếp trên website của đối tác vận chuyển
          hoặc liên hệ hotline <strong>098 99 77 884</strong> để được hỗ trợ.
        </p>

        <h2>6. Lưu ý khi nhận hàng</h2>
        <ul>
          <li>Kiểm tra kỹ hàng hóa trước khi ký nhận.</li>
          <li>Nếu phát hiện hàng bị hỏng, thiếu hàng - ghi chú ngay với shipper và liên hệ chúng tôi trong vòng 24 giờ.</li>
          <li>Không nhận hàng nếu kiện hàng bị rách, ướt hoặc có dấu hiệu bất thường.</li>
        </ul>
      </div>

      <p className="rethink-policy__updated">Cập nhật lần cuối: tháng 1 năm 2025</p>
    </div>
  );
}
