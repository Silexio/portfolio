import type { CSSProperties } from "react";
import { Btn } from "@/components/ui/Btn";
import { HeroLines } from "@/components/ui/HeroLines";
import { Mark } from "@/components/ui/Mark";
import { I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const revealDelay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero({ lang }: { lang: Locale }) {
  const i18n = I18N.hero;
  return (
    <section id="top" className="hero" aria-label={t(I18N.hero.eyebrow, lang)}>
      <div className="hero__shard" aria-hidden="true">
        <Mark />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__eyebrow-row hero-reveal">
          <span className="status-pill">
            <span className="status-pill__dot" aria-hidden="true" />
            {t(i18n.status, lang)} · {t(i18n.eyebrow, lang)}
          </span>
        </div>

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

        <p className="hero__pitch hero-reveal" style={revealDelay(400)}>
          {t(i18n.pitch, lang)}
        </p>

        <div className="hero__cta hero-reveal" style={revealDelay(520)}>
          <Btn href="#contact" variant="ember">
            {t(i18n.cta1, lang)}
          </Btn>
          <Btn href="#work" variant="ghost" icon={false}>
            {t(i18n.cta2, lang)}
          </Btn>
        </div>

        <div className="hero__meta hero-reveal" style={revealDelay(640)}>
          <HeroMeta
            label={t(i18n.metaBaseLabel, lang)}
            value={t(i18n.metaBaseValue, lang)}
            sub={t(i18n.metaBaseSub, lang)}
          />
          <HeroMeta
            label={t(i18n.metaStatusLabel, lang)}
            value={t(i18n.metaStatusValue, lang)}
            live
          />
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
