import { Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import "@/styles/components/promotions.scss";

export const dynamic = "force-dynamic";
export const metadata = { title: "Khuyến mãi – VTNN Tư Hồ" };

async function getSaleProducts() {
  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      variants: { some: { isDefault: true, salePrice: { not: null } } },
    },
    orderBy: { updatedAt: "desc" },
    include: {
      variants: { where: { isDefault: true }, take: 1 },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return products
    .filter((p) => p.variants[0]?.salePrice != null)
    .map((p) => ({
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

export default async function PromotionsPage() {
  const products = await getSaleProducts();

  return (
    <div className="rethink-promotions">
      <div className="rethink-promotions__header">
        <h1>
          <Tag size={28} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />
          Khuyến mãi
        </h1>
        <p>Các sản phẩm đang được giảm giá - cập nhật liên tục</p>
      </div>

      <div className="rethink-promotions__banner">
        <h2>Ưu đãi đặc biệt cho nông dân</h2>
        <p>Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ</p>
      </div>

      {products.length > 0 ? (
        <>
          <h2 className="rethink-promotions__section-title">
            <Tag size={18} /> Sản phẩm đang giảm giá ({products.length} sản phẩm)
          </h2>
          <div className="rethink-promotions__grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      ) : (
        <div className="rethink-promotions__empty">
          <Tag size={48} />
          <h3>Chưa có chương trình khuyến mãi</h3>
          <p>Hãy quay lại sớm để không bỏ lỡ các ưu đãi hấp dẫn!</p>
        </div>
      )}
    </div>
  );
}
