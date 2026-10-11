# Silexio — Portfolio

The bilingual (FR/EN) site of [Silexio](https://silexio.be), a one-person software studio in
Hainaut, Belgium. Twelve statically prerendered pages, a self-hosted booking flow with no
third-party scheduler, and a deliberately small amount of JavaScript.

It is a marketing site, so the interesting parts are not the features — they are the constraints:
no animation library, no analytics, no component library, a hand-written CSS design system, and a
smoke test that exercises the real production runtime because `lint`, `test` and `build` once went
green while the live site served 404 on every page.

## Stack

| Layer           | Tech                                                             |
| --------------- | ---------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)                               |
| UI              | React 19, TypeScript 6 strict                                    |
| Styles          | Hand-written BEM design system; Tailwind CSS 4 for its preflight |
| Animation       | CSS keyframes only — no animation library                        |
| Validation      | Zod 4 at every HTTP boundary                                     |
| Hosting         | Cloudflare Workers via OpenNext                                  |
| Database        | Cloudflare D1 (SQLite)                                           |
| Email           | Brevo HTTP API                                                   |
| Video calls     | kMeet (Infomaniak)                                               |
| Error tracking  | Bugsink, self-hosted (Sentry protocol)                           |
| Tests           | Vitest (unit) + Playwright (e2e)                                 |
| Package manager | pnpm                                                             |

## Getting started

```bash
pnpm install     # also generates the Cloudflare binding types
pnpm db:migrate  # applies migrations/ to the local D1 database
pnpm dev         # http://localhost:3000 → redirects to /fr
```

Copy `.env.example` to `.env` and fill it in — the booking flow needs Turnstile, Brevo and two
HMAC secrets. The Turnstile test keys shipped in the example work as-is for local development.

```bash
pnpm lint        # eslint, zero warnings tolerated
pnpm tsc --noEmit
pnpm test        # vitest — 209 unit tests across 26 files
pnpm test:e2e    # playwright — 48 tests, chromium + iPhone 13 (PORT=3101 to avoid a busy 3000)
pnpm build       # next build — the 12 content pages must stay ● (SSG)
pnpm preview     # build for Workers and run it locally in workerd
pnpm smoke       # build for Workers and assert what the Worker actually serves
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
├── [lang]/                 # fr | en — the only route segment, SSG, dynamicParams = false
│   ├── layout.tsx          # fonts, metadata + hreflang, JSON-LD, theme bootstrap
│   ├── page.tsx            # section assembly
│   ├── [service]/          # four dedicated pages, slug localised per language
│   ├── legal/              # legal notice and privacy
│   └── booking/[action]/   # owner confirm/decline page (two-step, noindex)
├── api/                    # availability, bookings, leads (the only dynamic routes)
├── monitoring/             # same-origin relay for browser error envelopes
├── global-error.tsx        # root error boundary, reports to Bugsink
├── globals.css             # 18 numbered sections: tokens, base, layout, actions, components
└── robots.ts · sitemap.ts · manifest.ts
components/
├── layout/                 # SiteShell, Nav, Footer
├── sections/               # Hero, Solutions, Work, Offers, About, Faq, Contact, LeadForm…
├── ui/                     # Btn, Reveal, Carousel, OfferLadder, BookingCalendar, Turnstile…
└── art/                    # one file per illustration + shared.tsx for the primitives
lib/
├── booking/                # slots, schema, token, ics, ical, email, record, db, mailer
├── leads/                  # constants, schema, email
├── observability/          # report (pure), client, server, dsn
├── i18n/                   # locale config + t() resolver
├── data.ts                 # all bilingual UI content, typed
├── services.ts             # the dedicated pages
└── legal.ts                # the legal page
migrations/                 # D1 schema, applied with wrangler
```

### Why `pnpm smoke` exists

On 2026-10-10, `pnpm lint`, `pnpm test` and `pnpm build` were all green while **the entire site
returned 404 in production**. Those three commands check the code and Next's output; none of them
checks what the Worker actually serves. The cause was an incompatibility between Next and
`@opennextjs/cloudflare`: prerendered pages stopped being served and every route fell through to
`NoFallbackError`.

`pnpm smoke` builds the OpenNext output, serves it in **workerd**, and reads back what the Worker
returns: every page listed by the site's own sitemap, `/robots.txt`, `/sitemap.xml`,
`/api/availability`, the presence of an `<h1>`, the absence of an empty Turnstile site key in the
served HTML, and the absence of `NoFallbackError` in the runtime log. It runs in CI too.

### Booking flow

Cal.com was replaced by a native flow, so the site depends on no external scheduler.

