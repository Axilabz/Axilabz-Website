'use client';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a conversion event when analytics is loaded and the visitor has not
 * declined. Safe to call anywhere: it is a no-op without consent or a GA ID.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
}
