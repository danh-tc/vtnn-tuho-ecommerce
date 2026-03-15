import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user.role === "customer") return false;
  return true;
}

const variantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().min(0),
  salePrice: z.number().nullable().optional(),
  stock: z.number().min(0).default(0),
  weightG: z.number().nullable().optional(),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

const imageSchema = z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
  isPrimary: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.number(),
  brandId: z.number().nullable().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  variants: z.array(variantSchema).min(1, "Cần ít nhất 1 biến thể"),
  images: z.array(imageSchema).default([]),
});

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

  const { name, slug, variants, images, ...rest } = parsed.data;
  const finalSlug = slug || slugify(name);

  const existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
  if (existing) return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 });

  // Ensure only one default variant
  const hasDefault = variants.some((v) => v.isDefault);
  const normalizedVariants = variants.map((v, i) => ({
    ...v,
    isDefault: hasDefault ? v.isDefault : i === 0,
  }));

  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      ...rest,
      brandId: rest.brandId ?? null,
      variants: { create: normalizedVariants },
      images: { create: images },
    },
    include: { variants: true, images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
