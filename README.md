# Axilabz website

Multi-page AI engineering and software solutions website. React 19, TypeScript, Vinext (Next.js App Router on Vite), Cloudflare Workers and D1 (Drizzle ORM). Brand artwork is the supplied A / X / I / Labz design, unchanged.

## Commands

```
pnpm install            # supported workflow; or scripts/install-pnpm.sh in Sites
pnpm dev                # local dev server with HMR
pnpm build              # production Worker + client bundles (dist/)
pnpm start              # run the built Worker locally on http://127.0.0.1:8787 (wrangler + local D1)
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint
pnpm test               # contact API/validation tests (node:test)
BASE=http://127.0.0.1:8787 pnpm check:links   # crawl: status, metadata, h1, links, assets, JSON-LD
pnpm assets:build       # regenerate optimised copies of the supplied artwork
pnpm db:generate        # after editing db/schema.ts; never edit applied migrations
```

If `pnpm` is not installed: `npx pnpm@11.25.0 <command>`.

Initialise the local database once after the first build (apply each migration once per database; Sites applies hosted migrations on deploy):

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_faithful_quentin_quire.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_enquiry_routing.sql
```

## Environment

See `.env.example`. Public values are inlined at build time; secrets are Worker secrets only.

| Variable | Kind | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Verified production origin. Drives canonicals, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`. If unset, the sitemap returns 404 so no guessed or preview URLs are published. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public, optional | Verified contact email shown in footer/privacy/JSON-LD. |
| `NEXT_PUBLIC_CAREERS_EMAIL` | public, optional | Where the careers page "Apply" button sends mail. Defaults to `axilabzoffl@gmail.com`. |
| `NEXT_PUBLIC_GA_ID` | public, optional | GA4 ID. Script loads only after the visitor accepts the consent banner. |
| `RESEND_API_KEY`, `CONTACT_FROM` | secret | Transactional email for new enquiries (Resend). Without both, enquiries are stored with `notify_status = 'skipped'`. |
| `CONTACT_NOTIFY_TO` | optional | Recipient inbox(es). Defaults to `axilabzoffl@gmail.com`. |
| `CONTACT_HASH_SALT` | secret | Salt for the IP hash used by rate limiting. |

## Structure

```
app/                     routes (App Router): /, /about, /services[/slug], /products[/slug], /industries,
                         /approach, /labz, /careers, /contact, /privacy, /terms, 404,
                         /sitemap.xml, /robots.txt, /api/contact
app/globals.css          original design tokens and base styles
app/chapters.css         Labz chapter and capability-strip styles
app/sections.css         A / X / I section layout
app/site.css             multi-page system built on the same tokens (header, hero, cards, diagrams, forms)
app/moodboard.css        moodboard layer, loaded last so it wins overrides (also grouped menus, careers)
app/demo.css             styles for the animated demo graphics
components/site/         Header (accessible, grouped dropdowns), Footer, Brand, PageLoader, Breadcrumbs, JsonLd,
                         cards, ui, Analytics, FloatingConsult, HashScroll
components/home/         A / X / I / Labz brand chapters
components/demo/         self-running demo graphics (AxiDoc, AxiCore, AxiData, Our Approach); useLoop.ts is the
                         shared playhead
components/diagrams/     workflow diagram and the labelled product mockup
components/contact/      ContactForm
lib/data/                services (with serviceGroups), products, industries, navigation (single source of truth)
lib/seo.ts, lib/site.ts  metadata builders, JSON-LD builders, site config (including the careers email)
lib/contact/             validate.ts (shared client+server), handler.ts (testable), email.ts
db/, drizzle/            D1 schema and migrations (0001 adds routing columns + indexes)
public/brand, public/art optimised derivatives of the supplied artwork
assets-source/           supplied originals used by the asset scripts
scripts/                 build-*.mjs (assets), check-site.mjs (crawl); everything else is Sites platform tooling
tests/                   contact workflow tests
```

`scripts/` (other than the `build-*` and `check-site` files), `worker/`, `vendor/`, `lib/connector*`, `components/connector-error.tsx`, `components/ui/button.tsx`, `.openai/` and `pnpm-workspace.yaml` belong to the Sites hosting platform. Leave them in place.

Add a service, product or industry by adding one entry to the matching file in `lib/data/`; the pages, navigation, sitemap, JSON-LD and internal links follow. A service must also be listed in a group in `serviceGroups` (`lib/data/services.ts`) to appear in the menu and on /services. A product card image lives at `public/art/product-<art>.webp` (+ `-2x`, `-4x`).

## Brand and artwork

- Logo: the supplied lockup (mark, wordmark, tagline) from `assets-source/axilabz-full-logo.png`, exported to `public/brand/` by `pnpm assets:build`.
- A / X / I / Labz graphics: the supplied high-resolution designs in `assets-source/design/hq-*.webp`. Text, icons and cards are part of the images; headings, copy, buttons and feature bars are live HTML. `node scripts/build-art.mjs` writes 1x and native 2x WebP (soft edge fade baked into alpha) to `public/art/`, and the page serves them with `srcSet`.
- AxiData card art: `assets-source/product-data.webp`, sized by `node scripts/build-data-art.mjs`.
- Footer logo (`public/brand/axilabz-logo-light.png`): transparent with a white wordmark, generated by `pnpm assets:build`.
- Product illustrations (AxiVoice / AxiDoc / AxiCore / AxiSolve): crops of `assets-source/legacy/labz-reference.png`, AI-upscaled 4x with Real-ESRGAN (`scripts/build-section-art.mjs`).
- Fonts (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono, Instrument Serif; latin subset, OFL) are self-hosted in `public/fonts` and preloaded.
- `next.config.ts` sets `htmlLimitedBots: /.*/` so page metadata is always in `<head>`, including on dynamic routes.
- Tokens follow the Axilabz moodboard (Midnight, Paper, Cobalt, Amber) layered on the original tokens in `app/globals.css`.

## Contact enquiries

`POST /api/contact`: same-origin JSON, shared validation, honeypot and minimum-fill-time trap, per-IP (5/h) and per-email (3/h) rate limits backed by D1, client-generated submission ID for idempotent retries, durable insert **before** any success response, then email notification (6 s timeout). A notification failure never loses or fakes the enquiry: it is stored with `notify_status` of `sent`, `failed` or `skipped`. Logs contain event names only, no personal data. The `enquiries` table is not reachable from any route.

Review unnotified enquiries (requires Cloudflare access):

```
wrangler d1 execute DB --remote --command "select id, created_at, interest, notify_status from enquiries where notify_status != 'sent' order by created_at desc"
```

Also add a Cloudflare WAF/rate-limiting rule for `/api/contact` and consider Turnstile before significant traffic.

## Content honesty

- The previous unverified 3×, 40%, 3+ and 10+ claims were removed.
- Products are presented as enquiry pathways with status labels (`available`, `in-development`, `demonstration`, `planned`, `enquiry`). Everything is `enquiry` until the company confirms; update `lib/data/products.ts`.
- Product interface previews are labelled as illustrative mockups.
- Articles are credited to "Axilabz Engineering" (organisation). Add `Person` authors only for real people.
- Privacy Policy and Terms of Use are plain-language drafts and need legal review.
