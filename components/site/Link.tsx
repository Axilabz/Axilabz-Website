import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/**
 * Site-wide link. Viewport prefetching is disabled by default: Vinext 1.0.0-beta.5
 * throws "RSC prefetch setup error" in production for automatic prefetches, which
 * pollutes the console. Navigation is unaffected. Re-enable per link with prefetch.
 */
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
