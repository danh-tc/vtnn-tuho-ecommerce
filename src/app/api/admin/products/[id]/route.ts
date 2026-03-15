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
  id: z.number().optional(), // existing variant has id
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
  id: z.number().optional(),
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
  variants: z.array(variantSchema).min(1),
  images: z.array(imageSchema).default([]),
});

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, slug, variants, images, ...rest } = parsed.data;
  const finalSlug = slug || slugify(name);

  const conflict = await prisma.product.findFirst({ where: { slug: finalSlug, id: { not: id } } });
  if (conflict) return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 });

  // Separate existing vs new variants
  const existingVariants = variants.filter((v) => v.id !== undefined);
  const newVariants = variants.filter((v) => v.id === undefined);

  const existingImages = images.filter((img) => img.id !== undefined);
  const newImages = images.filter((img) => img.id === undefined);

  await prisma.$transaction(async (tx) => {
    // Update product basic fields
    await tx.product.update({
      where: { id },
      data: { name, slug: finalSlug, brandId: rest.brandId ?? null, ...rest },
    });

    // Delete removed variants
    const keptVariantIds = existingVariants.map((v) => v.id!);
    await tx.productVariant.deleteMany({ where: { productId: id, id: { notIn: keptVariantIds } } });

    // Upsert variants
    for (const v of existingVariants) {
      await tx.productVariant.update({ where: { id: v.id }, data: { ...v, id: undefined } });
    }
    if (newVariants.length > 0) {
      await tx.productVariant.createMany({ data: newVariants.map((v) => ({ ...v, productId: id })) });
    }

    // Delete removed images
    const keptImageIds = existingImages.map((img) => img.id!);
    await tx.productImage.deleteMany({ where: { productId: id, id: { notIn: keptImageIds } } });

    // Upsert images
    for (const img of existingImages) {
      await tx.productImage.update({ where: { id: img.id }, data: { ...img, id: undefined } });
    }
    if (newImages.length > 0) {
      await tx.productImage.createMany({ data: newImages.map((img) => ({ ...img, productId: id })) });
    }
  });

  const updated = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: "asc" } }, images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
