import { cssVars } from "@/lib/css";
import { DomainArt } from "@/components/art/DomainArt";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Offers } from "@/components/sections/Offers";
import { BookingButton } from "@/components/ui/BookingButton";
import { Btn } from "@/components/ui/Btn";
import { Reveal, revealDelay } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { COVERAGE, I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { fill, t } from "@/lib/i18n/utils";
import type { ServicePage } from "@/lib/services";

/** Corps d'une page dédiée : promesse, situations, démarche, offres ou zone, FAQ, formulaire. */
export function ServiceDetail({
  page,
  lang,
}: {
  page: ServicePage;
  lang: Locale;
}) {
  const i18n = I18N.service;
  return (
    <>
      <nav
        className="wrap breadcrumb"
        aria-label={t(I18N.a11y.breadcrumb, lang)}
      >
        <ol>
          <li>
            <a className="link" href={`/${lang}`}>
              {t(i18n.home, lang)}
            </a>
          </li>
          <li aria-current="page">{t(page.name, lang)}</li>
        </ol>
      </nav>

      <section className="service-hero" aria-labelledby="service-title">
        <div className="wrap service-hero__grid">
          <div className="service-hero__text">
            <p className="eyebrow hero-reveal">{t(page.name, lang)}</p>
            <h1
              id="service-title"
              className="display hero-reveal"
              style={revealDelay(80)}
            >
              {t(page.title, lang)}
            </h1>
            <p className="lead hero-reveal" style={revealDelay(160)}>
              {t(page.lead, lang)}
            </p>
            <div className="cta-row hero-reveal" style={revealDelay(240)}>
              <Btn href="#contact" icon="arrow">
                {t(page.cta, lang)}
              </Btn>
              <BookingButton variant="link">
                {t(I18N.contact.cal, lang)}
              </BookingButton>
            </div>
          </div>
          {page.art && (
            <div
              className="service-hero__art hero-reveal"
              style={revealDelay(200)}
            >
              <DomainArt id={page.art} lang={lang} />
            </div>
          )}
        </div>
      </section>

      <section className="panel" aria-labelledby="situations-title">
        <div className="wrap">
          <SectionHead
            id="situations-title"
            title={t(page.situationsTitle, lang)}
            align="start"
          />
          <Reveal delay={60}>
            <ul className="situations">
              {page.situations.map((situation, i) => (
                <li key={situation.fr} style={cssVars({ "--i": i })}>
                  {t(situation, lang)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="steps-title">
        <div className="wrap">
          <SectionHead
            id="steps-title"
            title={t(page.stepsTitle, lang)}
            align="start"
          />
          <Reveal delay={60}>
            <ol className="steps">
              {page.steps.map((step, i) => (
                <li
                  key={step.title.fr}
                  className="step"
                  style={cssVars({ "--i": i })}
                >
                  <span className="step__num">
                    {fill(t(i18n.step, lang), { n: String(i + 1) })}
                  </span>
                  <h3 className="heading-sm">{t(step.title, lang)}</h3>
                  <p>{t(step.body, lang)}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {page.asset && (
        <section className="panel" aria-labelledby="asset-title">
          <div className="wrap">
            <Reveal className="asset">
              <p className="eyebrow">{t(page.asset.eyebrow, lang)}</p>
              <h2 id="asset-title" className="title">
                {t(page.asset.title, lang)}
              </h2>
              <p className="lead">{t(page.asset.body, lang)}</p>
              <ul className="situations">
                {page.asset.points.map((point, i) => (
                  <li key={point.fr} style={cssVars({ "--i": i })}>
                    {t(point, lang)}
                  </li>
                ))}
              </ul>
              <p className="asset__note">{t(page.asset.note, lang)}</p>
            </Reveal>
          </div>
        </section>
      )}

      {page.offers.length > 0 ? (
        <Offers lang={lang} ids={page.offers} title={t(i18n.offers, lang)} />
      ) : (
        <section className="panel" aria-labelledby="coverage-title">
          <div className="wrap">
            <SectionHead
              id="coverage-title"
              title={t(i18n.coverage, lang)}
              lead={t(i18n.coverageSub, lang)}
              align="start"
            />
            <Reveal className="coverage" delay={60}>
              {COVERAGE.map((area) => (
                <div key={area.label.fr}>
                  <h3 className="heading-sm">{t(area.label, lang)}</h3>
                  <ul className="coverage__cities">
                    {area.cities.map((city) => (
                      <li key={city}>{city}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <Faq lang={lang} entries={page.faq} />
      <Contact
        lang={lang}
        source={page.id}
        askHours={page.askHours}
        copy={page.contact}
      />
    </>
  );
}
