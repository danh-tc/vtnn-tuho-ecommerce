import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

type SavedAddress = {
  id: number;
  recipientName: string;
  phone: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  street: string;
  isDefault: boolean;
};

export default async function CheckoutPage() {
  const session = await auth();

  let initialData: { name: string; phone: string } | null = null;
  let savedAddresses: SavedAddress[] = [];

  if (session?.user?.id) {
    const userId = Number.parseInt(session.user.id);

    initialData = {
      name: [session.user.name, session.user.lastName].filter(Boolean).join(" "),
      phone: session.user.phone ?? "",
    };

    // Try Address table first
    const addressRows = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
      select: {
        id: true,
        recipientName: true,
        phone: true,
        provinceName: true,
        districtName: true,
        wardName: true,
        street: true,
        isDefault: true,
      },
    });

    if (addressRows.length > 0) {
      savedAddresses = addressRows;
    } else {
      // Fallback: deduplicate from order history until Address table is populated
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          shippingName: true,
          shippingPhone: true,
          shippingProvince: true,
          shippingDistrict: true,
          shippingWard: true,
          shippingStreet: true,
        },
      });

      const seen = new Set<string>();
      savedAddresses = orders
        .filter((o) => {
          const key = [o.shippingStreet, o.shippingWard, o.shippingDistrict, o.shippingProvince].join("|");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((o, i) => ({
          id: o.id * -1, // negative to distinguish from real Address IDs
          recipientName: o.shippingName,
          phone: o.shippingPhone,
          provinceName: o.shippingProvince,
          districtName: o.shippingDistrict,
          wardName: o.shippingWard,
          street: o.shippingStreet,
          isDefault: i === 0,
        }));
    }
  }

  return <CheckoutForm initialData={initialData} savedAddresses={savedAddresses} />;
}
