import type { Metadata, Viewport } from "next";
import { Fira_Code, Inter, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { EMAIL, META, URLS } from "@/lib/data";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { localeParam, t } from "@/lib/i18n/utils";
import { BASE_URL } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
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

function structuredData(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#person`,
        name: "Nicolas Wieckiewicz",
        url: BASE_URL,
        email: EMAIL,
        sameAs: [URLS.github, URLS.linkedin],
        address: { "@type": "PostalAddress", addressCountry: "BE" },
        knowsAbout: ["TypeScript", "Next.js", "Python", "PostgreSQL", "Docker", "Linux", "FastAPI"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${BASE_URL}/#studio`,
        name: "Silexio",
        url: BASE_URL,
        logo: `${BASE_URL}/icon.png`,
        image: `${BASE_URL}/opengraph.png`,
        email: EMAIL,
        description: t(META.description, lang),
        inLanguage: lang,
        address: { "@type": "PostalAddress", addressCountry: "BE" },
        areaServed: ["BE", "LU", "FR"],
        founder: { "@id": `${BASE_URL}/#person` },
      },
    ],
  };
}

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
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: "Silexio",
      locale: lang === "fr" ? "fr_BE" : "en_US",
      alternateLocale: lang === "fr" ? "en_US" : "fr_BE",
      images: [{ url: "/opengraph.png", width: 1200, height: 630, alt: "Silexio" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await localeParam(params);
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${montserrat.variable} ${inter.variable} ${firaCode.variable} ${luciole.variable}`}
    >
      <head>
        <Analytics />
        <SpeedInsights />
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
