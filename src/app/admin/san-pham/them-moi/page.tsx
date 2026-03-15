import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thêm sản phẩm mới" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return <ProductForm categories={categories} brands={brands} />;
}
