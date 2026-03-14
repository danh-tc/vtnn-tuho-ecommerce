"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const SHIPPING_FEE = 30000; // 30,000đ flat rate
const FREE_SHIPPING_THRESHOLD = 500000; // free above 500k

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const subtotal = totalPrice();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="rethink-cart">
        <div className="rethink-cart__empty">
          <div className="rethink-cart__empty-icon"><ShoppingCart size={48} /></div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link href="/san-pham">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rethink-cart">
      <h1 className="rethink-cart__title"><ShoppingCart size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="rethink-cart__layout">
        {/* Items */}
        <div className="rethink-cart__items">
          {items.map((item) => (
            <div key={item.variantId} className="rethink-cart__item">
              <div className="rethink-cart__item-image">
                <Image
                  src={item.imageUrl || "/placeholder-product.png"}
                  alt={item.productName}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100px"
                />
              </div>

              <div className="rethink-cart__item-info">
                <Link href={`/san-pham/${item.productId}`} className="rethink-cart__item-name">
                  {item.productName}
                </Link>
                <div className="rethink-cart__item-variant">{item.variantName}</div>
                <div className="rethink-cart__item-price">{formatPrice(item.price)}</div>
              </div>

              <div className="rethink-cart__item-actions">
                <div className="rethink-cart__quantity-control">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <div className="rethink-cart__item-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <button
                  className="rethink-cart__remove-btn"
                  onClick={() => removeItem(item.variantId)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rethink-cart__summary">
          <h3>Tóm tắt đơn hàng</h3>

          <div className="rethink-cart__summary-row">
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="rethink-cart__summary-row">
            <span>Phí vận chuyển</span>
            <span>
              {shippingFee === 0 ? (
                <span style={{ color: "#2E7D32", fontWeight: 700 }}>Miễn phí</span>
              ) : (
                formatPrice(shippingFee)
              )}
            </span>
          </div>
          {shippingFee > 0 && (
            <p style={{ fontSize: 12, color: "#616161", margin: "4px 0 8px" }}>
              Mua thêm {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận chuyển
            </p>
          )}
          <div className="rethink-cart__summary-row rethink-cart__summary-row--total">
            <span>Tổng cộng</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Link href="/dat-hang" className="rethink-cart__checkout-btn">
            Tiến hành đặt hàng →
          </Link>
          <Link href="/san-pham" className="rethink-cart__continue-shopping">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
