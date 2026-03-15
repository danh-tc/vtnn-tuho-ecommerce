import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://vtnntuho.online";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                                    priority: 1.0,  changeFrequency: "daily" },
  { url: `${BASE}/san-pham`,                      priority: 0.9,  changeFrequency: "daily" },
  { url: `${BASE}/khuyen-mai`,                    priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE}/lien-he`,                       priority: 0.7,  changeFrequency: "monthly" },
  { url: `${BASE}/huong-dan/dat-hang`,            priority: 0.6,  changeFrequency: "monthly" },
  { url: `${BASE}/chinh-sach/van-chuyen`,         priority: 0.5,  changeFrequency: "monthly" },
  { url: `${BASE}/chinh-sach/doi-tra`,            priority: 0.5,  changeFrequency: "monthly" },
  { url: `${BASE}/chinh-sach/bao-mat`,            priority: 0.4,  changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/san-pham/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
    changeFrequency: "weekly",
  }));

  return [...STATIC_ROUTES, ...productRoutes];
}
