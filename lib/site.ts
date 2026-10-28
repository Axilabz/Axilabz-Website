/**
 * Central site configuration. Business facts live here so metadata, structured
 * data, the footer and the contact page cannot drift apart.
 *
 * Only publish contact details after the company has verified them: leave the
 * optional fields undefined and they are omitted everywhere (footer, JSON-LD).
 */
export const SITE = {
  name: 'Axilabz',
  tagline: 'Accelerating excellent innovations',
  description:
    'Axilabz is an AI engineering and software solutions company. We help businesses build intelligent applications, automate complex workflows and develop scalable software.',
  locale: 'en',
  /** Verified public contact details. Fill in once confirmed by the company. */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
    phone: undefined as string | undefined,
    address: undefined as string | undefined,
  },
  /** Where job applications are sent (opens the visitor's mail app). Override with NEXT_PUBLIC_CAREERS_EMAIL. */
  careersEmail: process.env.NEXT_PUBLIC_CAREERS_EMAIL || 'axilabzoff@gmail.com',
  /** Verified social profile URLs (used for Organization.sameAs). */
  social: [] as string[],
} as const;

/**
 * Production origin, e.g. https://www.example.com. Supplied by configuration,
 * never invented. When unset, absolute URLs (sitemap, canonical origin) are not
 * emitted rather than guessed.
 */
export function siteOrigin(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

/** Absolute URL for a path when the origin is configured, else the path. */
export function absoluteUrl(path: string): string {
  const origin = siteOrigin();
  const clean = path.startsWith('/') ? path : `/${path}`;
  return origin ? `${origin}${clean}` : clean;
}
