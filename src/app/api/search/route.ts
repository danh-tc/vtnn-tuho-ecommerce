import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Normalize Vietnamese text: remove diacritics, replace đ→d, collapse to slug-style
function normalizeVi(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritical marks (covers Vietnamese tones + horns)
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const slugQ = normalizeVi(q);

  const products = await prisma.product.findMany({
    where: {
      isPublished: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: slugQ, mode: "insensitive" } },
      ],
    },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      variants: { where: { isDefault: true }, take: 1 },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url ?? "",
      price: p.variants[0]?.price ?? 0,
      salePrice: p.variants[0]?.salePrice ?? null,
    }))
  );
}
