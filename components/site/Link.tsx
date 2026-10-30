import type { ComponentProps } from 'react';
import NextLink from 'next/link';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * Site-wide link.
 *
 * vinext 1.0.0-beta.5 on Cloudflare Workers throws:
 *   "TypeError: e is not a function" inside React's startTransition
 * when Next.js Link attempts client-side navigation. All pages are
 * server-rendered so full-page navigation is fast and works correctly.
 *
 * Next.js-specific props (prefetch, scroll, replace, shallow) are
 * stripped so they don't leak onto the native <a> element.
 */
export default function Link({
  href,
  prefetch: _prefetch,
  scroll: _scroll,
  replace: _replace,
  ...rest
}: LinkProps) {
  const hrefStr =
    typeof href === 'string'
      ? href
      : (href as { pathname?: string } | undefined)?.pathname ?? '#';

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a href={hrefStr} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />
  );
}
