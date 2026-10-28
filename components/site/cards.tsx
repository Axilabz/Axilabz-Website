import Link from '@/components/site/Link';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { Icon } from './Icon';
import { Tags, StatusBadge } from './ui';
import { TrackedLink } from './TrackedLink';
import type { Service } from '@/lib/data/services';
import type { Product } from '@/lib/data/products';
import { axiSolve } from '@/lib/data/products';

/** Product illustration: AI-upscaled crop of the supplied Labz artwork (1x / 2x / 4x). */
function ProductArt({ name }: { name: string }) {
  const base = `/art/product-${name}`;
  return (
    <div className="product-art" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}.webp`} srcSet={`${base}.webp 332w, ${base}-2x.webp 664w, ${base}-4x.webp 1328w`} sizes="(max-width: 640px) 90vw, 300px" width={332} height={148} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

/** Three layouts so the service overview is not a wall of identical tiles. */
export function ServiceCard({ service }: { service: Service }) {
  const href = `/services/${service.slug}`;
  return (
    <article className={`svc svc-${service.tone}`}>
      <span className="svc-icon"><Icon name={service.icon} size={26} /></span>
      <h3><Link href={href}>{service.name}</Link></h3>
      <p className="svc-problem"><strong>The problem:</strong> {service.problem}</p>
      <p className="svc-summary">{service.summary}</p>
      <Tags items={service.tags} />
      <Link href={href} className="text-link">
        Learn more<span className="sr-only"> about {service.name}</span> <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const research = !!product.underResearch;
  return (
    <article className={`product-card${research ? ' is-research' : ''}`}>
      <div className="card-top">
        <span className="product-icon"><Icon name={product.icon} size={26} /></span>
        <div>
          <h3>{research ? product.name : <Link href={href} className="card-link">{product.name}</Link>}</h3>
          <p>{product.subtitle}</p>
        </div>
      </div>
      <ProductArt name={product.art} />
      <Tags items={product.tags} />
      <p className="card-description">{product.summary}</p>
      <div className="card-foot">
        <StatusBadge status={product.status} />
        {!research && (
          <Link href={href} className="text-link">
            Learn more<span className="sr-only"> about {product.name}</span> <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function AxiSolveCard() {
  return (
    <article className="product-card solve-card">
      <div className="card-top">
        <span className="product-icon"><Plus size={28} aria-hidden="true" /></span>
        <div>
          <h3>{axiSolve.name}</h3>
          <p>{axiSolve.subtitle}</p>
        </div>
      </div>
      <ProductArt name="solve" />
      <p className="card-description">{axiSolve.summary}</p>
      <p className="solve-label">NOT LISTED?</p>
      <TrackedLink href={`/contact?interest=${axiSolve.interest}`} className="button dark" event="product_enquiry_click" params={{ product: 'axisolve' }}>
        Let’s Connect <ArrowRight size={16} aria-hidden="true" />
      </TrackedLink>
    </article>
  );
}

export function RelatedLink({ href, title, text }: { href: string; title: string; text?: string }) {
  return (
    <Link href={href} className="related">
      <span><strong>{title}</strong>{text && <small>{text}</small>}</span>
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
