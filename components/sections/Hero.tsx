import { cssVars } from "@/lib/css";
import { ChoreMap } from "@/components/art/ChoreMap";
import { Btn } from "@/components/ui/Btn";
import { HeroLines } from "@/components/ui/HeroLines";
import { revealDelay } from "@/components/ui/Reveal";
import { I18N, MIN_REVIEWS, REVIEWS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { fill, intlLocale, longDate, t } from "@/lib/i18n/utils";

const MAX_RATING = 5;

export function Hero({ lang }: { lang: Locale }) {
  const i18n = I18N.hero;
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__text">
        <p className="eyebrow hero-reveal">{t(i18n.eyebrow, lang)}</p>
        <h1 id="hero-title" className="display hero__title">
          <HeroLines
            lines={[
              t(i18n.titleA, lang),
              <span key="accent" className="hero__accent">
                {t(i18n.titleB, lang)}
              </span>,
            ]}
            baseDelay={120}
            stagger={140}
          />
        </h1>
        <div className="cta-row hero-reveal" style={revealDelay(360)}>
          <Btn href="#contact" icon="arrow">
            {t(i18n.cta, lang)}
          </Btn>
          <Btn href="#offers" variant="link">
            {t(i18n.pricing, lang)}
          </Btn>
        </div>
        <Rating lang={lang} />
      </div>
      <ChoreMap lang={lang} />
    </section>
  );
}

/**
 * Note publique vérifiable chez sa plateforme, jamais un engagement que l'on se donne à soi-même.
 * La date du relevé complète le nom accessible : une note non datée finit par mentir.
 */
function Rating({ lang }: { lang: Locale }) {
  const review = REVIEWS.find(
    (entry) => entry.url && entry.count >= MIN_REVIEWS,
  );
  if (!review) return null;

  const i18n = I18N.hero;
  const score = new Intl.NumberFormat(intlLocale(lang), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(review.rating);
  const date = longDate(review.checkedOn, lang);

  return (
    <p className="hero__rating hero-reveal" style={revealDelay(460)}>
      <Btn
        href={review.url}
        variant="link"
        srHint={`${fill(t(i18n.ratingChecked, lang), { date })}, ${t(I18N.a11y.newTab, lang)}`}
      >
        <span
          className="stars"
          style={cssVars({
            "--fill": `${(review.rating / MAX_RATING) * 100}%`,
          })}
          aria-hidden="true"
        >
          ★★★★★
        </span>
        {fill(t(i18n.rating, lang), {
          score,
          count: String(review.count),
          platform: review.platform,
        })}
      </Btn>
    </p>
  );
}
