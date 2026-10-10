import { BookingButton } from "@/components/ui/BookingButton";
import { Brand } from "@/components/ui/Brand";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Btn } from "@/components/ui/Btn";
import { EMAIL, GEO, I18N, LEGAL, SOCIALS, URLS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";
import { SERVICE_PAGES, servicePath } from "@/lib/services";

/**
 * Footer unique, qui porte les mentions légales belges obligatoires : entité de facturation Smart,
 * siège et TVA de la coopérative. `base` préfixe l'ancre de la marque : vide sur l'accueil,
 * `/{lang}` depuis une autre page.
 */
export function Footer({ lang, base = "" }: { lang: Locale; base?: string }) {
  const newTab = t(I18N.a11y.newTab, lang);
  const i18n = I18N.footer;

  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Brand href={`${base}#top`} label={t(I18N.a11y.home, lang)} />
          <p>{t(i18n.tagline, lang)}</p>
          <p className="footer__place">
            {GEO.locality} ({GEO.postalCode}) · {GEO.region} ·{" "}
            {t(i18n.country, lang)}
          </p>
        </div>

        <nav className="footer__col" aria-labelledby="footer-services">
          <h2 id="footer-services" className="footer__title">
            {t(i18n.servicesTitle, lang)}
          </h2>
          <ul>
            {SERVICE_PAGES.map((page) => (
              <li key={page.id}>
                <Btn href={servicePath(page, lang)} variant="link">
                  {t(page.name, lang)}
                </Btn>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__title">{t(i18n.contactTitle, lang)}</h2>
          <ul>
            <li>
              <Btn href={URLS.email} variant="link" icon="mail">
                {EMAIL}
              </Btn>
            </li>
            <li>
              <BookingButton variant="link">
                {t(I18N.contact.cal, lang)}
              </BookingButton>
            </li>
            <li>
              <Btn href={`/${lang}/legal`} variant="link">
                {t(i18n.legal, lang)}
              </Btn>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">{t(i18n.followTitle, lang)}</h2>
          <div className="footer__socials">
            {SOCIALS.map((social) => (
              <Btn
                key={social.id}
                href={social.url}
                variant="pill"
                srHint={newTab}
              >
                <SocialIcon id={social.id} />
                {social.label}
              </Btn>
            ))}
          </div>
          {LEGAL.whatsappUrl && (
            <Btn href={LEGAL.whatsappUrl} variant="pillStrong" srHint={newTab}>
              <SocialIcon id="whatsapp" />
              {t(i18n.whatsapp, lang)}
            </Btn>
          )}
        </div>
      </div>

      <div className="wrap footer__bar">
        <p>
          © 2026 {LEGAL.entity} · {t(i18n.rights, lang)} · {t(i18n.tag, lang)}
        </p>
        <p>
          {t(i18n.seat, lang)} : {LEGAL.host}, {LEGAL.street}, {LEGAL.city}
          {LEGAL.vat && (
            <>
              {" "}
              · {t(i18n.vatLabel, lang)} {LEGAL.vat}
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
