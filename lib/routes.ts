import { services } from './data/services';
import { linkableProducts } from './data/products';

/** Every indexable route, used for the sitemap and link checks. */
export function indexablePaths(): { path: string; lastModified?: string }[] {
  const fixed = ['/', '/about', '/services', '/industries', '/approach', '/labz', '/careers', '/contact', '/products', '/privacy', '/terms'];
  return [
    ...fixed.map((path) => ({ path })),
    ...services.map((s) => ({ path: `/services/${s.slug}` })),
    ...linkableProducts.map((p) => ({ path: `/products/${p.slug}` })),
  ];
}
