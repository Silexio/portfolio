import Image from "next/image";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { I18N, SOCIALS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

export function Footer({ lang }: { lang: Locale }) {
  const newTab = t(I18N.a11y.newTab, lang);
  return (
    <footer className="footer">
      <div className="footer__inner">
        <a href="#top" className="footer__brand" aria-label={t(I18N.a11y.home, lang)}>
          <Image src="/silexio-mark.png" alt="" width={20} height={20} draggable={false} />
          <span>SILEXIO</span>
        </a>
        <p className="footer__rights">
          © 2026 · {t(I18N.footer.rights, lang)} · {t(I18N.footer.tag, lang)}
        </p>
        <nav className="footer__socials" aria-label={t(I18N.a11y.socials, lang)}>
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
        </nav>
      </div>
    </footer>
  );
}
