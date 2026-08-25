import type { Metadata, Viewport } from "next";
import { Fira_Code, Inter, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { LEGAL, META } from "@/lib/data";
import { LOCALES } from "@/lib/i18n/config";
import { localeParam, t } from "@/lib/i18n/utils";
import { BASE_URL } from "@/lib/metadata";
import { structuredData } from "@/lib/seo";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-montserrat" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-fira-code" });
const luciole = localFont({
  variable: "--font-luciole",
  src: [
    { path: "../fonts/Luciole-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Luciole-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/Luciole-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/Luciole-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

const themeScript = `(function(){try{var t=localStorage.getItem("silex_theme");var d=t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await localeParam(params);
  return {
    metadataBase: new URL(BASE_URL),
    title: t(META.title, lang),
    description: t(META.description, lang),
    applicationName: LEGAL.entity,
    authors: [{ name: "Nicolas Wieckiewicz", url: BASE_URL }],
    creator: "Nicolas Wieckiewicz",
    publisher: LEGAL.entity,
    formatDetection: { telephone: true, address: false, email: true },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: LEGAL.entity,
      title: t(META.title, lang),
      description: t(META.description, lang),
      locale: lang === "fr" ? "fr_BE" : "en_US",
      alternateLocale: lang === "fr" ? "en_US" : "fr_BE",
      images: [{ url: "/opengraph.png", width: 1200, height: 630, alt: t(META.title, lang) }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await localeParam(params);
  const beaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable} ${firaCode.variable} ${luciole.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
