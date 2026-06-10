import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyRoom — Azərbaycan üzrə günlük icarə və istirahət",
    template: "%s | MyRoom",
  },
  description:
    "Otel, hostel, A-frame və rayon evləri. Qısamüddətli istirahət üçün elanlar — Azərbaycan üzrə.",
  keywords: [
    "günlük icarə",
    "A-frame",
    "hostel",
    "otel",
    "rayon evi",
    "Azərbaycan",
    "istirahət",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>
        <div className="page-wrapper">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
