"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  slug: string;
  primaryImage: string;
  price: number;
  salePrice: number | null;
  stock: number;
  variantId: number;
  variantName: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = calcDiscount(product.price, product.salePrice);
  const displayPrice = product.salePrice ?? product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      variantId: product.variantId,
      productId: product.id,
      productName: product.name,
      variantName: product.variantName,
      sku: product.sku,
      price: displayPrice,
      imageUrl: product.primaryImage,
      stock: product.stock,
    });
  };

  return (
    <Link href={`/san-pham/${product.slug}`} className="rethink-product-card">
      <div className="rethink-product-card__image">
        <Image
          src={product.primaryImage || "/images/placeholder-product.png"}
          alt={product.name}
          fill
          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        {discount > 0 && (
          <span className="rethink-product-card__badge rethink-product-card__badge--sale">-{discount}%</span>
        )}
        {product.stock === 0 && (
          <span className="rethink-product-card__badge">Hết hàng</span>
        )}
      </div>

      <div className="rethink-product-card__body">
        <h3 className="rethink-product-card__name">{product.name}</h3>

        {product.rating !== undefined && (
          <div className="rethink-product-card__rating">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} fill={i < Math.round(product.rating!) ? "currentColor" : "none"} />
            ))}
            <span>({product.reviewCount ?? 0})</span>
          </div>
        )}

        <div className="rethink-product-card__pricing">
          <span className="rethink-product-card__price">{formatPrice(displayPrice)}</span>
          {product.salePrice && (
            <span className="rethink-product-card__original-price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>

      <div className="rethink-product-card__footer">
        <button
          className="rethink-product-card__add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </Link>
  );
}
