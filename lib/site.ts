/**
 * Central site configuration. Business facts live here so metadata, structured
 * data, the footer and the contact page cannot drift apart.
 *
 * Only publish contact details after the company has verified them: leave the
 * optional fields undefined and they are omitted everywhere (footer, JSON-LD).
 */
export const SITE = {
  name: 'Axilabz',
  /** Common alternative spellings searchers use; emitted as schema.org alternateName. */
  alternateNames: ['Axilabs'],
  tagline: 'Accelerating excellent innovations',
  description:
    'Axilabz is an AI engineering and software solutions company. We help businesses build intelligent applications, automate complex workflows and develop scalable software.',
  locale: 'en',
  /** Verified public contact details. Fill in once confirmed by the company. */
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'axilabzoffl@gmail.com',
    phone: '+91 6382266191' as string | undefined,
    /** Postal address; emitted as schema.org PostalAddress and shown in the footer and on /contact. */
    address: { addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', postalCode: '600130', addressCountry: 'IN' } as
      | { streetAddress?: string; addressLocality: string; addressRegion?: string; postalCode?: string; addressCountry: string }
      | undefined,
  },
  /** ISO year or date the company was founded, e.g. '2024'. Omitted from JSON-LD while undefined. */
  foundingDate: '2021' as string | undefined,
  /** Where job applications are sent (opens the visitor's mail app). Override with NEXT_PUBLIC_CAREERS_EMAIL. */
  careersEmail: process.env.NEXT_PUBLIC_CAREERS_EMAIL || 'axilabzoffl@gmail.com',
  /** Verified social profile URLs (used for Organization.sameAs). */
  social: ['https://www.instagram.com/axilabz/'] as string[],
} as const;

/** One-line address for display, or undefined when no address is configured. */
export function formatAddress(): string | undefined {
  const a = SITE.contact.address;
  if (!a) return undefined;
  const country = new Intl.DisplayNames(['en'], { type: 'region' }).of(a.addressCountry) ?? a.addressCountry;
  const line = [a.streetAddress, a.addressLocality, a.addressRegion, country].filter(Boolean).join(', ');
  return a.postalCode ? `${line} - ${a.postalCode}` : line;
}

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
