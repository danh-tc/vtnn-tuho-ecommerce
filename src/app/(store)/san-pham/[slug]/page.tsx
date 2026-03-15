import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

const SITE_URL = "https://vtnntuho.online";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      seoTitle: true,
      seoDescription: true,
      shortDescription: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  });
  if (!product) return {};

  const title = product.seoTitle ?? product.name;
  const description = product.seoDescription ?? product.shortDescription ?? undefined;
  const image = product.images[0]?.url;
  const url = `${SITE_URL}/san-pham/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(image && { images: [{ url: image, alt: title }] }),
    },
  };
}

export default async function ProductDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      brand: true,
      variants: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const primaryImage = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;

  // Product structured data - enables rich results (price, availability, ratings)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? undefined,
    url: `${SITE_URL}/san-pham/${product.slug}`,
    ...(primaryImage && { image: primaryImage }),
    ...(product.brand && { brand: { "@type": "Brand", name: product.brand.name } }),
    ...(defaultVariant && {
      offers: {
        "@type": "Offer",
        priceCurrency: "VND",
        price: defaultVariant.salePrice ?? defaultVariant.price,
        availability:
          defaultVariant.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "VTNN Tư Hồ" },
        url: `${SITE_URL}/san-pham/${product.slug}`,
      },
    }),
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${SITE_URL}/san-pham` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `${SITE_URL}/san-pham?danh-muc=${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${SITE_URL}/san-pham/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={{
          ...product,
          avgRating,
          reviewCount: product.reviews.length,
          description: product.description ?? "",
        }}
      />
    </>
  );
}
