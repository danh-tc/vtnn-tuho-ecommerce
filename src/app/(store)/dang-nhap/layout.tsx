import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default function DangNhapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
