import Link from "next/link";
import "@/styles/components/policy.scss";

export const metadata = {
  title: "Chính sách bảo mật – VTNN Tư Hồ",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="rethink-policy">
      <nav className="rethink-policy__breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <span>Chính sách bảo mật</span>
      </nav>

      <div className="rethink-policy__header">
        <h1>Chính sách bảo mật</h1>
        <p>Cam kết bảo vệ thông tin cá nhân của khách hàng</p>
      </div>

      <div className="rethink-policy__body">
        <p>
          VTNN Tư Hồ cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng.
          Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn
          khi sử dụng website và dịch vụ của chúng tôi.
        </p>

        <h2>1. Thông tin chúng tôi thu thập</h2>
        <h3>Thông tin bạn cung cấp trực tiếp</h3>
        <ul>
          <li>Họ tên, số điện thoại, địa chỉ email khi đăng ký tài khoản.</li>
          <li>Địa chỉ giao hàng khi đặt hàng.</li>
          <li>Nội dung liên lạc khi gửi yêu cầu hỗ trợ.</li>
        </ul>
        <h3>Thông tin thu thập tự động</h3>
        <ul>
          <li>Địa chỉ IP, loại trình duyệt, thiết bị sử dụng.</li>
          <li>Lịch sử duyệt web trên website của chúng tôi.</li>
          <li>Thông tin giỏ hàng và lịch sử mua hàng.</li>
        </ul>

        <h2>2. Mục đích sử dụng thông tin</h2>
        <p>Chúng tôi sử dụng thông tin của bạn để:</p>
        <ul>
          <li>Xử lý đơn hàng và giao hàng đến địa chỉ của bạn.</li>
          <li>Liên hệ xác nhận đơn hàng và hỗ trợ khách hàng.</li>
          <li>Cải thiện trải nghiệm mua sắm và nội dung website.</li>
          <li>Gửi thông tin về chương trình khuyến mãi (nếu bạn đồng ý).</li>
          <li>Phòng chống gian lận và bảo mật tài khoản.</li>
        </ul>

        <h2>3. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin cá nhân
          của bạn, bao gồm:
        </p>
        <ul>
          <li>Mã hóa dữ liệu truyền tải bằng giao thức HTTPS/SSL.</li>
          <li>Mật khẩu được băm (hashed) và không thể đọc được dưới dạng văn bản thuần.</li>
          <li>Giới hạn quyền truy cập dữ liệu chỉ cho nhân viên có thẩm quyền.</li>
          <li>Không lưu trữ thông tin thẻ ngân hàng trên hệ thống của chúng tôi.</li>
        </ul>

        <h2>4. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi <strong>không bán hoặc cho thuê</strong> thông tin cá nhân của bạn cho bên thứ ba.
          Thông tin chỉ được chia sẻ trong các trường hợp:
        </p>
        <ul>
          <li>Đối tác vận chuyển để thực hiện giao hàng (họ tên, số điện thoại, địa chỉ).</li>
          <li>Đối tác thanh toán để xử lý giao dịch (VNPay, MoMo).</li>
          <li>Yêu cầu từ cơ quan pháp luật có thẩm quyền.</li>
        </ul>

        <h2>5. Cookie</h2>
        <p>
          Website sử dụng cookie để lưu trữ thông tin giỏ hàng và cải thiện trải nghiệm duyệt web.
          Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể bị ảnh hưởng.
        </p>

        <h2>6. Quyền của bạn</h2>
        <p>Bạn có quyền:</p>
        <ul>
          <li>Yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân.</li>
          <li>Hủy đăng ký nhận email khuyến mãi bất kỳ lúc nào.</li>
          <li>Khiếu nại về việc sử dụng thông tin của bạn.</li>
        </ul>
        <p>
          Để thực hiện các quyền trên, vui lòng liên hệ qua trang <Link href="/lien-he">Liên hệ</Link> hoặc
          gọi hotline <strong>098 99 77 884</strong>.
        </p>

        <h2>7. Thay đổi chính sách</h2>
        <p>
          Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo
          trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn
          chấp nhận chính sách mới.
        </p>
      </div>

      <p className="rethink-policy__updated">Cập nhật lần cuối: tháng 1 năm 2025</p>
    </div>
  );
}
