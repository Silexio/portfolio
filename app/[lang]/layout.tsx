import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { MarkSprite } from "@/components/ui/Mark";
import { BOOT_SCRIPT } from "@/lib/boot";
import { BRAND } from "@/lib/brand";
import { LEGAL, META } from "@/lib/data";
import { LOCALES } from "@/lib/i18n/config";
import { localeParam, t } from "@/lib/i18n/utils";
import { BASE_URL, openGraph } from "@/lib/metadata";
import { structuredData } from "@/lib/seo";
import "../globals.css";

/* Deux familles seulement, auto-hébergées et sous-échantillonnées (voir app/fonts/README.md) :
   Montserrat pour les titres et le wordmark, Luciole — dessinée pour les lecteurs malvoyants et
   dyslexiques — pour tout le reste. Pas d'italique : la charte réserve l'insistance au gras. Le
   build ne télécharge rien, donc il passe sans réseau. */
const montserrat = localFont({
  src: "../fonts/Montserrat-Variable.woff2",
  weight: "500 600",
  variable: "--font-montserrat",
  declarations: [{ prop: "font-display", value: "swap" }],
});
const luciole = localFont({
  variable: "--font-luciole",
  src: [
    { path: "../fonts/Luciole-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Luciole-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.bg },
    { media: "(prefers-color-scheme: dark)", color: BRAND.bgDark },
  ],
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps<"/[lang]">, "params">): Promise<Metadata> {
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
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: "/fr", en: "/en", "x-default": "/fr" },
    },
    openGraph: openGraph(
      lang,
      `/${lang}`,
      t(META.title, lang),
      t(META.description, lang),
    ),
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const lang = await localeParam(params);
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${montserrat.variable} ${luciole.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData(lang)),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <MarkSprite />
        {children}
      </body>
    </html>
  );
}
