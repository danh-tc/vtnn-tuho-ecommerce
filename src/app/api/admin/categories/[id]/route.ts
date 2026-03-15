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

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  parentId: z.number().nullable().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, slug, parentId, sortOrder, isActive } = parsed.data;
  const finalSlug = slug || slugify(name);

  const conflict = await prisma.category.findFirst({ where: { slug: finalSlug, id: { not: id } } });
  if (conflict) return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 });

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug: finalSlug, parentId: parentId ?? null, sortOrder, isActive },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt((await params).id);

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json({ error: `Danh mục đang có ${productCount} sản phẩm. Vui lòng chuyển sản phẩm trước.` }, { status: 400 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
