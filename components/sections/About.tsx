import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function About({ lang }: { lang: Locale }) {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap">
        <Reveal className={`about__grid${ABOUT.photo ? " about__grid--portrait" : ""}`}>
          {ABOUT.photo && (
            <div className="about__portrait">
              <Image
                src={ABOUT.photo}
                alt={t(ABOUT.photoAlt, lang)}
                width={640}
                height={800}
                sizes="(min-width: 900px) 340px, 100vw"
              />
            </div>
          )}
          <div className="about__body">
            <span className="eyebrow">{t(ABOUT.eyebrow, lang)}</span>
            <h2 id="about-title" className="about__title">
              {t(ABOUT.title, lang)}
            </h2>
            {ABOUT.body.map((paragraph) => (
              <p key={paragraph.fr.slice(0, 40)}>{t(paragraph, lang)}</p>
            ))}
            <p className="about__signature">
              <strong>{ABOUT.name}</strong>
              <span>{t(ABOUT.role, lang)}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
