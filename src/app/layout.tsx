import type { Metadata } from "next";
import "@/styles/globals.scss";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "VTNN Tư Hồ — Vật Tư Nông Nghiệp",
    template: "%s | VTNN Tư Hồ",
  },
  description: "Chuyên cung cấp vật tư nông nghiệp chất lượng cao: phân bón, thuốc bảo vệ thực vật, hạt giống và dụng cụ nông nghiệp.",
  keywords: ["vật tư nông nghiệp", "phân bón", "thuốc bảo vệ thực vật", "hạt giống", "nông nghiệp"],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "VTNN Tư Hồ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
