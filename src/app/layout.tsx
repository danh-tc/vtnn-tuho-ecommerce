import type { Metadata } from "next";
import "@/styles/globals.scss";
import Providers from "@/components/Providers";

const SITE_URL = "https://vtnntuho.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VTNN Tư Hồ – Vật tư nông nghiệp chất lượng cao",
    template: "%s | VTNN Tư Hồ",
  },
  description:
    "Cửa hàng vật tư nông nghiệp Tư Hồ – Chuyên cung cấp phân bón, thuốc bảo vệ thực vật, hạt giống chất lượng cao. Giá tốt, giao hàng nhanh tại Việt Nam.",
  keywords: [
    "vật tư nông nghiệp", "phân bón", "thuốc bảo vệ thực vật", "hạt giống",
    "VTNN Tư Hồ", "nông nghiệp", "phân NPK", "thuốc BVTV",
  ],
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "VTNN Tư Hồ",
    title: "VTNN Tư Hồ – Vật tư nông nghiệp chất lượng cao",
    description:
      "Cửa hàng vật tư nông nghiệp Tư Hồ – Chuyên cung cấp phân bón, thuốc bảo vệ thực vật, hạt giống chất lượng cao. Giá tốt, giao hàng nhanh tại Việt Nam.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "VTNN Tư Hồ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTNN Tư Hồ – Vật tư nông nghiệp chất lượng cao",
    description:
      "Phân bón, thuốc BVTV, hạt giống chính hãng – giao hàng toàn quốc.",
    images: ["/images/og-default.jpg"],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

// WebSite schema - tells Google the site name + enables Sitelinks Searchbox
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VTNN Tư Hồ",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/san-pham?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Organization / LocalBusiness - critical for "VTNN Tư Hồ" branded searches
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VTNN Tư Hồ",
  alternateName: "Cửa hàng vật tư nông nghiệp Tư Hồ",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  image: `${SITE_URL}/images/og-default.jpg`,
  description:
    "Chuyên cung cấp vật tư nông nghiệp chất lượng cao: phân bón, thuốc bảo vệ thực vật, hạt giống và dụng cụ nông nghiệp. Giao hàng toàn quốc.",
  telephone: "+84989977884",
  priceRange: "đ–đđđ",
  openingHours: "Mo-Su 07:00-22:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "98 Ấp Thạnh Lập",
    addressLocality: "Thạnh Phú",
    addressRegion: "Long An",
    addressCountry: "VN",
  },
  email: "vtnntuho.2010@gmail.com",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
