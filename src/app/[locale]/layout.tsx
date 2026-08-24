import type { Metadata } from "next";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeaderShell } from "@/components/layout/HeaderShell";
import { ThemeScript } from "@/components/theme/ThemeScript";
import { VisitLogger } from "@/components/analytics/VisitLogger";
import { routing, type Locale } from "@/i18n/routing";
import { getOpenGraphLocale, getSiteUrl, SITE_NAME } from "@/lib/seo";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo/structured-data";
import "../globals.css";
import "../seo.css";

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
      "hostel/kotec",
      "hotel",
      "rayon evi",
      "Azərbaycan",
      "istirahət",
    ],
    openGraph: {
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      locale: getOpenGraphLocale(locale as Locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

function getStorageOrigin(): string | null {
  const base = process.env.S3_PUBLIC_URL;
  if (!base) return null;
  try {
    return new URL(base).origin;
  } catch {
    return null;
  }
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
  const storageOrigin = getStorageOrigin();

  return (
    <html lang={locale} suppressHydrationWarning>
      {storageOrigin && (
        <head>
          <link rel="preconnect" href={storageOrigin} crossOrigin="" />
          <link rel="dns-prefetch" href={storageOrigin} />
        </head>
      )}
      <body>
        <script {...jsonLdScriptProps(buildOrganizationJsonLd())} type="application/ld+json" />
        <script
          {...jsonLdScriptProps(buildWebSiteJsonLd(locale as Locale))}
          type="application/ld+json"
        />
        <ThemeScript />
        <NextIntlClientProvider messages={messages}>
          <VisitLogger />
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
