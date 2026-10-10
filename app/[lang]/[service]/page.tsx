import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { LOCALES } from "@/lib/i18n/config";
import { asLocale, t } from "@/lib/i18n/utils";
import { BASE_URL, openGraph } from "@/lib/metadata";
import { faqStructuredData, serviceStructuredData } from "@/lib/seo";
import { findServicePage, servicePath, serviceSlugs } from "@/lib/services";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return serviceSlugs(asLocale(params.lang)).map((service) => ({ service }));
}

async function resolve(params: PageProps<"/[lang]/[service]">["params"]) {
  const { lang: raw, service } = await params;
  const lang = asLocale(raw);
  const page = findServicePage(lang, service);
  if (!page) notFound();
  return { lang, page };
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[service]">): Promise<Metadata> {
  const { lang, page } = await resolve(params);
  const path = servicePath(page, lang);
  const title = t(page.meta.title, lang);
  const description = t(page.meta.description, lang);
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}${servicePath(page, l)}`]),
        ),
        "x-default": `${BASE_URL}${servicePath(page, "fr")}`,
      },
    },
    openGraph: openGraph(lang, path, title, description),
  };
}

export default async function ServiceRoute({
  params,
}: PageProps<"/[lang]/[service]">) {
  const { lang, page } = await resolve(params);
  const other = lang === "fr" ? "en" : "fr";

  return (
    <SiteShell
      lang={lang}
      base={`/${lang}`}
      altPath={`/${t(page.slug, other)}`}
    >
      <main id="main">
        <ServiceDetail page={page} lang={lang} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData(page, lang)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqStructuredData(lang, page.faq, servicePath(page, lang)),
          ),
        }}
      />
    </SiteShell>
  );
}
