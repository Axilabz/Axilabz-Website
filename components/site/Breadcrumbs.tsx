import Link from '@/components/site/Link';
import { JsonLd } from './JsonLd';
import { breadcrumbLd } from '@/lib/seo';

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all: Crumb[] = [{ name: 'Home', href: '/' }, ...trail];
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {all.map((c, i) => (
            <li key={c.href}>
              {i === all.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.href}>{c.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}
