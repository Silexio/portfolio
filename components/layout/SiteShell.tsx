import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Booking } from "@/components/sections/Booking";
import { I18N } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

type SiteShellProps = {
  lang: Locale;
  children: ReactNode;
  /** Préfixe des ancres de section. Vide sur l'accueil, `/{lang}` depuis une autre page. */
  base?: string;
  /** Chemin équivalent dans l'autre langue, pour le sélecteur de langue. */
  altPath?: string;
};

/** Chrome commun à toutes les pages : lien d'évitement, en-tête, pied de page et modale de rendez-vous. */
export function SiteShell({
  lang,
  children,
  base = "",
  altPath = "",
}: SiteShellProps) {
  return (
    <>
      <a href="#main" className="skip-link">
        {t(I18N.a11y.skip, lang)}
      </a>
      <Nav lang={lang} base={base} altPath={altPath} />
      {children}
      <Footer lang={lang} base={base} />
      <Booking lang={lang} />
    </>
  );
}
