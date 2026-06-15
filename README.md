# Silexio — Portfolio

One-page portfolio for [Silexio](https://silexio.be), an independent full-stack engineering studio based in Belgium. Fully static, bilingual (FR/EN), scoring a perfect 100 on Lighthouse SEO, accessibility and best practices, with a cross-browser liquid-glass UI.

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript strict |
| Styles | Tailwind CSS 4 (CSS-first) + hand-written OKLCH design system |
| Animations | Motion + CSS scroll-driven animations |
| Tests | Vitest |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000 → redirects to /fr
```

```bash
pnpm build      # production build (all routes prerendered)
pnpm start      # serve the production build
pnpm lint       # eslint
pnpm test       # vitest unit tests
```

## Architecture

```text
app/
├── [lang]/            # fr | en — fully static via generateStaticParams
│   ├── layout.tsx     # fonts, metadata + hreflang, JSON-LD, theme bootstrap
│   └── page.tsx       # section assembly
├── globals.css        # design tokens (OKLCH) + component styles
├── robots.ts · sitemap.ts · manifest.ts
└── fonts/             # Luciole (self-hosted, low-vision-friendly body font)
components/
├── layout/            # Nav, ChapterMarkers, Footer
├── sections/          # Hero, Services, Process, Work, Stack, Contact
└── ui/                # Reveal, HeroLines, Btn, Chip, SectionHead, Neurons…
hooks/                 # useActiveSection (IntersectionObserver)
lib/
├── i18n/              # locales config + t() resolver (+ tests)
├── data.ts            # all bilingual content, typed
├── github.ts          # repo stats fetched at build time (daily revalidation)
└── metadata.ts        # BASE_URL
```

### Design notes

- **Package picker** — the services section presents six selectable offerings (showcase site, web app, API & backend, infrastructure, automation, IT support). The visitor builds a selection that persists in `localStorage` and pre-fills both the cal.com booking notes and the contact email, so a prospect's needs arrive with their message. Selections are stored as ids and resolved per language, so switching locale relabels them. State lives in a `useSyncExternalStore` store, no provider.
- **Live GitHub data** — project rows show star counts fetched from the GitHub API at build time (revalidated daily), with a silent fallback when the API is unreachable.

- **i18n by route** — `/fr` and `/en` are prerendered separately with `hreflang` alternates and a bilingual sitemap. Translations resolve in Server Components only; no dictionary ships to the client.
- **Theme** — light/dark via a `data-theme` attribute set by an inline script before first paint (no flash), persisted in `localStorage`, animated with the View Transitions API.
- **Liquid glass** — the floating navbar and the mobile sheet share one glass language: transparent `color-mix` background, `backdrop-filter` blur + saturation, and a specular `::before` highlight. Pure CSS, so it renders identically across Chrome, Safari and Firefox.
- **Animations** — the hero headline reveals via CSS (server-rendered, so the LCP text paints without waiting for hydration); below-the-fold reveals use Motion (`whileInView`, `useScroll` for the pinned scrollytelling). Purely decorative motion (hero shard, scroll progress, marquee) stays in CSS with `animation-timeline` behind `@supports`. Everything honors `prefers-reduced-motion`.
- **Performance** — zero runtime data fetching, self-hosted fonts via `next/font`, static HTML served from the edge, strict security headers (CSP, HSTS) in `next.config.ts`.
