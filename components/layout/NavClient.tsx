"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { openBooking } from "@/hooks/useBookingModal";
import { useSelectedPackages } from "@/hooks/usePackages";
import type { Locale } from "@/lib/i18n/config";

export type NavLink = {
  id: string;
  label: string;
};

export type NavLabels = {
  home: string;
  menu: string;
  close: string;
  toggleLang: string;
  toggleTheme: string;
  cta: string;
  selected: string;
};

type NavClientProps = {
  lang: Locale;
  links: NavLink[];
  labels: NavLabels;
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

function Brand({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <a href="#top" className="nav__brand" aria-label={label} onClick={onClick}>
      <Image src="/silexio-mark.png" alt="" width={22} height={22} draggable={false} />
      <span className="nav__brand-text">SILEXIO</span>
    </a>
  );
}

function ThemeIcon() {
  return (
    <>
      <svg className="moon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M11.5 8.5a4 4 0 01-5-5 4 4 0 106 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <svg className="sun" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.5 2.5l1 1M10.5 10.5l1 1M11.5 2.5l-1 1M3.5 10.5l-1 1"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

export function NavClient({ lang, links, labels }: NavClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const ids = useMemo(() => links.map((link) => link.id), [links]);
  const activeId = useActiveSection(ids);
  const count = useSelectedPackages().length;
  const otherLang: Locale = lang === "fr" ? "en" : "fr";

  const countLabel = (link: NavLink) =>
    link.id === "contact" && count > 0 ? `${link.label} (${count} ${labels.selected})` : undefined;

  const closeSheet = () => {
    setOpen(false);
    menuRef.current?.focus();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const langSwitch = (
    <Link
      href={`/${otherLang}`}
      hrefLang={otherLang}
      scroll={false}
      className="nav__lang"
      aria-label={labels.toggleLang}
    >
      <span data-active={lang === "fr"}>FR</span>
      <span>·</span>
      <span data-active={lang === "en"}>EN</span>
    </Link>
  );

  return (
    <>
      <nav className="nav" aria-label={labels.home}>
        <div className="nav__bar" data-scrolled={scrolled}>
          <Brand label={labels.home} />

          <ul className="nav__links">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={link.id === activeId ? "true" : undefined}
                  aria-label={countLabel(link)}
                >
                  {link.label}
                  {link.id === "contact" && count > 0 && (
                    <span className="nav__count" aria-hidden="true">{count}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__tools">
            {langSwitch}
            <button type="button" className="nav__tool" onClick={toggleTheme} aria-label={labels.toggleTheme}>
              <ThemeIcon />
            </button>
            <button
              ref={menuRef}
              type="button"
              className="nav__menu-btn"
              data-count={count > 0}
              onClick={() => setOpen(true)}
              aria-label={count > 0 ? `${labels.menu} (${count} ${labels.selected})` : labels.menu}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="sheet" data-open={open} inert={!open}>
        <div className="sheet__head">
          <Brand label={labels.home} onClick={() => setOpen(false)} />
          <button type="button" className="nav__tool" onClick={closeSheet} aria-label={labels.close}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="sheet__links">
          {links.map((link, i) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={() => setOpen(false)} aria-label={countLabel(link)}>
                <span>
                  {link.label}
                  {link.id === "contact" && count > 0 && (
                    <span className="nav__count" aria-hidden="true">{count}</span>
                  )}
                </span>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="sheet__foot">
          <button
            type="button"
            className="btn btn--ember"
            onClick={() => {
              setOpen(false);
              openBooking();
            }}
          >
            {labels.cta}
          </button>
          <div className="sheet__foot-row">
            {langSwitch}
            <button type="button" className="nav__tool" onClick={toggleTheme} aria-label={labels.toggleTheme}>
              <ThemeIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
