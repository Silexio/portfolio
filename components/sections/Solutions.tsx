import { DomainArt } from "@/components/art/DomainArt";
import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";
import { DOMAINS, I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";
import { servicePage, servicePath } from "@/lib/services";

/** Trois panneaux qu'on comprend en une seconde : un verbe, une promesse, une image. */
export function Solutions({ lang }: { lang: Locale }) {
  const i18n = I18N.solutions;
  return (
    <div id="solutions" className="solutions">
      <div className="domains">
        {DOMAINS.map((domain, i) => (
          <Reveal key={domain.id} className="domain" delay={i * 60}>
            <div className="domain__text">
              <h2 className="title">{t(domain.title, lang)}</h2>
              <p className="lead">{t(domain.lead, lang)}</p>
              <Btn
                href={servicePath(servicePage(domain.service), lang)}
                variant="accent"
                className="domain__link"
                icon="arrow"
                srHint={t(domain.title, lang)}
              >
                {t(i18n.more, lang)}
              </Btn>
            </div>
            <DomainArt id={domain.id} lang={lang} />
          </Reveal>
        ))}
      </div>
      <p className="solutions__support">
        {t(i18n.supportLead, lang)}{" "}
        <a
          className="link link--accent"
          href={servicePath(servicePage("support"), lang)}
        >
          {t(i18n.supportLink, lang)}
        </a>
      </p>
    </div>
  );
}
