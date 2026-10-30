import { indexablePaths } from '../../lib/routes';
import { siteOrigin } from '../../lib/site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * XML sitemap built from the same route list the site renders. It is only
 * served when the production origin is configured (NEXT_PUBLIC_SITE_URL), so
 * preview, staging or localhost URLs are never published by accident.
 */
export function GET() {
  const origin = siteOrigin();
  if (!origin) return new Response('Sitemap unavailable: NEXT_PUBLIC_SITE_URL is not configured.', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  const urls = indexablePaths()
    .map(({ path, lastModified }) => `  <url><loc>${esc(origin + (path === '/' ? '/' : path))}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}</url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
