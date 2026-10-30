import { siteOrigin } from '../../lib/site';

/** Allows crawling of public pages, excludes the API, and points to the sitemap when the origin is configured. */
export function GET() {
  const origin = siteOrigin();
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /api/'];
  if (origin) lines.push('', `Sitemap: ${origin}/sitemap.xml`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
