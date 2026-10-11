import Image from "next/image";
import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT, I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function About({ lang }: { lang: Locale }) {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <Reveal
        className={`wrap about__grid${ABOUT.photo ? " about__grid--portrait" : ""}`}
      >
        {ABOUT.photo && (
          <div className="about__portrait">
            <Image
              src={ABOUT.photo}
              alt={t(ABOUT.photoAlt, lang)}
              width={ABOUT.photoWidth}
              height={ABOUT.photoHeight}
              sizes="(min-width: 960px) 420px, 100vw"
            />
          </div>
        )}
        <div className="about__text">
          <p className="eyebrow">{t(ABOUT.eyebrow, lang)}</p>
          <h2 id="about-title" className="title">
            {t(ABOUT.title, lang)}
          </h2>
          <p className="lead">{t(ABOUT.lead, lang)}</p>
          {ABOUT.story.map((paragraph) => (
            <p key={paragraph.fr}>{t(paragraph, lang)}</p>
          ))}
          {ABOUT.proof.fr && (
            <p className="about__proof">
              {ABOUT.proofUrl ? (
                <Btn
                  href={ABOUT.proofUrl}
                  variant="accent"
                  srHint={t(I18N.a11y.newTab, lang)}
                >
                  {t(ABOUT.proof, lang)}
                </Btn>
              ) : (
                t(ABOUT.proof, lang)
              )}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
