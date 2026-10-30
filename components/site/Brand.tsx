import Link from './Link';

/**
 * Axilabz logo (supplied lockup: mark, wordmark and tagline). `light` is the footer version: transparent, with a white wordmark. The image carries
 * its own accessible name; nothing else is rendered beside it.
 */
export function Brand({ priority = false, light = false }: { showTagline?: boolean; priority?: boolean; light?: boolean }) {
  return (
    <Link className="brand" href="/">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-logo" src={light ? '/brand/axilabz-logo-light.png' : '/brand/axilabz-logo.webp'} width={760} height={210} alt="Axilabz — Accelerating Xcellence Innovation, home" fetchPriority={priority ? 'high' : undefined} decoding="async" />
    </Link>
  );
}
