import Image from "next/image";
import { Btn } from "@/components/ui/Btn";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
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
              sizes="(min-width: 900px) 420px, 60vw"
            />
          </div>
        )}
        <div className="about__text">
          <p className="eyebrow">{t(ABOUT.eyebrow, lang)}</p>
          <h2 id="about-title" className="title">
            {t(ABOUT.title, lang)}
          </h2>
          <p className="lead">{t(ABOUT.lead, lang)}</p>

          <ul className="about__steps">
            {ABOUT.story.map((step) => (
              <li key={step.icon} className="about__step">
                <span className="about__step-glyph" aria-hidden="true">
                  <Icon name={step.icon} />
                </span>
                <div className="about__step-text">
                  <h3 className="heading-sm">{t(step.title, lang)}</h3>
                  <p>{t(step.body, lang)}</p>
                </div>
              </li>
            ))}
          </ul>

          {ABOUT.proofs.length > 0 && (
            <div className="about__proofs">
              {ABOUT.proofs.map((proof) => (
                <Btn
                  key={proof.id}
                  href={proof.url}
                  variant="pill"
                  srHint={t(I18N.a11y.newTab, lang)}
                >
                  <SocialIcon id={proof.id} />
                  {t(proof.label, lang)}
                </Btn>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
