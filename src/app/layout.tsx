import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeaderShell } from "@/components/layout/HeaderShell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyRoom — Azərbaycan üzrə günlük icarə və istirahət",
    template: "%s | MyRoom",
  },
  description:
    "Hotel, hostel, A-frame (Glamping) və rayon evləri. Qısamüddətli istirahət üçün elanlar — Azərbaycan üzrə.",
  keywords: [
    "günlük icarə",
    "A-frame (Glamping)",
    "glamping",
    "hostel",
    "hotel",
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
          <Suspense fallback={<HeaderShell />}>
            <Header />
          </Suspense>
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
