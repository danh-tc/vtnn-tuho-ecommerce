"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Truck, ShieldCheck, RefreshCw, Star, Leaf } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface Variant {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
  isDefault: boolean;
}

interface ProductImage {
  id: number;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date;
  user: { name: string; avatarUrl: string | null };
}

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDescription: string | null;
    brand: { name: string } | null;
    category: { name: string; slug: string };
    variants: Variant[];
    images: ProductImage[];
    reviews: Review[];
    avgRating: number;
    reviewCount: number;
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<Variant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const displayPrice = selectedVariant.salePrice ?? selectedVariant.price;
  const discount = calcDiscount(selectedVariant.price, selectedVariant.salePrice);

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantName: selectedVariant.name,
      sku: selectedVariant.sku,
      price: displayPrice,
      imageUrl: product.images[0]?.url ?? "",
      stock: selectedVariant.stock,
    });
    // Reset quantity
    setQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/gio-hang");
  };

  return (
    <div className="rethink-product-detail">
      {/* Breadcrumb */}
      <nav className="rethink-product-detail__breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span>›</span>
        <Link href="/san-pham">Sản phẩm</Link>
        <span>›</span>
        <Link href={`/san-pham?danh-muc=${product.category.slug}`}>{product.category.name}</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      <div className="rethink-product-detail__main">
        {/* Image Gallery */}
        <div className="rethink-product-detail__gallery">
          <div className="rethink-product-detail__main-image">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage].url}
                alt={product.images[activeImage].altText ?? product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                priority
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#A5D6A7" }}><Leaf size={64} /></div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="rethink-product-detail__thumbnails">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={i === activeImage ? "rethink-product-detail__thumb--active" : ""}
                >
                  <Image src={img.url} alt={img.altText ?? ""} width={72} height={72} style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="rethink-product-detail__info">
          {product.brand && <div className="rethink-product-detail__brand">{product.brand.name}</div>}
          <h1 className="rethink-product-detail__name">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="rethink-product-detail__rating-row">
              <span className="rethink-product-detail__stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(product.avgRating) ? "currentColor" : "none"} />
                ))}
              </span>
              <span className="rethink-product-detail__rating-num">{product.avgRating.toFixed(1)}</span>
              <button
                className="rethink-product-detail__review-link"
                onClick={() => setActiveTab("reviews")}
              >
                {product.reviewCount} đánh giá
              </button>
            </div>
          )}

          {/* Pricing */}
          <div className="rethink-product-detail__pricing">
            <span className="rethink-product-detail__sale-price">{formatPrice(displayPrice)}</span>
            {selectedVariant.salePrice && (
              <>
                <span className="rethink-product-detail__original-price">{formatPrice(selectedVariant.price)}</span>
                <span className="rethink-product-detail__discount-badge">-{discount}%</span>
              </>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 1 && (
            <div>
              <div className="rethink-product-detail__variant-label">
                Quy cách: <strong>{selectedVariant.name}</strong>
              </div>
              <div className="rethink-product-detail__variant-buttons">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`rethink-product-detail__variant-btn${v.id === selectedVariant.id ? " rethink-product-detail__variant-btn--selected" : ""}`}
                    onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                    disabled={v.stock === 0}
                  >
                    {v.name}
                    {v.stock === 0 && " (hết)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="rethink-product-detail__quantity-row">
            <span className="rethink-product-detail__quantity-label">Số lượng</span>
            <div className="rethink-product-detail__quantity-control">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                disabled={quantity >= selectedVariant.stock}
              >
                +
              </button>
            </div>
            <span className="rethink-product-detail__stock">
              {selectedVariant.stock > 0
                ? `Còn ${selectedVariant.stock} sản phẩm`
                : "Hết hàng"}
            </span>
          </div>

          {/* CTA */}
          <div className="rethink-product-detail__cta">
            <button
              className="rethink-product-detail__btn--buy-now"
              onClick={handleBuyNow}
              disabled={selectedVariant.stock === 0}
            >
              <ShoppingCart size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Mua ngay
            </button>
            <button
              className="rethink-product-detail__btn--add-to-cart"
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
            >
              + Thêm vào giỏ
            </button>
          </div>

          {/* Features */}
          <div className="rethink-product-detail__features">
            <div className="rethink-product-detail__feature-item">
              <span><Truck size={16} /></span><span>Giao hàng toàn quốc - miễn phí đơn từ 500.000đ</span>
            </div>
            <div className="rethink-product-detail__feature-item">
              <span><ShieldCheck size={16} /></span><span>Hàng chính hãng - hoàn tiền 100% nếu hàng giả</span>
            </div>
            <div className="rethink-product-detail__feature-item">
              <span><RefreshCw size={16} /></span><span>Đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="rethink-product-detail__tabs">
        <div className="rethink-product-detail__tab-list">
          <button
            className={`rethink-product-detail__tab-btn${activeTab === "description" ? " rethink-product-detail__tab-btn--active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`rethink-product-detail__tab-btn${activeTab === "reviews" ? " rethink-product-detail__tab-btn--active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá ({product.reviewCount})
          </button>
        </div>

        <div className="rethink-product-detail__tab-content">
          {activeTab === "description" ? (
            <div
              dangerouslySetInnerHTML={{ __html: product.description || "<p>Đang cập nhật mô tả sản phẩm.</p>" }}
            />
          ) : (
            <div>
              {product.reviews.length === 0 ? (
                <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              ) : (
                product.reviews.map((r) => (
                  <div key={r.id} style={{ borderBottom: "1px solid #C8E6C9", paddingBottom: 16, marginBottom: 16 }}>
                    <strong>{r.user.name}</strong>
                    <div style={{ color: "#F57F17", display: "flex", gap: 2 }}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} />)}</div>
                    {r.title && <p style={{ fontWeight: 600 }}>{r.title}</p>}
                    {r.body && <p>{r.body}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
