"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, CreditCard, Banknote, Building2, Wallet, MapPin, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

const checkoutSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0912345678)"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  ward: z.string().min(1, "Vui lòng nhập phường/xã"),
  street: z.string().min(5, "Vui lòng nhập địa chỉ chi tiết"),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer", "vnpay", "momo"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface SavedAddress {
  id: number;
  recipientName: string;
  phone: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  street: string;
  isDefault: boolean;
}

interface Props {
  initialData: { name: string; phone: string } | null;
  savedAddresses: SavedAddress[];
}

export default function CheckoutForm({ initialData, savedAddresses }: Props) {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    savedAddresses.find((a) => a.isDefault)?.id ?? savedAddresses[0]?.id ?? null
  );
  const [showAddressPicker, setShowAddressPicker] = useState(savedAddresses.length > 0);

  const subtotal = totalPrice();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  // Find default or first address to pre-fill
  const defaultAddr = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      province: defaultAddr?.provinceName ?? "",
      district: defaultAddr?.districtName ?? "",
      ward: defaultAddr?.wardName ?? "",
      street: defaultAddr?.street ?? "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  // Fill form fields when a saved address is selected
  function applyAddress(addr: SavedAddress) {
    setSelectedAddressId(addr.id);
    setValue("province", addr.provinceName, { shouldValidate: true });
    setValue("district", addr.districtName, { shouldValidate: true });
    setValue("ward", addr.wardName, { shouldValidate: true });
    setValue("street", addr.street, { shouldValidate: true });
    // Also fill name/phone from the saved address contact
    setValue("name", addr.recipientName, { shouldValidate: true });
    setValue("phone", addr.phone, { shouldValidate: true });
  }

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: {
            name: data.name,
            phone: data.phone,
            province: data.province,
            district: data.district,
            ward: data.ward,
            street: data.street,
          },
          note: data.note,
          paymentMethod: data.paymentMethod,
          items: items.map((i) => ({
            variantId: i.variantId,
            productName: i.productName,
            variantName: i.variantName,
            sku: i.sku,
            unitPrice: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          shippingFee,
          total,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Có lỗi xảy ra");

      if (data.paymentMethod === "vnpay" && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      if (data.paymentMethod === "momo" && result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }

      clearCart();
      router.push(`/dat-hang/thanh-cong?ma=${result.orderCode}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.replace("/gio-hang");
    return null;
  }

  return (
    <div className="rethink-checkout">
      <h1 className="rethink-checkout__title">Đặt hàng</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rethink-checkout__layout">
          {/* Left: Form */}
          <div>
            <div className="rethink-checkout__section">
              <h2>
                <Package size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Thông tin giao hàng
              </h2>

              {/* Saved address picker */}
              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddressPicker((v) => !v)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600,
                      color: "#2E7D32", background: "#E8F5E9",
                      border: "1px solid #A5D6A7",
                      borderRadius: 6, padding: "6px 12px",
                      cursor: "pointer", marginBottom: 10,
                    }}
                  >
                    <MapPin size={14} />
                    Địa chỉ đã lưu ({savedAddresses.length})
                    <ChevronDown size={14} style={{ transform: showAddressPicker ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
                  </button>

                  {showAddressPicker && (
                    <div style={{
                      border: "1px solid #E0E0E0", borderRadius: 8,
                      overflow: "hidden", marginBottom: 4,
                    }}>
                      {savedAddresses.map((addr, idx) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => applyAddress(addr)}
                          style={{
                            width: "100%", textAlign: "left",
                            padding: "10px 14px",
                            borderTop: idx > 0 ? "1px solid #F5F5F5" : undefined,
                            background: selectedAddressId === addr.id ? "#F1F8E9" : "#fff",
                            border: "none", cursor: "pointer",
                            display: "flex", alignItems: "flex-start", gap: 10,
                          }}
                        >
                          <div style={{
                            width: 16, height: 16, borderRadius: "50%",
                            border: `2px solid ${selectedAddressId === addr.id ? "#2E7D32" : "#BDBDBD"}`,
                            background: selectedAddressId === addr.id ? "#2E7D32" : "transparent",
                            flexShrink: 0, marginTop: 2,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {selectedAddressId === addr.id && (
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {addr.recipientName}
                              {addr.isDefault && (
                                <span style={{
                                  marginLeft: 8, fontSize: 11, fontWeight: 700,
                                  background: "#E8F5E9", color: "#2E7D32",
                                  padding: "1px 6px", borderRadius: 4,
                                }}>
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 13, color: "#616161", marginTop: 2 }}>{addr.phone}</div>
                            <div style={{ fontSize: 13, color: "#424242", marginTop: 1 }}>
                              {addr.street}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="rethink-checkout__form-grid">
                <div className="rethink-checkout__form-group">
                  <label>Họ và tên *</label>
                  <input {...register("name")} placeholder="Nguyễn Văn A" />
                  {errors.name && <span className="rethink-checkout__error">{errors.name.message}</span>}
                </div>

                <div className="rethink-checkout__form-group">
                  <label>Số điện thoại *</label>
                  <input {...register("phone")} placeholder="0912345678" type="tel" />
                  {errors.phone && <span className="rethink-checkout__error">{errors.phone.message}</span>}
                </div>

                <div className="rethink-checkout__form-group">
                  <label>Tỉnh / Thành phố *</label>
                  <input {...register("province")} placeholder="VD: Hà Nội" />
                  {errors.province && <span className="rethink-checkout__error">{errors.province.message}</span>}
                </div>

                <div className="rethink-checkout__form-group">
                  <label>Quận / Huyện *</label>
                  <input {...register("district")} placeholder="VD: Quận Hoàn Kiếm" />
                  {errors.district && <span className="rethink-checkout__error">{errors.district.message}</span>}
                </div>

                <div className="rethink-checkout__form-group">
                  <label>Phường / Xã *</label>
                  <input {...register("ward")} placeholder="VD: Phường Hàng Bông" />
                  {errors.ward && <span className="rethink-checkout__error">{errors.ward.message}</span>}
                </div>

                <div className="rethink-checkout__form-group">
                  <label>Địa chỉ chi tiết *</label>
                  <input {...register("street")} placeholder="Số nhà, tên đường" />
                  {errors.street && <span className="rethink-checkout__error">{errors.street.message}</span>}
                </div>

                <div className="rethink-checkout__form-group rethink-checkout__form-group--full-width">
                  <label>Ghi chú đơn hàng</label>
                  <textarea
                    {...register("note")}
                    placeholder="Ghi chú thêm (thời gian giao hàng, yêu cầu đặc biệt...)"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rethink-checkout__section">
              <h2>
                <CreditCard size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
                Phương thức thanh toán
              </h2>
              <div className="rethink-checkout__payment-methods">
                {[
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt khi nhận hàng", icon: <Banknote size={20} />, disabled: false },
                  { value: "bank_transfer", label: "Chuyển khoản ngân hàng / QR", desc: "Sắp ra mắt", icon: <Building2 size={20} />, disabled: true },
                  { value: "vnpay", label: "VNPay", desc: "Sắp ra mắt", icon: <CreditCard size={20} />, disabled: true },
                  { value: "momo", label: "Ví MoMo", desc: "Sắp ra mắt", icon: <Wallet size={20} />, disabled: true },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`rethink-checkout__payment-option${selectedPayment === opt.value ? " rethink-checkout__payment-option--selected" : ""}${opt.disabled ? " rethink-checkout__payment-option--disabled" : ""}`}
                    style={opt.disabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
                  >
                    <input type="radio" value={opt.value} {...register("paymentMethod")} disabled={opt.disabled} />
                    <div className="rethink-checkout__option-info">
                      <div className="rethink-checkout__option-label">{opt.label}</div>
                      <div className="rethink-checkout__option-desc">{opt.desc}</div>
                    </div>
                    <span className="rethink-checkout__option-icon">{opt.icon}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="rethink-checkout__order-summary">
            <h3>Đơn hàng của bạn</h3>

            {items.map((item) => (
              <div key={item.variantId} className="rethink-checkout__order-item">
                <span className="rethink-checkout__order-item-name">
                  {item.productName} - {item.variantName} × {item.quantity}
                </span>
                <span className="rethink-checkout__order-item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="rethink-checkout__summary-row">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="rethink-checkout__summary-row">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
            </div>
            <div className="rethink-checkout__summary-row rethink-checkout__summary-row--total">
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button type="submit" className="rethink-checkout__submit-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
            </button>

            <p className="rethink-checkout__terms-note">
              Bằng cách đặt hàng, bạn đồng ý với{" "}
              <a href="/chinh-sach/dieu-khoan">Điều khoản dịch vụ</a> của chúng tôi.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
