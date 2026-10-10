import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Btn } from "@/components/ui/Btn";
import { LEGAL_PAGE, LEGAL_SECTIONS } from "@/lib/legal";
import { I18N, LEGAL } from "@/lib/data";
import { LOCALES } from "@/lib/i18n/config";
import { localeParam, longDate, t } from "@/lib/i18n/utils";
import { BASE_URL, openGraph } from "@/lib/metadata";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const lang = await localeParam(params);
  const title = `${t(LEGAL_PAGE.title, lang)} | ${LEGAL.entity}`;
  const description = t(LEGAL_PAGE.intro, lang).slice(0, 160);
  const path = `/${lang}/legal`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${lang}/legal`,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}/legal`]),
        ),
        // Aligne le groupe hreflang sur celui de l'accueil, qui déclare déjà un x-default.
        "x-default": `${BASE_URL}/fr/legal`,
      },
    },
    openGraph: openGraph(lang, path, title, description),
  };
}

export default async function LegalPage({
  params,
}: PageProps<"/[lang]/legal">) {
  const lang = await localeParam(params);

  return (
    <SiteShell lang={lang} base={`/${lang}`} altPath="/legal">
      <main id="main" className="legal">
        <div className="wrap">
          <h1 className="display">{t(LEGAL_PAGE.title, lang)}</h1>
          <p className="lead">{t(LEGAL_PAGE.intro, lang)}</p>
          <p className="legal__updated">
            {t(LEGAL_PAGE.updated, lang)} :{" "}
            {longDate(LEGAL_PAGE.updatedOn, lang)}
          </p>
          {LEGAL_SECTIONS.map((section) => (
            <section
              key={section.id}
              className="legal__section"
              aria-labelledby={`legal-${section.id}`}
            >
              <h2 id={`legal-${section.id}`} className="subtitle">
                {t(section.title, lang)}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.fr.slice(0, 40)}>{t(paragraph, lang)}</p>
              ))}
            </section>
          ))}
          <Btn href={`/${lang}`} variant="accent">
            {t(I18N.service.home, lang)}
          </Btn>
        </div>
      </main>
    </SiteShell>
  );
}
