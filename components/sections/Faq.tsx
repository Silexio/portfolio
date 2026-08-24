import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { FAQ, I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Faq({ lang }: { lang: Locale }) {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <SectionHead
          id="faq-title"
          eyebrow={t(I18N.faq.eyebrow, lang)}
          num="03"
          title={t(I18N.faq.title, lang)}
          subtitle={t(I18N.faq.subtitle, lang)}
        />
        <Reveal className="faq__list">
          {FAQ.map((entry) => (
            <details key={entry.q.fr} className="faq__item">
              <summary className="faq__q">
                <h3>{t(entry.q, lang)}</h3>
                <span className="faq__marker" aria-hidden="true" />
              </summary>
              <p className="faq__a">{t(entry.a, lang)}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
