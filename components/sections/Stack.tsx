import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, STACK_GROUPS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Stack({ lang }: { lang: Locale }) {
  return (
    <section id="stack" className="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead
          id="stack-title"
          eyebrow={t(I18N.stack.eyebrow, lang)}
          num="03"
          title={t(I18N.stack.title, lang)}
          subtitle={t(I18N.stack.subtitle, lang)}
        />
        <Reveal className="stack__grid">
          {STACK_GROUPS.map((group, i) => (
            <div key={group.label.fr} className="stack__group">
              <span className="stack__label">
                {String(i + 1).padStart(2, "0")} · {t(group.label, lang)}
              </span>
              <div className="stack__items">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
