"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/ui/Brand";
import { Btn } from "@/components/ui/Btn";
import { Icon } from "@/components/ui/Icon";
import { openBooking } from "@/hooks/useBookingModal";
import type { Locale } from "@/lib/i18n/config";

export type NavLink = {
  id: string;
  label: string;
};

export type NavLabels = {
  home: string;
  nav: string;
  menu: string;
  close: string;
  toggleLang: string;
  toggleTheme: string;
  book: string;
  task: string;
};

type NavClientProps = {
  lang: Locale;
  links: NavLink[];
  labels: NavLabels;
  /** Préfixe des ancres de section. Vide sur l'accueil, `/{lang}` depuis une autre page. */
  base?: string;
  /** Chemin équivalent dans l'autre langue, pour ne pas éjecter le visiteur vers l'accueil. */
  altPath?: string;
};

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("silex_theme", next);
    } catch {}
  };
  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
}

/** Lune ou soleil selon [data-theme], basculés en CSS : aucun état React, donc aucun décalage d'hydratation. */
function ThemeToggle({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="icon-btn theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
    >
      <Icon name="moon" className="theme-toggle__moon" />
      <Icon name="sun" className="theme-toggle__sun" />
    </button>
  );
}

export function NavClient({
  lang,
  links,
  labels,
  base = "",
  altPath = "",
}: NavClientProps) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const otherLang: Locale = lang === "fr" ? "en" : "fr";

  /* `showModal()` apporte gratuitement ce qu'un div ne donne pas : le reste de la page devient
     inerte, le focus est piégé puis rendu au bouton d'ouverture, et Échap ferme. Sans ça le focus
     passait derrière un panneau opaque — on tabulait dans une page invisible. */
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    if (open && !sheet.open) sheet.showModal();
    if (!open && sheet.open) sheet.close();
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Un dialogue modal laissé ouvert mais masqué par la requête média du bureau rendrait toute la
     page inerte : on referme en passant la barre des 900px. */
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 900px)");
    const sync = () => {
      if (desktop.matches) setOpen(false);
    };
    sync();
    desktop.addEventListener("change", sync);
    return () => desktop.removeEventListener("change", sync);
  }, [open]);

  const langSwitch = (
    <Link
      href={`/${otherLang}${altPath}`}
      hrefLang={otherLang}
      scroll={false}
      /* Mesuré en production : ce lien est le seul `next/link` du site, il est rendu deux fois
         (en-tête et menu) et il préchargeait /en — charge RSC comprise — à chaque page vue, soit
         3 requêtes Worker observées pour un lien que presque personne ne clique. */
      prefetch={false}
      className="lang-switch"
    >
      <span data-active={lang === "fr"}>FR</span>
      <span aria-hidden="true">·</span>
      <span data-active={lang === "en"}>EN</span>
      {/* Le libellé complète le texte visible au lieu de le remplacer : un aria-label qui ne
          contient pas « FR · EN » rend le lien inatteignable à la commande vocale (WCAG 2.5.3). */}
      <span className="sr-only"> — {labels.toggleLang}</span>
    </Link>
  );

  return (
    <>
      <header className="nav">
        <div className="nav__bar">
          <Brand label={labels.home} href={`${base}#top`} glint="nav" />
          <nav className="nav__links" aria-label={labels.nav}>
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <a href={`${base}#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__tools">
            {langSwitch}
            <ThemeToggle label={labels.toggleTheme} />
            <Btn onClick={openBooking} className="btn--compact nav__cta">
              {labels.book}
            </Btn>
            <button
              type="button"
              className="icon-btn nav__menu-btn"
              onClick={() => setOpen(true)}
              aria-label={labels.menu}
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={sheetRef}
        className="sheet"
        data-open={open}
        aria-label={labels.menu}
        onClose={() => setOpen(false)}
      >
        <div className="sheet__head">
          <Brand
            label={labels.home}
            href={`${base}#top`}
            onClick={() => setOpen(false)}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => setOpen(false)}
            aria-label={labels.close}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label={labels.nav}>
          <ul className="sheet__links">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`${base}#${link.id}`} onClick={() => setOpen(false)}>
                  {link.label}
                  <span aria-hidden="true">›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sheet__foot">
          <Btn href={`${base}#contact`} onClick={() => setOpen(false)}>
            {labels.task}
          </Btn>
          <Btn
            variant="link"
            onClick={() => {
              setOpen(false);
              openBooking();
            }}
          >
            {labels.book}
          </Btn>
          <div className="sheet__row">
            {langSwitch}
            <ThemeToggle label={labels.toggleTheme} />
          </div>
        </div>
      </dialog>
    </>
  );
}
