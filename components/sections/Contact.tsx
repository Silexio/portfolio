import { ContactActions } from "@/components/sections/ContactActions";
import { Neurons } from "@/components/ui/Neurons";
import { Reveal } from "@/components/ui/Reveal";
import { EMAIL, I18N, PACKAGES, type PackageId } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Contact({ lang }: { lang: Locale }) {
  const i18n = I18N.contact;
  const packageLabels = Object.fromEntries(
    PACKAGES.map((pkg) => [pkg.id, t(pkg.title, lang)]),
  ) as Record<PackageId, string>;
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <Reveal>
          <div className="contact__inner">
            <Neurons />
            <span className="eyebrow contact__eyebrow">
              <span className="section-head__num">04</span>
              {t(i18n.eyebrow, lang)}
            </span>
            <h2 id="contact-title" className="contact__title">
              <span>{t(i18n.titleA, lang)}</span>
              <em>{t(i18n.titleB, lang)}</em>
            </h2>
            <p className="contact__sub">{t(i18n.sub, lang)}</p>
            <ContactActions
              email={EMAIL}
              packageLabels={packageLabels}
              labels={{
                cal: t(i18n.cal, lang),
                quote: t(i18n.quote, lang),
                interests: t(i18n.interests, lang),
                subject: t(i18n.subject, lang),
                servicesEmpty: t(i18n.servicesEmpty, lang),
                emailBody: t(i18n.emailBody, lang),
                remove: t(I18N.a11y.remove, lang),
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
