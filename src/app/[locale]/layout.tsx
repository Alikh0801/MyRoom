import type { Metadata } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";
import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: SITE_NAME,
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: [
      "günlük icarə",
      "A-frame (Glamping)",
      "glamping",
      "hostel/kortec",
      "hotel",
      "rayon evi",
      "Azərbaycan",
      "istirahət",
    ],
    openGraph: {
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      locale: locale === "ru" ? "ru_RU" : "az_AZ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ThemeScript />
        <NextIntlClientProvider messages={messages}>
          <div className="page-wrapper">
            <Suspense fallback={<HeaderShell />}>
              <Header />
            </Suspense>
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
