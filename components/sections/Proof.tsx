import { Reveal } from "@/components/ui/Reveal";
import { I18N, MIN_REVIEWS, REVIEWS, TESTIMONIALS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const MAX_RATING = 5;

/**
 * Preuve sociale strictement externe : notes publiques vérifiables chez leur plateforme et
 * témoignages autorisés. Aucun engagement auto-décerné — une promesse que l'on se donne à
 * soi-même ne prouve rien et sonne comme un argument de vente.
 */
export function Proof({ lang }: { lang: Locale }) {
  const i18n = I18N.proof;
  const reviews = REVIEWS.filter(
    (review) => review.url && review.count >= MIN_REVIEWS,
  );
  if (!TESTIMONIALS.length && !reviews.length) return null;

  const newTab = t(I18N.a11y.newTab, lang);
  const score = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const day = new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="proof" className="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <Reveal className="proof__band">
          <h2 id="proof-title" className="proof__title">
            {t(i18n.reviewsTitle, lang)}
          </h2>
          <div className="proof__reviews-grid">
            {reviews.map((review) => {
              const rating = score.format(review.rating);
              const unit = t(
                review.count > 1 ? i18n.reviews : i18n.review,
                lang,
              );
              return (
                <a
                  key={review.id}
                  href={review.url}
                  className="proof__review"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${review.platform} — ${rating}/${MAX_RATING}, ${review.count} ${unit} — ${newTab}`}
                >
                  <span className="proof__review-platform">
                    {review.platform}
                  </span>
                  <span
                    className="proof__review-stars"
                    style={
                      {
                        "--fill": `${(review.rating / MAX_RATING) * 100}%`,
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  >
                    ★★★★★
                  </span>
                  <span className="proof__review-score" aria-hidden="true">
                    {rating}
                    <em>/{MAX_RATING}</em>
                  </span>
                  <span className="proof__review-count" aria-hidden="true">
                    {review.count} {unit}
                  </span>
                  <span className="proof__review-cta" aria-hidden="true">
                    {t(i18n.reviewsCta, lang)}
                  </span>
                  <span className="proof__review-checked">
                    {t(i18n.reviewsChecked, lang)}{" "}
                    {day.format(new Date(review.checkedOn))}
                  </span>
                </a>
              );
            })}
          </div>
        </Reveal>

        {TESTIMONIALS.length > 0 && (
          <Reveal className="proof__quotes" delay={120}>
            {TESTIMONIALS.map((item) => (
              <figure key={item.author} className="proof__quote">
                <blockquote>{t(item.quote, lang)}</blockquote>
                <figcaption>
                  <strong>{item.author}</strong>
                  <span>{t(item.role, lang)}</span>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
