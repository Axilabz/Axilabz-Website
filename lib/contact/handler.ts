import { validateEnquiry, interestLabel, type Enquiry } from './validate.ts';

export type StoredEnquiry = Enquiry & {
  id: string;
  createdAt: number;
  ipHash: string;
  sourcePath: string;
  notifyStatus: 'pending';
};

export type NotifyStatus = 'sent' | 'failed' | 'skipped';

export type Mail = { subject: string; text: string; replyTo: string };

export type ContactDeps = {
  insert(row: StoredEnquiry): Promise<'created' | 'duplicate'>;
  countRecent(ipHash: string, email: string, sinceMs: number): Promise<{ byIp: number; byEmail: number }>;
  markNotified(id: string, status: NotifyStatus): Promise<void>;
  /** Undefined when no notification provider is configured. */
  sendMail?: (mail: Mail) => Promise<void>;
  now(): number;
  hashSalt: string;
  /** Never receives personal data: event name plus non-identifying metadata. */
  log(event: string, meta?: Record<string, string | number>): void;
};

export const LIMITS = { maxBody: 16_000, windowMs: 60 * 60 * 1000, perIp: 5, perEmail: 3, minFillMs: 1500, mailTimeoutMs: 6000 };

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').slice(0, 200);

export function composeMail(e: Enquiry): Mail {
  return {
    subject: `New enquiry: ${oneLine(interestLabel(e.interest))} — ${oneLine(e.name)}`,
    replyTo: e.email,
    text: [
      `Name: ${e.name}`,
      `Email: ${e.email}`,
      `Company: ${e.company || '—'}`,
      `Interest: ${interestLabel(e.interest)}`,
      `Budget: ${e.budget || '—'}`,
      `Timeline: ${e.timeline || '—'}`,
      '',
      e.message,
    ].join('\n'),
  };
}

function sourcePath(request: Request) {
  try {
    return new URL(request.headers.get('referer') ?? '').pathname.slice(0, 200);
  } catch {
    return '';
  }
}

export async function handleContact(request: Request, deps: ContactDeps): Promise<Response> {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Request origin not allowed.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'JSON required.' }, 415);
  if (Number(request.headers.get('content-length') ?? 0) > LIMITS.maxBody) return json({ error: 'Request too large.' }, 413);

  let raw: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > LIMITS.maxBody) return json({ error: 'Request too large.' }, 413);
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ error: 'Invalid request.' }, 400);
    raw = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Bot traps: a filled honeypot or an implausibly fast submission is dropped quietly.
  const startedAt = Number(raw.startedAt);
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && deps.now() - startedAt < LIMITS.minFillMs;
  if ((typeof raw.website === 'string' && raw.website.trim() !== '') || tooFast) {
    deps.log('contact.bot_dropped');
    return json({ ok: true });
  }

  const result = validateEnquiry(raw);
  if (!result.ok) return json({ error: 'Please check the highlighted fields.', fields: result.errors }, 400);
  const data = result.data;

  const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ipHash = await sha256(`${deps.hashSalt}:${ip}`);

  const id = data.submissionId || crypto.randomUUID();
  const row: StoredEnquiry = { ...data, id, createdAt: deps.now(), ipHash, sourcePath: sourcePath(request), notifyStatus: 'pending' };

  try {
    const recent = await deps.countRecent(ipHash, data.email, deps.now() - LIMITS.windowMs);
    if (recent.byIp >= LIMITS.perIp || recent.byEmail >= LIMITS.perEmail) {
      deps.log('contact.rate_limited');
      return json({ error: 'Too many enquiries. Please try again later.' }, 429, { 'Retry-After': String(LIMITS.windowMs / 1000) });
    }

    const stored = await deps.insert(row);
    if (stored === 'duplicate') {
      deps.log('contact.duplicate');
      return json({ ok: true });
    }
  } catch (err) {
    deps.log('contact.store_failed', { error: String(err) });
    return json({ error: 'Unable to save your enquiry. Please try again.' }, 503);
  }

  // The enquiry is durably stored at this point. Notification failure must not
  // lose it or fake a failure to the visitor; it is recorded for follow-up.
  let status: NotifyStatus = 'skipped';
  if (deps.sendMail) {
    try {
      await Promise.race([
        deps.sendMail(composeMail(data)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), LIMITS.mailTimeoutMs)),
      ]);
      status = 'sent';
    } catch {
      status = 'failed';
    }
  }
  deps.log(`contact.notify_${status}`);
  try {
    await deps.markNotified(id, status);
  } catch {
    deps.log('contact.mark_failed');
  }

  return json({ ok: true }, 201);
}
