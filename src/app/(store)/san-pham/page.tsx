import Link from "next/link";
import { Leaf } from "lucide-react";
import AutoSubmitSelect from "@/components/ui/AutoSubmitSelect";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Mua vật tư nông nghiệp chất lượng: phân bón, thuốc BVTV, hạt giống.",
};

const PAGE_SIZE = 16;

interface SearchParams {
  q?: string;
  "danh-muc"?: string;
  "sap-xep"?: string;
  "gia-tu"?: string;
  "gia-den"?: string;
  "trang"?: string;
  "noi-bat"?: string;
}

async function getProducts(params: SearchParams) {
  const page = parseInt(params["trang"] ?? "1");
  const skip = (page - 1) * PAGE_SIZE;

  const categorySlug = params["danh-muc"];
  const q = params.q;
  const sort = params["sap-xep"] ?? "moi-nhat";
  const priceFrom = params["gia-tu"] ? parseInt(params["gia-tu"]) : undefined;
  const priceTo = params["gia-den"] ? parseInt(params["gia-den"]) : undefined;
  const featured = params["noi-bat"] === "1" ? true : undefined;

  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;

  const where = {
    isPublished: true,
    ...(featured && { isFeatured: true }),
    ...(category && { categoryId: category.id }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { tags: { has: q } },
      ],
    }),
    ...(priceFrom || priceTo
      ? {
          variants: {
            some: {
              isDefault: true,
              price: {
                ...(priceFrom && { gte: priceFrom }),
                ...(priceTo && { lte: priceTo }),
              },
            },
          },
        }
      : {}),
  };

  const orderBy =
    sort === "gia-tang"
      ? { variants: { _count: "asc" as const } }
      : sort === "gia-giam"
      ? { variants: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      orderBy,
      include: {
        variants: { where: { isDefault: true }, take: 1 },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
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
    })),
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isPublished: true } } } } },
  });
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(resolvedSearchParams),
    getCategories(),
  ]);

  const activeCategory = resolvedSearchParams["danh-muc"];
  const currentSort = resolvedSearchParams["sap-xep"] ?? "moi-nhat";
  const hasActiveFilters = !!(
    activeCategory ||
    resolvedSearchParams["gia-tu"] ||
    resolvedSearchParams["gia-den"] ||
    resolvedSearchParams.q
  );

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = { ...resolvedSearchParams, ...overrides };
    const qs = Object.entries(p)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&");
    return `/san-pham${qs ? "?" + qs : ""}`;
  }

  return (
    <>
      {/* Sidebar — sibling of catalog so .rethink-store-main is the sticky containing block */}
      <aside className="rethink-catalog__sidebar">
        {/* Reset filters */}
        {hasActiveFilters && (
          <div className="rethink-catalog__filter-reset">
            <Link href="/san-pham" className="rethink-catalog__reset-btn">
              Xóa bộ lọc
            </Link>
          </div>
        )}

        {/* Categories */}
        <div className="rethink-catalog__filter-group">
          <h3>Danh mục</h3>
          <div className="rethink-catalog__category-list">
            <Link
              href="/san-pham"
              className={`rethink-catalog__category-item${!activeCategory ? " rethink-catalog__category-item--active" : ""}`}
            >
              Tất cả sản phẩm
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildUrl({ "danh-muc": cat.slug, trang: undefined, "gia-tu": undefined, "gia-den": undefined })}
                className={`rethink-catalog__category-item${activeCategory === cat.slug ? " rethink-catalog__category-item--active" : ""}`}
              >
                {cat.name}
                <span>{cat._count.products}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="rethink-catalog__filter-group">
          <h3>Giá (đ)</h3>
          <form className="rethink-catalog__price-range" method="GET" action="/san-pham">
            {activeCategory && <input type="hidden" name="danh-muc" value={activeCategory} />}
            <div className="rethink-catalog__price-range-inputs">
              <input
                name="gia-tu"
                type="number"
                placeholder="Từ"
                defaultValue={resolvedSearchParams["gia-tu"]}
                min={0}
              />
              <span>—</span>
              <input
                name="gia-den"
                type="number"
                placeholder="Đến"
                defaultValue={resolvedSearchParams["gia-den"]}
                min={0}
              />
            </div>
            <button type="submit">Áp dụng</button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="rethink-catalog">
        <div className="rethink-catalog__main">
        {/* Toolbar */}
        <div className="rethink-catalog__toolbar">
          <p className="rethink-catalog__result-count">
            Tìm thấy <strong>{total}</strong> sản phẩm
            {resolvedSearchParams.q && <> cho &ldquo;{resolvedSearchParams.q}&rdquo;</>}
          </p>
          <form method="GET" action="/san-pham">
            {activeCategory && <input type="hidden" name="danh-muc" value={activeCategory} />}
            {resolvedSearchParams.q && <input type="hidden" name="q" value={resolvedSearchParams.q} />}
            <AutoSubmitSelect
              name="sap-xep"
              className="rethink-catalog__sort-select"
              defaultValue={currentSort}
            >
              <option value="moi-nhat">Mới nhất</option>
              <option value="gia-tang">Giá tăng dần</option>
              <option value="gia-giam">Giá giảm dần</option>
            </AutoSubmitSelect>
          </form>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="rethink-catalog__grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rethink-catalog__empty">
            <div className="rethink-catalog__empty-icon"><Leaf size={48} /></div>
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử tìm kiếm với từ khóa khác hoặc bỏ bộ lọc.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="rethink-catalog__pagination">
            <Link
              href={buildUrl({ trang: String(page - 1) })}
              className={`rethink-catalog__page-btn${page <= 1 ? " rethink-catalog__page-btn--active" : ""}`}
              aria-disabled={page <= 1}
            >
              ‹
            </Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildUrl({ trang: String(p) })}
                className={`rethink-catalog__page-btn${p === page ? " rethink-catalog__page-btn--active" : ""}`}
              >
                {p}
              </Link>
            ))}
            <Link
              href={buildUrl({ trang: String(page + 1) })}
              className={`rethink-catalog__page-btn${page >= totalPages ? " rethink-catalog__page-btn--active" : ""}`}
              aria-disabled={page >= totalPages}
            >
              ›
            </Link>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
