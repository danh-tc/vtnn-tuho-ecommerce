import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="rethink-store-main">{children}</main>
      <Footer />
    </>
  );
}
