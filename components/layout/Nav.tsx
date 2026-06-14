import { NavClient, type NavLink } from "@/components/layout/NavClient";
import { I18N, URLS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/utils";

const NAV_SECTIONS = ["services", "work", "stack", "contact"] as const;

export function Nav({ lang }: { lang: Locale }) {
  const links: NavLink[] = NAV_SECTIONS.map((id) => ({ id, label: t(I18N.nav[id], lang) }));
  return (
    <NavClient
      lang={lang}
      links={links}
      calUrl={URLS.cal}
      labels={{
        home: t(I18N.a11y.home, lang),
        menu: t(I18N.a11y.menu, lang),
        close: t(I18N.a11y.close, lang),
        toggleLang: t(I18N.a11y.toggleLang, lang),
        toggleTheme: t(I18N.a11y.toggleTheme, lang),
        cta: t(I18N.contact.cal, lang),
        newTab: t(I18N.a11y.newTab, lang),
        selected: t(I18N.a11y.selected, lang),
      }}
    />
  );
}
