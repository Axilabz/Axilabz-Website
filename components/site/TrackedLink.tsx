'use client';

import Link from '@/components/site/Link';
import type { ComponentProps } from 'react';
import { track } from '@/lib/analytics';

type Props = ComponentProps<typeof Link> & { event: string; params?: Record<string, string> };

/** A normal route link that also reports a conversion event on click. mailto: links are plain anchors so the mail app opens. */
export function TrackedLink({ event, params, onClick, ...rest }: Props) {
  if (typeof rest.href === 'string' && rest.href.startsWith('mailto:')) {
    const { href, className, children } = rest;
    return <a href={href} className={className} onClick={() => track(event, params)}>{children}</a>;
  }
  return <Link {...rest} onClick={(e) => { track(event, params); onClick?.(e); }} />;
}
