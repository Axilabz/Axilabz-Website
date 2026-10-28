'use client';

import Link from '@/components/site/Link';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import { BUDGET_OPTIONS, INTEREST_OPTIONS, TIMELINE_OPTIONS, validateEnquiry, type FieldErrors } from '@/lib/contact/validate';
import { track } from '@/lib/analytics';

type State = 'idle' | 'sending' | 'success' | 'error' | 'limited';

const PRODUCTS = new Set(['axidoc', 'axicore', 'axidata', 'axisolve']);

export function ContactForm({ initialInterest = 'general' }: { initialInterest?: string }) {
  const valid = INTEREST_OPTIONS.some((o) => o.value === initialInterest);
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [interest, setInterest] = useState(valid ? initialInterest : 'general');
  // False on the server and during hydration: the form cannot be submitted natively (a plain GET would put
  // the visitor's details in the URL) before the script that handles submission is running.
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const submissionId = useRef('');
  const startedAt = useRef(0);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    submissionId.current = crypto.randomUUID();
    startedAt.current = Date.now();
  }, []);

  function onFirstInteraction() {
    if (started.current) return;
    started.current = true;
    track('contact_form_start');
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      submissionId: submissionId.current,
      startedAt: startedAt.current,
      website: String(fd.get('website') ?? ''),
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      interest: String(fd.get('interest') ?? ''),
      message: String(fd.get('message') ?? ''),
      budget: String(fd.get('budget') ?? ''),
      timeline: String(fd.get('timeline') ?? ''),
      consent: fd.get('consent') === 'on' ? 'on' : '',
    };

    const check = validateEnquiry(payload);
    if (!check.ok) {
      setErrors(check.errors);
      setState('idle');
      const first = Object.keys(check.errors)[0];
      (form.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setState('sending');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (res.status === 429) { setState('limited'); return; }
      if (res.status === 400) {
        const body = (await res.json().catch(() => ({}))) as { fields?: FieldErrors };
        if (body.fields) setErrors(body.fields);
        setState('idle');
        return;
      }
      if (!res.ok) throw new Error('not stored');
      track('contact_form_submit', { interest: payload.interest });
      if (PRODUCTS.has(payload.interest)) track('product_enquiry', { product: payload.interest });
      setState('success');
      form.reset();
    } catch {
      // Same submission ID is reused on retry, so a request that actually
      // reached the server cannot create a duplicate record.
      setState('error');
    } finally {
      clearTimeout(timer);
    }
  }

  function reset() {
    submissionId.current = crypto.randomUUID();
    startedAt.current = Date.now();
    started.current = false;
    setErrors({});
    setState('idle');
  }

  if (state === 'success') {
    return (
      <div className="form-success" role="status">
        <span><Check size={32} aria-hidden="true" /></span>
        <h2>Thank you — your enquiry was received.</h2>
        <p>We have stored your message and will review it. We reply from the address you provided, so please check your spam folder if you do not hear back.</p>
        <button type="button" className="button secondary" onClick={reset}>Send another enquiry <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });
  const err = (name: keyof FieldErrors) => errors[name] && <small id={`${name}-error`} className="error">{errors[name]}</small>;
  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} method="post" action="/api/contact" onSubmit={onSubmit} noValidate className="contact-form" onFocus={onFirstInteraction} aria-describedby="form-status">
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Your name <span aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
          <input id="name" name="name" type="text" autoComplete="name" maxLength={100} placeholder="Alex Morgan" required {...field('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="email">Business email <span aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="alex@company.com" required {...field('email')} />
          {err('email')}
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="company">Company <span className="opt">(optional)</span></label>
          <input id="company" name="company" type="text" autoComplete="organization" maxLength={150} {...field('company')} />
          {err('company')}
        </div>
        <div className="field">
          <label htmlFor="interest">What are you interested in?</label>
          <select id="interest" name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} {...field('interest')}>
            {INTEREST_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {err('interest')}
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">What would you like to solve? <span aria-hidden="true">*</span><span className="sr-only">(required)</span></label>
        <textarea id="message" name="message" rows={5} minLength={20} maxLength={5000} placeholder="A workflow, a set of documents, a system to integrate, or an idea you want to test…" required {...field('message')} />
        {err('message')}
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="budget">Budget range <span className="opt">(optional)</span></label>
          <select id="budget" name="budget" defaultValue="" {...field('budget')}>
            {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {err('budget')}
        </div>
        <div className="field">
          <label htmlFor="timeline">Timeline <span className="opt">(optional)</span></label>
          <select id="timeline" name="timeline" defaultValue="" {...field('timeline')}>
            {TIMELINE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {err('timeline')}
        </div>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" {...field('consent')} />
        <span>I agree that Axilabz may store my enquiry and use these details to respond to me. See the <Link href="/privacy">Privacy Policy</Link>.</span>
      </label>
      {err('consent')}

      <button className="button primary submit" disabled={state === 'sending' || !hydrated} type="submit">
        {state === 'sending' ? <><Loader2 size={17} className="spin" aria-hidden="true" />Sending your enquiry…</> : <>Send enquiry <ArrowUpRight size={18} aria-hidden="true" /></>}
      </button>

      <div id="form-status" role="status" aria-live="polite">
        {errorCount > 0 && <p className="error">Please correct {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`} and send again.</p>}
        {state === 'error' && <p className="error">We could not confirm that your enquiry was saved. Your details are still in the form. Please try again. Retrying is safe and will not create a duplicate.</p>}
        {state === 'limited' && <p className="error">You have sent several enquiries recently. Please wait a while before sending another.</p>}
      </div>
      <p className="form-note"><ShieldCheck size={14} aria-hidden="true" />Only what you enter here is stored. Please do not include passwords or sensitive personal data.</p>
    </form>
  );
}
