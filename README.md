# Silexio — Portfolio

One-page portfolio for [Silexio](https://silexio.be), an independent full-stack engineering studio based in Belgium. Bilingual (FR/EN), static pages, scoring a perfect 100 on Lighthouse SEO, accessibility and best practices, with a cross-browser liquid-glass UI — plus a self-hosted booking flow with no third-party scheduler.

## Stack

| Layer           | Tech                                                          |
| --------------- | ------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)                            |
| UI              | React 19, TypeScript strict                                   |
| Styles          | Tailwind CSS 4 (CSS-first) + hand-written OKLCH design system |
| Animations      | Motion + CSS scroll-driven animations                         |
| Hosting         | Cloudflare Workers via OpenNext                               |
| Database        | Cloudflare D1 (SQLite)                                        |
| Email           | Brevo HTTP API                                                |
| Video calls     | kMeet (Infomaniak)                                            |
| Error tracking  | Bugsink, self-hosted (Sentry protocol)                        |
| Tests           | Vitest (unit) + Playwright (e2e)                              |
| Package manager | pnpm                                                          |

## Getting started

```bash
pnpm install     # also generates the Cloudflare binding types
pnpm db:migrate  # applies migrations/ to the local D1 database
pnpm dev         # http://localhost:3000 → redirects to /fr
```

Copy `.env.example` to `.env` and fill it in — the booking flow needs Turnstile, Brevo and two HMAC secrets. The Turnstile test keys shipped in the example work as-is for local development.

```bash
pnpm lint        # eslint, zero warnings tolerated
pnpm test        # vitest unit tests
pnpm test:e2e    # playwright (chromium + mobile), starts the dev server
pnpm build       # next build — /fr and /en stay static
pnpm preview     # build for Workers and run it locally in workerd
pnpm deploy      # build and deploy to Cloudflare
```

Deploying for the first time also needs the remote database and the production secrets:

```bash
pnpm db:migrate:remote
wrangler secret put BREVO_API_KEY        # and TURNSTILE_SECRET_KEY,
                                         # BOOKING_ACTION_SECRET, IP_HASH_SECRET…
```

## Architecture

```text
app/
├── [lang]/                 # fr | en — static via generateStaticParams
│   ├── layout.tsx          # fonts, metadata + hreflang, JSON-LD, theme bootstrap
│   ├── page.tsx            # section assembly
│   └── booking/[action]/   # owner confirm/decline page (two-step, noindex)
├── api/                    # availability + booking endpoints (dynamic)
├── global-error.tsx        # root error boundary, reports to Bugsink
├── globals.css             # design tokens (OKLCH) + component styles
└── robots.ts · sitemap.ts · manifest.ts
components/
├── layout/                 # Nav, ChapterMarkers, Footer
├── sections/               # Hero, Packages, Process, Work, Stack, Contact, Booking
└── ui/                     # Reveal, HeroLines, Btn, Chip, BookingCalendar, Turnstile…
hooks/                      # useActiveSection, usePackages, useBookingModal
lib/
├── booking/                # slots, schema, token, ics, email, record, db, mailer
├── i18n/                   # locales config + t() resolver
├── data.ts                 # all bilingual content, typed
└── github.ts               # repo stats fetched at build time (daily revalidation)
migrations/                 # D1 schema, applied with wrangler
```

### Booking flow

Cal.com was replaced by a native flow, so the site depends on no external scheduler.

1. A visitor opens the booking modal, `GET /api/availability` returns the free 30-minute slots (Mon–Fri, 8am–4pm Europe/Brussels, three weeks ahead).
2. `POST /api/bookings` validates the payload (Zod), the Turnstile token and an hourly per-IP quota, then inserts the booking. The IP is only ever stored as an HMAC.
3. The owner gets an email with HMAC-signed confirm/decline links, landing on a two-step page so no mail client can trigger the action by prefetching.
4. Confirming generates a kMeet room, emails both parties and attaches an `.ics` invite carrying the meeting link.

Two design rules hold the flow together:

- **Business logic stays pure.** Everything in `lib/booking/` except `db.ts`, `mailer.ts`, `turnstile.ts` and `actions.ts` is side-effect free and unit-tested — slot generation across DST, Zod schema, HMAC tokens, ICS building, email templating, row mapping.
- **The database rejects double bookings, not the code.** A partial unique index on `Booking(slotStart) WHERE status IN ('pending','confirmed')` is the single source of truth: insert and handle the rejection, never check-then-insert. Declining a booking frees the slot.

### Design notes

- **Package picker** — the services section presents six selectable offerings (showcase site, web app, API & backend, infrastructure, automation, IT support). The selection pre-fills both the booking form and the contact email, so a prospect's needs arrive with their message. It is kept in memory only (a `useSyncExternalStore` store, no provider): a new visit starts from a clean slate rather than a stale cart.
- **Live GitHub data** — project rows show star counts fetched from the GitHub API at build time (revalidated daily), with a silent fallback when the API is unreachable.
- **i18n by route** — `/fr` and `/en` are prerendered separately with `hreflang` alternates and a bilingual sitemap. Translations resolve in Server Components only; no dictionary ships to the client.
- **Theme** — light/dark via a `data-theme` attribute set by an inline script before first paint (no flash), persisted in `localStorage`, animated with the View Transitions API.
- **Liquid glass** — the floating navbar and the mobile sheet share one glass language: transparent `color-mix` background, `backdrop-filter` blur + saturation, and a specular `::before` highlight. Pure CSS, so it renders identically across Chrome, Safari and Firefox.
- **Animations** — the hero headline reveals via CSS (server-rendered, so the LCP text paints without waiting for hydration); below-the-fold reveals use Motion (`whileInView`, `useScroll` for the pinned scrollytelling). Purely decorative motion (hero shard, scroll progress, marquee) stays in CSS with `animation-timeline` behind `@supports`. Everything honors `prefers-reduced-motion`.
- **Error tracking** — `@sentry/nextjs` reporting to a self-hosted Bugsink instance, inert until a DSN is set. Errors only (Bugsink ingests no traces), no PII, and client events are tunnelled same-origin so the CSP stays `connect-src 'self'`.
- **Performance** — no runtime data fetching on the marketing pages, self-hosted fonts via `next/font`, static HTML served from Cloudflare's edge, strict security headers (CSP, HSTS) in `next.config.ts`.
