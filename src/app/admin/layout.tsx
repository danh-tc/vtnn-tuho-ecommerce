import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | VTNN Admin" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role === "customer") {
    redirect("/dang-nhap?from=admin");
  }

  return (
    <div className="rethink-admin-shell">
      <AdminSidebar userName={session.user.name} />
      <div className="rethink-admin-main">
        {children}
      </div>
    </div>
  );
}
