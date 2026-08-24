import Image from "next/image";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { EMAIL, GEO, I18N, LEGAL, SOCIALS, URLS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const NAV_SECTIONS = ["services", "work", "faq", "contact"] as const;

export function Footer({ lang }: { lang: Locale }) {
  const newTab = t(I18N.a11y.newTab, lang);
  const i18n = I18N.footer;

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand-col">
          <a href="#top" className="footer__brand" aria-label={t(I18N.a11y.home, lang)}>
            <Image src="/silexio-mark.png" alt="" width={22} height={22} draggable={false} />
            <span>SILEXIO</span>
          </a>
          <p className="footer__tagline">{t(i18n.tagline, lang)}</p>
          <p className="footer__place">
            {GEO.locality} ({GEO.postalCode}) · {GEO.region} · {t(i18n.country, lang)}
          </p>
        </div>

        <nav className="footer__col" aria-label={t(i18n.navTitle, lang)}>
          <h2 className="footer__col-title">{t(i18n.navTitle, lang)}</h2>
          <ul>
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t(I18N.nav[id], lang)}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__col-title">{t(i18n.contactTitle, lang)}</h2>
          <ul>
            <li>
              <a href={URLS.email}>{EMAIL}</a>
            </li>
            <li>
              <a href={`/${lang}/legal`}>{t(i18n.legal, lang)}</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__col-title">{t(i18n.followTitle, lang)}</h2>
          <div className="footer__socials">
            {SOCIALS.map((social) => (
              <a
                key={social.id}
                href={social.url}
                className="footer__social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} — ${newTab}`}
              >
                <SocialIcon id={social.id} />
              </a>
            ))}
            {LEGAL.whatsappUrl && (
              <a
                href={LEGAL.whatsappUrl}
                className="footer__social footer__social--cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon id="whatsapp" />
                {t(i18n.whatsapp, lang)}
                <span className="sr-only"> — {newTab}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bar">
        <p>© 2026 {LEGAL.entity} · {t(i18n.rights, lang)} · {t(i18n.tag, lang)}</p>
        <p>
          {t(i18n.seat, lang)} : {LEGAL.host}, {LEGAL.street}, {LEGAL.city}
          {LEGAL.vat && <> · {t(i18n.vatLabel, lang)} {LEGAL.vat}</>}
        </p>
      </div>
    </footer>
  );
}
