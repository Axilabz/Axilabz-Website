'use client';

import { useSyncExternalStore } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const KEY = 'axilabz-analytics-consent';
const EVENT = 'axilabz-consent-change';

type Choice = 'accepted' | 'declined' | 'unset';

function loadGa(id: string) {
  if (document.getElementById('ga-script')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
  const s = document.createElement('script');
  s.id = 'ga-script';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'declined' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/**
 * Consent-gated analytics. Nothing is loaded and no banner is shown unless a
 * Google Analytics measurement ID is configured (NEXT_PUBLIC_GA_ID); the script
 * is only fetched after the visitor accepts. The server snapshot is `null` so
 * the banner never renders during SSR and cannot cause a hydration mismatch.
 */
export function Analytics() {
  const choice = useSyncExternalStore<Choice | null>(subscribe, read, () => null);

  if (GA_ID && choice === 'accepted') loadGa(GA_ID);

  function decide(value: Choice) {
    try { localStorage.setItem(KEY, value); } catch { /* storage unavailable: choice lasts for this page only */ }
    window.dispatchEvent(new Event(EVENT));
    if (value === 'accepted' && GA_ID) loadGa(GA_ID);
  }

  if (!GA_ID || choice !== 'unset') return null;
  return (
    <div className="consent-banner" role="region" aria-label="Analytics preferences">
      <p>We would like to use analytics cookies to understand how the site is used. They are off unless you accept.</p>
      <div>
        <button type="button" className="button secondary" onClick={() => decide('declined')}>Decline</button>
        <button type="button" className="button primary" onClick={() => decide('accepted')}>Accept</button>
      </div>
    </div>
  );
}
