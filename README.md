# Axilabz

Responsive AI products and services website. React 19, TypeScript, Vinext/Vite, Cloudflare Workers, and D1. No API keys required.

## Develop

Install dependencies using the Sites installation workflow (or `pnpm install` for standalone development), then run `pnpm dev`. `pnpm build` creates the Worker and client bundles. `npx tsc --noEmit` checks TypeScript.

For the managed Sites environment, use `sites-preview start /workspace/sites/axilabz`.

## Structure

- `app/page.tsx`: typed product data, reusable product cards/artwork, accessible product dialogs, mobile navigation, contact form, page composition.
- `app/globals.css`: shared tokens and responsive styling; reduced-motion support.
- `app/api/contact/route.ts`: same-origin JSON submission with server validation and durable storage.
- `db/schema.ts` and `drizzle/`: D1 enquiry schema and versioned migrations.

## Contact enquiries

The form stores enquiries in the private D1 `enquiries` table; it does not send email. Inspect records using the site's database tools. Never expose this table through an unauthenticated route. The form includes consent, a honeypot, client/server validation, loading, success, and retry states. Before changing to a public audience, configure abuse controls suitable for expected traffic and a monitored response workflow.

To initialize the local database, build once, then run:

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_faithful_quentin_quire.sql
```

Only apply each migration once per database. Sites applies hosted migrations during deployment. Changes to schema require `pnpm db:generate`; preserve previously applied migrations.

## Content and positioning

AxiVoice, AxiDoc, and AxiCore are product enquiry pathways, without unsupported claims of availability. AxiSolve is a custom-solution consultation pathway. Product dialogs route to the form with the relevant topic selected. The design’s supplied 3×, 40%, 3+, and 10+ figures are reproduced as provided; they have not been independently verified.

## Verification

TypeScript and production build checked. Browser QA: desktop, 390px mobile and 768px tablet, product dialog/enquiry routing, mobile menu open/close, empty-form validation, successful local database submission. Temporary QA page removed from production. Source and runtime configuration are tracked through Sites.
