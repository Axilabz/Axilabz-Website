import type { Metadata } from 'next';
import { SITE, absoluteUrl, siteOrigin } from './site';
import type { Service } from './data/services';
import type { Product } from './data/products';

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Set false for routes that must not be indexed. */
  index?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  /** Use the title as-is, without the " | Axilabz" suffix (e.g. a brand-first homepage title). */
  absoluteTitle?: boolean;
};

/**
 * Builds unique per-page metadata. The root layout appends " | Axilabz" via the
 * title template, so pass the bare page title here.
 */
export function pageMetadata({ title, description, path, index = true, type = 'website', publishedTime, absoluteTitle = false }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type,
      locale: 'en',
      ...(publishedTime ? { publishedTime } : {}),
      images: [{ url: absoluteUrl('/art/section-a-2x.webp'), width: 2000, height: 1167, alt: 'Axilabz — AI engineering and software solutions' }],
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [absoluteUrl('/art/section-a-2x.webp')] },
  };
}

const orgId = () => absoluteUrl('/#organization');

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(),
    name: SITE.name,
    alternateName: SITE.alternateNames,
    slogan: SITE.tagline,
    description: SITE.description,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/axilabz-logo.png'),
    ...(SITE.foundingDate ? { foundingDate: SITE.foundingDate } : {}),
    ...(SITE.contact.address ? { address: { '@type': 'PostalAddress', ...SITE.contact.address } } : {}),
    ...(SITE.contact.email ? { email: SITE.contact.email } : {}),
    ...(SITE.contact.phone ? { telephone: SITE.contact.phone } : {}),
    ...(SITE.contact.email || SITE.contact.phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            ...(SITE.contact.email ? { email: SITE.contact.email } : {}),
            ...(SITE.contact.phone ? { telephone: SITE.contact.phone } : {}),
            availableLanguage: 'English',
            url: absoluteUrl('/contact'),
          },
        }
      : {}),
    ...(SITE.social.length ? { sameAs: SITE.social } : {}),
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE.name,
    alternateName: SITE.alternateNames,
    url: absoluteUrl('/'),
    publisher: { '@id': orgId() },
    inLanguage: 'en',
  };
}

export function breadcrumbLd(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.href) })),
  };
}

export function serviceLd(s: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.metaDescription,
    url: absoluteUrl(`/services/${s.slug}`),
    serviceType: s.name,
    provider: { '@id': orgId() },
  };
}

/** Products are enquiry pathways; no price, rating or availability is asserted. */
export function productLd(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: p.name,
    description: p.metaDescription,
    url: absoluteUrl(`/products/${p.slug}`),
    applicationCategory: 'BusinessApplication',
    publisher: { '@id': orgId() },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export { siteOrigin };
