import Image from "next/image";
import { Btn } from "@/components/ui/Btn";
import { HeroLines } from "@/components/ui/HeroLines";
import { Reveal } from "@/components/ui/Reveal";
import { I18N, MARQUEE } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Hero({ lang }: { lang: Locale }) {
  const i18n = I18N.hero;
  return (
    <section id="top" className="hero" aria-label={t(I18N.hero.eyebrow, lang)}>
      <div className="hero__shard" aria-hidden="true">
        <Image
          src="/silexio-mark.png"
          alt=""
          width={800}
          height={800}
          sizes="(max-width: 760px) 130vw, 85vw"
          draggable={false}
          priority
        />
      </div>

      <div className="wrap hero__inner">
        <Reveal className="hero__eyebrow-row">
          <span className="status-pill">
            <span className="status-pill__dot" aria-hidden="true" />
            {t(i18n.status, lang)} · {t(i18n.eyebrow, lang)}
          </span>
        </Reveal>

        <p className="hero__supertitle">
          <HeroLines lines={t(i18n.titlePre, lang)} baseDelay={150} />
        </p>

        <h1 className="hero__title">
          <HeroLines
            lines={[
              t(i18n.titleA, lang),
              <span key="line-2">
                <em>{t(i18n.titleB, lang)}</em> {t(i18n.titleC, lang)}
              </span>,
            ]}
            baseDelay={300}
            stagger={140}
          />
        </h1>

        <Reveal delay={400}>
          <p className="hero__pitch">{t(i18n.pitch, lang)}</p>
        </Reveal>

        <Reveal delay={520} className="hero__cta">
          <Btn href="#contact" variant="ember">{t(i18n.cta1, lang)}</Btn>
          <Btn href="#work" variant="ghost" icon={false}>{t(i18n.cta2, lang)}</Btn>
        </Reveal>

        <Reveal delay={640} className="hero__meta">
          <HeroMeta label={t(i18n.metaBaseLabel, lang)} value={t(i18n.metaBaseValue, lang)} sub={t(i18n.metaBaseSub, lang)} />
          <HeroMeta label={t(i18n.metaStatusLabel, lang)} value={t(i18n.metaStatusValue, lang)} live />
        </Reveal>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1].map((half) => (
              <span key={half}>
                {MARQUEE.map((item) => (
                  <span key={item}>
                    {item} <span className="dot">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

type HeroMetaProps = {
  label: string;
  value: string;
  sub?: string;
  live?: boolean;
};

function HeroMeta({ label, value, sub, live }: HeroMetaProps) {
  return (
    <div className="hero__meta-item">
      <span className="label mono">{label}</span>
      <span className="value">
        {live && <span className="dot" aria-hidden="true" />}
        {value}
      </span>
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}
