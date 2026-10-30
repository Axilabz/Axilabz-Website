import { validateEnquiry, interestLabel, type Enquiry } from './validate.ts';

export type StoredEnquiry = Enquiry & {
  id: string;
  createdAt: number;
  ipHash: string;
  sourcePath: string;
  notifyStatus: 'pending';
};

export type NotifyStatus = 'sent' | 'failed' | 'skipped';

export type Mail = { subject: string; text: string; html: string; replyTo: string };

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
  const interest = interestLabel(e.interest);
  const company = e.company || '—';
  const budget = e.budget || '—';
  const timeline = e.timeline || '—';

  const subject = `[Axilabz Enquiry] ${oneLine(e.name)} — ${oneLine(interest)}`;

  const text = [
    '───────────────────────────────',
    'NEW ENQUIRY — AXILABZ WEBSITE',
    '───────────────────────────────',
    '',
    `Name       : ${e.name}`,
    `Email      : ${e.email}`,
    `Company    : ${company}`,
    `Interest   : ${interest}`,
    `Budget     : ${budget}`,
    `Timeline   : ${timeline}`,
    '',
    'MESSAGE',
    '───────',
    e.message,
    '',
    '───────────────────────────────',
    'Reply directly to this email to respond to the enquiry.',
    'View all enquiries: https://console.firebase.google.com',
    '───────────────────────────────',
  ].join('\n');

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 12px;font-size:14px;color:#111827;vertical-align:top">${value}</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="background:#1e3a5f;padding:24px 32px">
          <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">Axilabz</p>
          <p style="margin:4px 0 0;font-size:13px;color:#93c5fd">New website enquiry received</p>
        </td></tr>

        <!-- Sender info -->
        <tr><td style="padding:28px 32px 0">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111827">${e.name}</h2>
          <p style="margin:0;font-size:14px;color:#6b7280"><a href="mailto:${e.email}" style="color:#2563eb;text-decoration:none">${e.email}</a>${e.company ? ` &nbsp;·&nbsp; ${e.company}` : ''}</p>
        </td></tr>

        <!-- Details table -->
        <tr><td style="padding:20px 32px">
          <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
            ${row('Interest', interest)}
            ${row('Budget', budget)}
            ${row('Timeline', timeline)}
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:0 32px 28px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.5px">Message</p>
          <div style="background:#f9fafb;border-left:3px solid #f59e0b;padding:16px;border-radius:0 8px 8px 0;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap">${e.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 32px 32px">
          <a href="mailto:${e.email}?subject=Re: Your Axilabz enquiry" style="display:inline-block;background:#f59e0b;color:#1e3a5f;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none">Reply to ${e.name} →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px">
          <p style="margin:0;font-size:12px;color:#9ca3af">This email was sent automatically from the Axilabz website contact form. Do not reply to this email — use the button above instead.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html, replyTo: e.email };
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

  // Rate-limit check — uses composite Firestore queries that need indexes.
  // If the index isn't ready yet, we skip the check rather than block the submission.
  try {
    const recent = await deps.countRecent(ipHash, data.email, deps.now() - LIMITS.windowMs);
    if (recent.byIp >= LIMITS.perIp || recent.byEmail >= LIMITS.perEmail) {
      deps.log('contact.rate_limited');
      return json({ error: 'Too many enquiries. Please try again later.' }, 429, { 'Retry-After': String(LIMITS.windowMs / 1000) });
    }
  } catch (err) {
    // Index not yet built or transient error — log and continue so submission isn't lost.
    deps.log('contact.rate_check_skipped', { error: String(err) });
  }

  try {
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