1. A visitor opens the booking modal; `GET /api/availability` returns the free 30-minute slots
   (Mon–Fri, 9am–5pm Europe/Brussels, three weeks ahead), crossing the D1 table with the studio's
   published iCalendar feeds.
2. `POST /api/bookings` validates the payload (Zod), the Turnstile token and an hourly per-IP
   quota, then inserts the booking. The IP is only ever stored as an HMAC, and an IPv6 address is
   reduced to its /64 prefix first so one subscriber cannot walk around the quota.
3. The owner gets an email with HMAC-signed confirm/decline links, landing on a two-step page so
   no mail client can trigger the action by prefetching.
4. Confirming generates a kMeet room, emails both parties and attaches an `.ics` invite carrying
   the meeting link.

Three rules hold the flow together:

- **Business logic stays pure.** Everything in `lib/booking/` except `db.ts`, `mailer.ts`,
  `turnstile.ts` and `actions.ts` is side-effect free and unit-tested: slot generation across DST,
  Zod schemas, HMAC tokens, ICS building, RFC 5545 recurrence expansion, email templating, row
  mapping, rate-limit key derivation.
- **The database rejects double bookings, not the code.** A partial unique index on
  `Booking(slotStart) WHERE status IN ('pending','confirmed')` is the single source of truth:
  insert and handle the rejection, never check-then-insert. Declining a booking frees the slot.
- **Calendar sync fails open.** If the iCalendar feed is unreachable, slow or unparseable, no busy
  range is returned and every slot stays bookable. Failing closed would block all bookings on a
  third-party outage, while the worst case here is one request to decline.

### Design notes

- **No animation library.** Every movement is a CSS keyframe. The only client script is an inline
  bootstrap written in TypeScript (`lib/boot.ts`) and serialised with `toString()` — so the
  compiler and the linter actually read it, which is how a typo that silently killed half of it
  got caught. It is 3 491 bytes raw / 1 409 gzipped. Motion alone would have been ~74 Kb.
- **Motion is opt-in, not opt-out.** Animations are declared *inside*
  `@media (prefers-reduced-motion: no-preference)`, so a new animation can never leave a block
  invisible for someone who asked for less movement.
- **Reveals ship no JavaScript.** `Reveal` is a Server Component that emits a `data-reveal` div;
  the hidden state is CSS and the bootstrap script sets `data-in`. Without JS the attribute is
  never written and the content simply stays visible.
- **A hand-written error reporter instead of the Sentry browser SDK.** `@sentry/nextjs` costs
  ~74 Kb transferred, about 30 % of the page's JavaScript. `lib/observability/report.ts` builds a
  Sentry v7 envelope in ~1 Kb: type, message, parsed stack (V8 and SpiderMonkey dialects),
  deduplication, and a cap of 8 events per page. The trade is real and deliberate — stacks arrive
  minified. The server still uses the official SDK.
- **i18n by route.** `/fr` and `/en` are prerendered separately with `hreflang` alternates and a
  bilingual sitemap. `t()` resolves in Server Components only; no dictionary ships to the client.
- **Theme** — light/dark via a `data-theme` attribute set by the inline script before first paint,
  persisted in `localStorage`, swapped inside `document.startViewTransition`. No React state.
- **No frosted glass, no brand colour.** Header, menu and modal use opaque theme-derived
  backgrounds. The palette is warm stone by day and warm graphite by night, and exactly one thing
  lights up: a 3 px struck edge on the primary button.
- **Security headers** in `next.config.ts`: CSP, HSTS, frame-ancestors none. `connect-src` stays
  `'self'`, which is why browser error envelopes are relayed through `app/monitoring/route.ts`
  rather than posted straight to the Bugsink host.

### Measured, not claimed

Production build served in workerd, Chromium throttled to 1.6 Mbps / 150 ms RTT / CPU ×4, mobile
412 px, median of 5 passes, on 2026-10-11:

| | |
| --- | --- |
| FCP | 912 ms |
| LCP | 912 ms |
| CLS | 0.000 |

First visit to `https://silexio.be/fr`, 17 requests, 330 Kb transferred: 155 Kb JavaScript,
77 Kb images, 54 Kb fonts, 31 Kb HTML (brotli), 13 Kb CSS.

Lighthouse scores are deliberately not quoted here: on a machine under load its mobile TBT varies
by an order of magnitude, so any number would be unreproducible. Run it yourself at idle with
`npx lighthouse https://silexio.be/fr --preset=desktop`, median of 3 passes.

## Licence

MIT — see [LICENSE](LICENSE).
