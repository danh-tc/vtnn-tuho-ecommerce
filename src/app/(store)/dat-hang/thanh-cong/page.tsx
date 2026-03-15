import Link from "next/link";
import { CheckCircle, Phone } from "lucide-react";

interface Props {
  searchParams: Promise<{ ma?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { ma: orderCode } = await searchParams;

  return (
    <div className="rethink-order-success">
      <div className="rethink-order-success__card">
        <div className="rethink-order-success__icon"><CheckCircle size={64} /></div>
        <h1 className="rethink-order-success__title">Đặt hàng thành công!</h1>
        {orderCode && (
          <p className="rethink-order-success__code">
            Mã đơn hàng: <strong>{orderCode}</strong>
          </p>
        )}
        <p className="rethink-order-success__message">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận đơn trong vòng 30 phút.
        </p>

        <div className="rethink-order-success__info-box">
          <h3><Phone size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Thông tin liên hệ</h3>
          <p>Hotline: <strong>098 99 77 884</strong></p>
          <p>Thứ 2 – Chủ Nhật: 7:00 – 22:00</p>
        </div>

        <div className="rethink-order-success__actions">
          <Link href="/tai-khoan/don-hang" className="rethink-order-success__btn--primary">
            Xem đơn hàng của tôi
          </Link>
          <Link href="/san-pham" className="rethink-order-success__btn--outline">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
