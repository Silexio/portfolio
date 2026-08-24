import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { LEGAL_PAGE, LEGAL_SECTIONS } from "@/lib/legal";
import { I18N, LEGAL } from "@/lib/data";
import { LOCALES } from "@/lib/i18n/config";
import { localeParam, t } from "@/lib/i18n/utils";
import { BASE_URL } from "@/lib/metadata";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const lang = await localeParam(params);
  const title = `${t(LEGAL_PAGE.title, lang)} | ${LEGAL.entity}`;
  return {
    title,
    description: t(LEGAL_PAGE.intro, lang).slice(0, 160),
    alternates: {
      canonical: `${BASE_URL}/${lang}/legal`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE_URL}/${l}/legal`])),
    },
  };
}

export default async function LegalPage({ params }: PageProps<"/[lang]/legal">) {
  const lang = await localeParam(params);
  const updated = new Intl.DateTimeFormat(lang, { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <Nav lang={lang} base={`/${lang}`} altPath="/legal" />
      <main id="main" className="legal">
        <div className="wrap">
          <h1 className="legal__title">{t(LEGAL_PAGE.title, lang)}</h1>
          <p className="legal__intro">{t(LEGAL_PAGE.intro, lang)}</p>
          <p className="legal__updated">
            {t(LEGAL_PAGE.updated, lang)} : {updated.format(new Date(LEGAL_PAGE.updatedOn))}
          </p>
          {LEGAL_SECTIONS.map((section) => (
            <section key={section.id} className="legal__section" aria-labelledby={`legal-${section.id}`}>
              <h2 id={`legal-${section.id}`} className="legal__heading">
                {t(section.title, lang)}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.fr.slice(0, 40)}>{t(paragraph, lang)}</p>
              ))}
            </section>
          ))}
          <a className="legal__back" href={`/${lang}`}>
            {t(I18N.a11y.home, lang)}
          </a>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
