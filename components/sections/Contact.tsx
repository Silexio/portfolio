import { LeadForm } from "@/components/sections/LeadForm";
import { BookingButton } from "@/components/ui/BookingButton";
import { Btn } from "@/components/ui/Btn";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SectionHead } from "@/components/ui/SectionHead";
import { I18N, LEGAL } from "@/lib/data";
import type { LeadSource } from "@/lib/leads/constants";
import type { Locale } from "@/lib/i18n/config";
import { resolveDict, t } from "@/lib/i18n/utils";
import type { ServiceContact } from "@/lib/services";

type ContactProps = {
  lang: Locale;
  source?: LeadSource;
  askHours?: boolean;
  /** Textes propres à une page dédiée. Absent = ceux de l'accueil. */
  copy?: ServiceContact;
};

export function Contact({
  lang,
  source = "home",
  askHours = true,
  copy,
}: ContactProps) {
  const i18n = I18N.contact;
  return (
    <section
      id="contact"
      className="panel contact"
      aria-labelledby="contact-title"
    >
      <div className="wrap">
        <SectionHead
          id="contact-title"
          title={t(copy?.title ?? i18n.title, lang)}
          lead={t(copy?.sub ?? i18n.sub, lang)}
        />
        <Reveal className="contact__body" delay={60}>
          <LeadForm
            lang={lang}
            source={source}
            askHours={askHours}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
            taskLabel={t(copy?.task ?? i18n.task, lang)}
            taskPlaceholder={t(
              copy?.taskPlaceholder ?? i18n.taskPlaceholder,
              lang,
            )}
            legalHref={`/${lang}/legal`}
            labels={{
              ...resolveDict(I18N.form, lang),
              ...resolveDict(I18N.lead, lang),
            }}
          />
          <div className="contact__alt">
            <BookingButton variant="link">{t(i18n.cal, lang)}</BookingButton>
            {LEGAL.whatsappUrl && (
              <Btn
                href={LEGAL.whatsappUrl}
                variant="link"
                srHint={t(I18N.a11y.newTab, lang)}
              >
                <SocialIcon id="whatsapp" />
                {t(I18N.footer.whatsapp, lang)}
              </Btn>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
