'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const subscribeMotion = (cb: () => void) => {
  const q = window.matchMedia('(prefers-reduced-motion: reduce)');
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
};

/**
 * Playhead for self-running demo graphics. Counts up in milliseconds, holds on the last frame for `hold`
 * ms, then starts over. It only runs while the element is on screen (and the tab is visible), and shows a
 * single still frame (`still`) when the visitor prefers reduced motion.
 */
export function useLoop(duration: number, hold: number, still: number) {
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false);
  const [t, setT] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - prev, 100);
      prev = now;
      setT((cur) => { const n = cur + dt; return n >= duration + hold ? 0 : n; });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, visible, duration, hold]);

  return { ref, t: reduced ? still : Math.min(t, duration) };
}
