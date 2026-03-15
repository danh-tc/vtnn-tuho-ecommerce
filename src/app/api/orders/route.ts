import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderCode } from "@/lib/utils";
import { z } from "zod";

const orderSchema = z.object({
  shipping: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^0\d{9}$/),
    province: z.string().min(1),
    district: z.string().min(1),
    ward: z.string().min(1),
    street: z.string().min(5),
  }),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer", "vnpay", "momo"]),
  items: z.array(
    z.object({
      variantId: z.number(),
      productName: z.string(),
      variantName: z.string(),
      sku: z.string(),
      unitPrice: z.number().positive(),
      quantity: z.number().positive().int(),
    })
  ).min(1),
  subtotal: z.number().nonnegative(),
  shippingFee: z.number().nonnegative(),
  total: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const { shipping, note, paymentMethod, items, subtotal, shippingFee, total } = parsed.data;

    // Verify stock availability
    const variantIds = items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, stock: true },
    });

    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Sản phẩm không tồn tại` }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Sản phẩm "${item.productName}" không đủ hàng` },
          { status: 400 }
        );
      }
    }

    const orderCode = generateOrderCode();
    const userId = session?.user?.id ? Number.parseInt(session.user.id) : null;

    // Create order + items + reduce stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          code: orderCode,
          userId,
          shippingName: shipping.name,
          shippingPhone: shipping.phone,
          shippingProvince: shipping.province,
          shippingDistrict: shipping.district,
          shippingWard: shipping.ward,
          shippingStreet: shipping.street,
          note: note ?? null,
          paymentMethod,
          subtotal,
          shippingFee,
          total,
          items: {
            create: items.map((i) => ({
              variantId: i.variantId,
              productName: i.productName,
              variantName: i.variantName,
              sku: i.sku,
              unitPrice: i.unitPrice,
              quantity: i.quantity,
              subtotal: i.unitPrice * i.quantity,
            })),
          },
        },
      });

      // Reduce stock
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          amount: total,
          status: "pending",
        },
      });

      return newOrder;
    });

    // Save address to user's address book (outside transaction — best-effort, non-blocking)
    if (userId) {
      try {
        const existing = await prisma.address.findFirst({
          where: {
            userId,
            provinceName: shipping.province,
            districtName: shipping.district,
            wardName: shipping.ward,
            street: shipping.street,
          },
        });

        if (!existing) {
          const anyAddress = await prisma.address.findFirst({ where: { userId } });
          await prisma.address.create({
            data: {
              userId,
              recipientName: shipping.name,
              phone: shipping.phone,
              provinceName: shipping.province,
              districtName: shipping.district,
              wardName: shipping.ward,
              street: shipping.street,
              isDefault: !anyAddress,
            },
          });
        }
      } catch (addrErr) {
        console.error("[orders] Failed to save address:", addrErr);
      }
    }

    // TODO: If vnpay/momo, generate payment URL here
    // For now, return order code for COD and bank_transfer
    return NextResponse.json({
      orderCode: order.code,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra, vui lòng thử lại" }, { status: 500 });
  }
}
