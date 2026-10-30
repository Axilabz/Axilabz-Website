import { services, serviceGroups, serviceBySlug } from './services';
import { industries } from './industries';

export type NavLink = { label: string; href: string; description?: string };
export type NavSection = { title: string; items: NavLink[] };
export type NavGroup = { label: string; href: string; items: NavLink[]; sections?: NavSection[]; footer?: NavLink };

export const mainNav: (NavGroup | NavLink)[] = [
  {
    label: 'Services',
    href: '/services',
    items: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
    sections: serviceGroups.map((g) => ({
      title: g.title,
      items: g.services.flatMap((slug) => { const s = serviceBySlug(slug); return s ? [{ label: s.name, href: `/services/${s.slug}` }] : []; }),
    })),
    footer: { label: 'All services', href: '/services' },
  },
  { label: 'Products', href: '/products' },
  {
    label: 'Industries',
    href: '/industries',
    items: industries.map((i) => ({ label: i.name, href: `/industries#${i.slug}` })),
    footer: { label: 'All industries', href: '/industries' },
  },
  { label: 'Our Approach', href: '/approach' },
  { label: 'Labz', href: '/labz' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
];

export const isGroup = (n: NavGroup | NavLink): n is NavGroup => 'items' in n;

export const footerNav = {
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Our Approach', href: '/approach' },
    { label: 'Labz', href: '/labz' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Products: [
    { label: 'AxiDoc', href: '/products/axidoc' },
    { label: 'AxiCore', href: '/products/axicore' },
    { label: 'AxiData', href: '/products/axidata' },
    { label: 'All products', href: '/products' },
  ],
  Services: services.slice(0, 6).map((s) => ({ label: s.name, href: `/services/${s.slug}` })).concat([{ label: 'All services', href: '/services' }]),
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
};
