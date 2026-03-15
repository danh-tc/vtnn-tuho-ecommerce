import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { phone: "0900000001" },
    update: {},
    create: {
      name: "Admin VTNN",
      phone: "0900000001",
      email: "admin@vtnntuho.vn",
      passwordHash: adminHash,
      role: "admin",
    },
  });

  // Categories
  const phanBon = await prisma.category.upsert({
    where: { slug: "phan-bon" },
    update: {},
    create: { name: "Phân bón", slug: "phan-bon", sortOrder: 1 },
  });
  const thuocBVTV = await prisma.category.upsert({
    where: { slug: "thuoc-bvtv" },
    update: {},
    create: { name: "Thuốc BVTV", slug: "thuoc-bvtv", sortOrder: 2 },
  });
  const hatGiong = await prisma.category.upsert({
    where: { slug: "hat-giong" },
    update: {},
    create: { name: "Hạt giống", slug: "hat-giong", sortOrder: 3 },
  });
  const dungCu = await prisma.category.upsert({
    where: { slug: "dung-cu" },
    update: {},
    create: { name: "Dụng cụ nông nghiệp", slug: "dung-cu", sortOrder: 4 },
  });

  // Sub-categories
  await prisma.category.upsert({
    where: { slug: "phan-npk" },
    update: {},
    create: { name: "Phân NPK", slug: "phan-npk", parentId: phanBon.id, sortOrder: 1 },
  });
  await prisma.category.upsert({
    where: { slug: "phan-huu-co" },
    update: {},
    create: { name: "Phân hữu cơ", slug: "phan-huu-co", parentId: phanBon.id, sortOrder: 2 },
  });

  // Brand
  const brand = await prisma.brand.upsert({
    where: { slug: "bayer" },
    update: {},
    create: { name: "Bayer", slug: "bayer" },
  });

  // Sample products
  const products = [
    {
      name: "Phân NPK 20-20-15 Đầu Trâu",
      slug: "phan-npk-20-20-15-dau-trau",
      shortDescription: "Phân NPK chuyên dùng cho cây trồng, giúp cây phát triển mạnh",
      categoryId: phanBon.id,
      isFeatured: true,
      imageUrl: "https://placehold.co/400x400/2E7D32/white.png?text=Phan+NPK",
      variants: [
        { name: "1kg", sku: "NPK-1KG", price: 35000, stock: 200, isDefault: true },
        { name: "5kg", sku: "NPK-5KG", price: 155000, salePrice: 145000, stock: 80 },
        { name: "25kg", sku: "NPK-25KG", price: 750000, salePrice: 690000, stock: 30 },
      ],
    },
    {
      name: "Thuốc trừ sâu Regent 800WG",
      slug: "thuoc-tru-sau-regent-800wg",
      shortDescription: "Thuốc trừ sâu hiệu quả cao, an toàn cho người và môi trường",
      categoryId: thuocBVTV.id,
      brandId: brand.id,
      isFeatured: true,
      imageUrl: "https://placehold.co/400x400/4CAF50/white.png?text=Regent+800WG",
      variants: [
        { name: "50g", sku: "REG-50G", price: 45000, stock: 150, isDefault: true },
        { name: "100g", sku: "REG-100G", price: 85000, salePrice: 79000, stock: 80 },
      ],
    },
    {
      name: "Hạt giống dưa hấu không hạt F1",
      slug: "hat-giong-dua-hau-khong-hat-f1",
      shortDescription: "Giống dưa hấu không hạt năng suất cao, kháng bệnh tốt",
      categoryId: hatGiong.id,
      isFeatured: true,
      imageUrl: "https://placehold.co/400x400/8BC34A/white.png?text=Hat+Giong+F1",
      variants: [
        { name: "10 hạt", sku: "DH-10HAT", price: 25000, stock: 300, isDefault: true },
        { name: "50 hạt", sku: "DH-50HAT", price: 110000, salePrice: 99000, stock: 120 },
      ],
    },
    {
      name: "Bình xịt điện 16L",
      slug: "binh-xit-dien-16l",
      shortDescription: "Bình xịt điện dung tích 16L, pin lithium, phun sương đều",
      categoryId: dungCu.id,
      imageUrl: "https://placehold.co/400x400/1B5E20/white.png?text=Binh+Xit+16L",
      variants: [
        { name: "16L", sku: "BX-16L", price: 850000, salePrice: 790000, stock: 25, isDefault: true },
      ],
    },
    {
      name: "Phân hữu cơ vi sinh Sông Gianh",
      slug: "phan-huu-co-vi-sinh-song-gianh",
      shortDescription: "Phân hữu cơ vi sinh chất lượng cao, cải tạo đất hiệu quả",
      categoryId: phanBon.id,
      imageUrl: "https://placehold.co/400x400/33691E/white.png?text=Phan+Huu+Co",
      variants: [
        { name: "5kg", sku: "HCSG-5KG", price: 75000, stock: 100, isDefault: true },
        { name: "20kg", sku: "HCSG-20KG", price: 280000, salePrice: 260000, stock: 40 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, imageUrl, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...productData, isPublished: true },
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: product.id },
      });
    }

    // Upsert primary image
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id, isPrimary: true },
    });
    if (existingImage) {
      await prisma.productImage.update({
        where: { id: existingImage.id },
        data: { url: imageUrl },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: imageUrl, isPrimary: true, sortOrder: 0 },
      });
    }
  }

  // Banners
  await prisma.banner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Khuyến mãi tháng 3 - Giảm 20% phân bón",
      imageUrl: "https://placehold.co/1200x400/2E7D32/white?text=VTNN+Tu+Ho",
      position: "hero",
      isActive: true,
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
