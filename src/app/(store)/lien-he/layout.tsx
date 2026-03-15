import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với cửa hàng VTNN Tư Hồ – Hotline: 098 99 77 884. Tư vấn phân bón, thuốc BVTV, hạt giống. Hỗ trợ kỹ thuật miễn phí.",
  alternates: { canonical: "https://vtnntuho.online/lien-he" },
};

export default function LienHeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
