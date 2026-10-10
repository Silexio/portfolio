import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT } from "@/lib/data";
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
              width={640}
              height={680}
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
          {ABOUT.proof.fr && (
            <p className="about__proof">{t(ABOUT.proof, lang)}</p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
