import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  if (isNaN(id)) notFound();

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  const initialData = {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    categoryId: product.categoryId,
    brandId: product.brandId,
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    tags: product.tags,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: String(v.price),
      salePrice: v.salePrice != null ? String(v.salePrice) : "",
      stock: String(v.stock),
      weightG: v.weightG != null ? String(v.weightG) : "",
      isDefault: v.isDefault,
      sortOrder: v.sortOrder,
    })),
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? "",
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
  };

  return <ProductForm productId={id} initialData={initialData} categories={categories} brands={brands} />;
}
