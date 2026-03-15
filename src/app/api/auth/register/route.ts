import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên").max(50),
  lastName: z.string().min(1, "Vui lòng nhập họ").max(50),
  phone: z
    .string()
    .regex(/^(0|\+84)[3-9]\d{8}$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { firstName, lastName, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    return NextResponse.json(
      { error: "Số điện thoại đã được đăng ký." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { firstName, lastName, phone, passwordHash, role: "customer", isActive: true },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
