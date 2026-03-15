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

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, slug, parentId, sortOrder, isActive } = parsed.data;
  const finalSlug = slug || slugify(name);

  const existing = await prisma.category.findUnique({ where: { slug: finalSlug } });
  if (existing) return NextResponse.json({ error: "Slug đã tồn tại." }, { status: 409 });

  const category = await prisma.category.create({
    data: { name, slug: finalSlug, parentId: parentId ?? null, sortOrder, isActive },
  });
  return NextResponse.json(category, { status: 201 });
}
