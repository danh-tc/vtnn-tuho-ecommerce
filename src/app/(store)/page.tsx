import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw, Phone, Flame, Sprout, FlaskConical, Wheat, Wrench, Droplets, Leaf } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import HeroBannerImage from "@/components/store/HeroBannerImage";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VTNN Tư Hồ – Vật tư nông nghiệp chất lượng cao",
  description:
    "Cửa hàng vật tư nông nghiệp Tư Hồ – Phân bón, thuốc BVTV, hạt giống chính hãng. Giao hàng toàn quốc, hỗ trợ kỹ thuật miễn phí.",
  alternates: { canonical: "https://vtnntuho.online" },
  openGraph: {
    title: "VTNN Tư Hồ – Vật tư nông nghiệp chất lượng cao",
    description:
      "Phân bón, thuốc BVTV, hạt giống chính hãng – giao hàng toàn quốc. Tư vấn kỹ thuật miễn phí.",
    url: "https://vtnntuho.online",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
};


async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        where: { isDefault: true },
        take: 1,
      },
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    primaryImage: p.images[0]?.url ?? "",
    price: p.variants[0]?.price ?? 0,
    salePrice: p.variants[0]?.salePrice ?? null,
    stock: p.variants[0]?.stock ?? 0,
    variantId: p.variants[0]?.id ?? 0,
    variantName: p.variants[0]?.name ?? "",
    sku: p.variants[0]?.sku ?? "",
  }));
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

async function getNewProducts() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        where: { isDefault: true },
        take: 1,
      },
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    primaryImage: p.images[0]?.url ?? "",
    price: p.variants[0]?.price ?? 0,
    salePrice: p.variants[0]?.salePrice ?? null,
    stock: p.variants[0]?.stock ?? 0,
    variantId: p.variants[0]?.id ?? 0,
    variantName: p.variants[0]?.name ?? "",
    sku: p.variants[0]?.sku ?? "",
  }));
}

import type { LucideIcon } from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "phan-bon": Sprout,
  "thuoc-bvtv": FlaskConical,
  "hat-giong": Wheat,
  "dung-cu": Wrench,
  "tuoi-tieu": Droplets,
  default: Leaf,
};

export default async function HomePage() {
  const [featuredProducts, categories, newProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getNewProducts(),
  ]);

  return (
    <>
      {/* Hero Banner */}
      <section className="rethink-hero-banner">
        <HeroBannerImage
          slides={[
            {
              src: "/images/hero-1.jpg",
              alt: "Vật tư nông nghiệp chất lượng cao",
              title: "Vật tư nông nghiệp chất lượng cao",
              subtitle: "Phân bón, thuốc bảo vệ thực vật, hạt giống chính hãng - giao hàng toàn quốc.",
              cta: { label: "Xem tất cả sản phẩm", href: "/san-pham" },
            },
            {
              src: "/images/hero-2.jpg",
              alt: "Phân bón chính hãng giá tốt",
              title: "Phân bón chính hãng, giá tốt nhất",
              subtitle: "Cam kết hoàn tiền nếu hàng giả. Nguồn gốc rõ ràng, kiểm định đầy đủ.",
              cta: { label: "Mua ngay", href: "/san-pham?danh-muc=phan-bon" },
            },
            {
              src: "/images/hero-3.jpg",
              alt: "Hạt giống và thuốc bảo vệ thực vật",
              title: "Hạt giống & thuốc bảo vệ thực vật",
              subtitle: "Đa dạng chủng loại, phù hợp mọi vùng canh tác. Tư vấn kỹ thuật miễn phí.",
              cta: { label: "Liên hệ tư vấn", href: "/lien-he" },
            },
          ]}
        />
      </section>

      {/* Trust badges */}
      <div className="rethink-trust-bar">
        <div className="rethink-trust-bar__inner">
          <div className="rethink-trust-bar__item">
            <span className="rethink-trust-bar__item-icon"><Truck size={28} /></span>
            <div>
              <h4>Giao hàng toàn quốc</h4>
              <p>Miễn phí đơn từ 500.000đ</p>
            </div>
          </div>
          <div className="rethink-trust-bar__item">
            <span className="rethink-trust-bar__item-icon"><ShieldCheck size={28} /></span>
            <div>
              <h4>Hàng chính hãng 100%</h4>
              <p>Cam kết hoàn tiền nếu giả</p>
            </div>
          </div>
          <div className="rethink-trust-bar__item">
            <span className="rethink-trust-bar__item-icon"><RefreshCw size={28} /></span>
            <div>
              <h4>Đổi trả trong 7 ngày</h4>
              <p>Dễ dàng, không phí</p>
            </div>
          </div>
          <div className="rethink-trust-bar__item">
            <span className="rethink-trust-bar__item-icon"><Phone size={28} /></span>
            <div>
              <h4>Hỗ trợ 7 ngày/tuần</h4>
              <p>Tư vấn kỹ thuật miễn phí</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="rethink-home-section">
          <div className="rethink-section-header">
            <h2>Danh mục sản phẩm</h2>
            <Link href="/san-pham">Xem tất cả →</Link>
          </div>
          <div className="rethink-category-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/san-pham?danh-muc=${cat.slug}`}
                className="rethink-category-card"
              >
                <div className="rethink-category-card__icon">
                  {(() => { const Icon = CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default; return <Icon size={28} />; })()}
                </div>
                <span className="rethink-category-card__name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="rethink-home-section">
          <div className="rethink-section-header">
            <h2>Sản phẩm nổi bật</h2>
            <Link href="/san-pham?noi-bat=1">Xem thêm →</Link>
          </div>
          <div className="rethink-product-grid">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Promo banner */}
      <section className="rethink-home-section">
        <div className="rethink-promo-banner">
          <div>
            <h3><Flame size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Ưu đãi đặc biệt tháng này</h3>
            <p>Giảm đến 20% cho đơn hàng phân bón từ 10 triệu đồng</p>
          </div>
          <Link href="/khuyen-mai" className="rethink-promo-banner__btn">
            Xem ngay
          </Link>
        </div>
      </section>

      {/* New products */}
      {newProducts.length > 0 && (
        <section className="rethink-home-section">
          <div className="rethink-section-header">
            <h2>Sản phẩm mới nhất</h2>
            <Link href="/san-pham?sap-xep=moi-nhat">Xem thêm →</Link>
          </div>
          <div className="rethink-product-grid">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
