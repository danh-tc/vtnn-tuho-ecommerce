import Link from "next/link";
import "@/styles/components/policy.scss";

export const metadata = {
  title: "Chính sách đổi trả – VTNN Tư Hồ",
};

export default function ReturnPolicyPage() {
  return (
    <div className="rethink-policy">
      <nav className="rethink-policy__breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <span>Chính sách đổi trả</span>
      </nav>

      <div className="rethink-policy__header">
        <h1>Chính sách đổi trả</h1>
        <p>Cam kết của chúng tôi về chất lượng sản phẩm và quyền lợi của khách hàng</p>
      </div>

      <div className="rethink-policy__body">
        <div className="highlight-box">
          <p>✅ Hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất</p>
        </div>

        <h2>1. Điều kiện đổi trả hàng</h2>
        <p>Sản phẩm được chấp nhận đổi/trả khi đáp ứng các điều kiện sau:</p>
        <ul>
          <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng (trừ trường hợp lỗi nhà sản xuất).</li>
          <li>Còn đầy đủ bao bì, nhãn mác, hóa đơn mua hàng.</li>
          <li>Yêu cầu đổi/trả được thực hiện trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng.</li>
          <li>Có bằng chứng (hình ảnh, video) về tình trạng lỗi của sản phẩm.</li>
        </ul>

        <h2>2. Các trường hợp được hỗ trợ đổi trả</h2>
        <ul>
          <li>Sản phẩm bị lỗi, hỏng do nhà sản xuất.</li>
          <li>Sản phẩm giao sai chủng loại, quy cách, số lượng so với đơn hàng.</li>
          <li>Sản phẩm hết hạn sử dụng hoặc hết hạn đăng ký tại thời điểm giao hàng.</li>
          <li>Sản phẩm bị vỡ, rò rỉ do quá trình vận chuyển (kèm bằng chứng khi nhận hàng).</li>
        </ul>

        <h2>3. Các trường hợp không được đổi trả</h2>
        <ul>
          <li>Sản phẩm đã qua sử dụng, không còn nguyên vẹn.</li>
          <li>Sản phẩm bị hỏng do người dùng (bảo quản sai, sử dụng không đúng cách).</li>
          <li>Sản phẩm đã được pha trộn, mở nắp (đối với hàng lỏng, hạt giống).</li>
          <li>Yêu cầu đổi trả sau 7 ngày kể từ ngày nhận hàng.</li>
          <li>Không có hóa đơn/bằng chứng mua hàng.</li>
        </ul>

        <h2>4. Quy trình đổi/trả hàng</h2>
        <ol>
          <li>Liên hệ hotline <strong>098 99 77 884</strong> hoặc gửi yêu cầu qua trang <Link href="/lien-he">Liên hệ</Link> với đầy đủ thông tin: mã đơn hàng, hình ảnh lỗi, lý do đổi trả.</li>
          <li>Nhân viên xem xét và phản hồi trong vòng <strong>1 – 2 ngày làm việc</strong>.</li>
          <li>Nếu được chấp thuận: gửi hàng về địa chỉ kho theo hướng dẫn.</li>
          <li>Chúng tôi kiểm tra và gửi hàng đổi mới hoặc hoàn tiền trong vòng <strong>3 – 5 ngày làm việc</strong>.</li>
        </ol>

        <h2>5. Phí vận chuyển đổi trả</h2>
        <ul>
          <li><strong>Lỗi do chúng tôi:</strong> Toàn bộ phí vận chuyển được VTNN Tư Hồ chịu.</li>
          <li><strong>Lý do cá nhân của khách hàng:</strong> Khách hàng chịu phí vận chuyển hai chiều.</li>
        </ul>

        <h2>6. Hoàn tiền</h2>
        <p>
          Trong trường hợp không còn hàng để đổi, chúng tôi sẽ hoàn tiền cho khách hàng
          qua hình thức chuyển khoản ngân hàng trong vòng <strong>3 – 7 ngày làm việc</strong>.
        </p>
      </div>

      <p className="rethink-policy__updated">Cập nhật lần cuối: tháng 1 năm 2025</p>
    </div>
  );
}
