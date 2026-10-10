import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, type FaqEntry } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

type FaqProps = {
  lang: Locale;
  entries: FaqEntry[];
};

/** Accordéons natifs : les réponses restent dans le HTML repliées, donc indexables. La page qui rend ce bloc émet aussi son JSON-LD. */
export function Faq({ lang, entries }: FaqProps) {
  const i18n = I18N.faq;
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <SectionHead
          id="faq-title"
          title={t(i18n.title, lang)}
          lead={t(i18n.lead, lang)}
          align="start"
        >
          <Btn href="#contact" variant="accent" icon="mail">
            {t(i18n.more, lang)}
          </Btn>
        </SectionHead>
        <Reveal className="faq__list" delay={60}>
          {entries.map((entry) => (
            <details key={entry.q.fr} className="faq__item">
              <summary className="faq__q">
                <h3 className="heading-sm">{t(entry.q, lang)}</h3>
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
