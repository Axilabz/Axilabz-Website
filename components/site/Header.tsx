'use client';

import Link from '@/components/site/Link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Brand } from './Brand';
import { isGroup, mainNav, type NavGroup } from '@/lib/data/navigation';
import { track } from '@/lib/analytics';

/**
 * Global header. Dropdown triggers are real buttons (aria-expanded) that open on
 * click/tap and Enter/Space, close on Escape, outside click and focus loss, and
 * additionally open on hover for fine pointers. Top-level labels that have a
 * landing page are also reachable through the "All …" link inside each menu.
 */
/** In the compact (mobile) layout menus open on tap only. Hover would open a menu just before the click that toggles it shut. */
const isCompact = () => window.matchMedia('(max-width: 1040px)').matches;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeAll = useCallback(() => {
    setOpen(null);
    setMobile(false);
  }, []);

  // Close menus whenever the route changes (state adjusted during render, per React guidance).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  // Outside click / tap and Escape.
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (barRef.current && !barRef.current.contains(e.target as Node)) closeAll();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      const active = document.activeElement as HTMLElement | null;
      const wasInMenu = !!barRef.current?.contains(active);
      const trigger = open ? barRef.current?.querySelector<HTMLElement>(`[data-trigger="${open}"]`) : null;
      closeAll();
      if (wasInMenu) (trigger ?? toggleRef.current)?.focus();
    }
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, closeAll]);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobile]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  function onMenuKey(e: React.KeyboardEvent, group: NavGroup) {
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length]?.focus(); }
    if (e.key === 'Home') { e.preventDefault(); links[0]?.focus(); }
    if (e.key === 'End') { e.preventDefault(); links[links.length - 1]?.focus(); }
    void group;
  }

  return (
    <header className={`gh${mobile ? ' is-open' : ''}`}>
      <div className="gh-bar" ref={barRef}>
        <Brand priority />
        <nav id="primary-navigation" aria-label="Primary" className={mobile ? 'gh-nav is-open' : 'gh-nav'}>
          <ul>
            {mainNav.map((item) => {
              if (!isGroup(item)) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className="gh-link" aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</Link>
                  </li>
                );
              }
              const expanded = open === item.label;
              const panelId = `menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <li
                  key={item.label}
                  className="gh-item"
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse' && !isCompact()) setOpen(item.label); }}
                  onPointerLeave={(e) => { if (e.pointerType === 'mouse' && !isCompact()) setOpen((o) => (o === item.label ? null : o)); }}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen((o) => (o === item.label ? null : o)); }}
                >
                  <div className="gh-split">
                    <Link href={item.href} className="gh-link" aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</Link>
                    <button
                      type="button"
                      className="gh-link gh-trigger"
                      data-trigger={item.label}
                      aria-label={`${item.label} menu`}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : item.label)}
                    >
                      <ChevronDown size={14} aria-hidden="true" className="gh-chevron" />
                    </button>
                  </div>
                  <div id={panelId} className="gh-panel" hidden={!expanded} onKeyDown={(e) => onMenuKey(e, item)}>
                    {item.sections ? (
                      <div className="gh-sections">
                        {[item.sections.slice(0, 2), item.sections.slice(2)].map((col, ci) => (
                          <div key={ci} className="gh-col">
                        {col.map((sec) => (
                          <div key={sec.title} className="gh-section">
                            <p className="gh-section-title">{sec.title}</p>
                            <ul>
                              {sec.items.map((l) => (
                                <li key={l.href}>
                                  <Link href={l.href} aria-current={pathname === l.href ? 'page' : undefined}><span>{l.label}</span></Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className={item.items.length > 6 ? 'gh-panel-grid' : undefined}>
                        {item.items.map((l) => (
                          <li key={l.href}>
                            <Link href={l.href} aria-current={pathname === l.href ? 'page' : undefined}>
                              <span>{l.label}</span>
                              {l.description && <small>{l.description}</small>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.footer && (
                      <Link href={item.footer.href} className="gh-panel-all">
                        {item.footer.label} <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href="/contact" className="gh-cta" onClick={() => track('cta_click', { location: 'header', label: 'consultation' })}>
            Book a Free Strategy Call <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="gh-toggle"
          aria-label={mobile ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobile}
          aria-controls="primary-navigation"
          onClick={() => { setMobile((m) => !m); setOpen(null); }}
        >
          {mobile ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
