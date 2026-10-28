'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Small client-side helpers mounted once in the root layout:
 *  - scrolls to #fragment targets (see below)
 *  - ignores the benign AbortError raised when a tap on a link is superseded by another tap/navigation
 *    (otherwise the dev overlay shows "signal is aborted without reason")
 *
 * Scrolls to #fragment targets. Needed because the framework does not reliably
 * scroll to an element after a route change or on first load with a hash.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    const timers = [setTimeout(go, 60), setTimeout(go, 400)];
    // Client-side Link navigation to a hash on the same page uses pushState (no hashchange event).
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (a && a.pathname === window.location.pathname) setTimeout(go, 80);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('hashchange', go);
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', go);
    };
  }, [pathname]);

  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as { name?: string; message?: string } | undefined;
      if (r?.name === 'AbortError' || /aborted without reason|superseded/i.test(String(r?.message ?? r))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    // The same abort can also surface as an uncaught error (thrown inside a transition).
    const onError = (e: ErrorEvent) => {
      const r = e.error as { name?: string; message?: string } | undefined;
      if (r?.name === 'AbortError' || /aborted without reason|superseded/i.test(String(r?.message ?? e.message))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('unhandledrejection', onRejection, true);
    window.addEventListener('error', onError, true);
    return () => {
      window.removeEventListener('unhandledrejection', onRejection, true);
      window.removeEventListener('error', onError, true);
    };
  }, []);

  return null;
}
