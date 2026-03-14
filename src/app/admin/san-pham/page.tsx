import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Package, Leaf } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

const PAGE_SIZE = 20;

interface SearchParams {
  trang?: string;
  q?: string;
}

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { trang, q } = await searchParams;
  const page = parseInt(trang ?? "1");
  const skip = (page - 1) * PAGE_SIZE;

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        variants: {
          where: { isDefault: true },
          select: { price: true, salePrice: true, stock: true },
          take: 1,
        },
        images: {
          where: { isPrimary: true },
          select: { url: true },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <div className="rethink-admin-content">
      <div className="rethink-admin-topbar" style={{ marginBottom: 24 }}>
        <span className="rethink-admin-topbar__title"><Package size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Quản lý sản phẩm</span>
      </div>

      <div className="rethink-admin-table-card">
        <div className="rethink-admin-table-card__header">
          <h3>Tất cả sản phẩm ({total})</h3>
          <div className="rethink-admin-table-card__actions">
            <form method="GET">
              <input
                name="q"
                className="rethink-admin-search-input"
                placeholder="Tìm tên sản phẩm..."
                defaultValue={q}
              />
            </form>
            <Link href="/admin/san-pham/them-moi" className="rethink-admin-btn--add">
              + Thêm sản phẩm
            </Link>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="rethink-admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const variant = p.variants[0];
                const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 40, background: "#F1F8E9", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#A5D6A7" }}><Leaf size={20} /></div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "#616161" }}>{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category.name}</td>
                    <td>
                      {variant ? (
                        <div>
                          <div style={{ fontWeight: 700, color: variant.salePrice ? "#D32F2F" : "#212121" }}>
                            {formatPrice(variant.salePrice ?? variant.price)}
                          </div>
                          {variant.salePrice && (
                            <div style={{ fontSize: 12, color: "#9E9E9E", textDecoration: "line-through" }}>
                              {formatPrice(variant.price)}
                            </div>
                          )}
                        </div>
                      ) : "—"}
                    </td>
                    <td>
                      <span style={{ color: totalStock <= 5 ? "#D32F2F" : "#212121", fontWeight: 600 }}>
                        {totalStock}
                      </span>
                    </td>
                    <td>
                      <span className={`rethink-admin-badge${p.isPublished ? " rethink-admin-badge--confirmed" : " rethink-admin-badge--cancelled"}`}>
                        {p.isPublished ? "Đang bán" : "Ẩn"}
                      </span>
                    </td>
                    <td>
                      <div className="rethink-admin-action-btns">
                        <Link href={`/admin/san-pham/${p.id}`} className="rethink-admin-btn--edit">
                          Sửa
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
