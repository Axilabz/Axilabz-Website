import type { Mail } from './handler.ts';

/** Inbox that receives website enquiries unless CONTACT_NOTIFY_TO overrides it. */
export const DEFAULT_NOTIFY_TO = 'axilabzoffl@gmail.com';

export type MailConfig = { apiKey?: string; from?: string; to?: string };

/**
 * Transactional email through the Resend HTTP API. Returns undefined when the
 * deployment has not configured credentials, so the handler records the
 * enquiry as "skipped" instead of pretending a notification went out.
 */
export function createMailSender(cfg: MailConfig, fetchImpl: typeof fetch = fetch): ((mail: Mail) => Promise<void>) | undefined {
  if (!cfg.apiKey || !cfg.from) return undefined;
  const recipients = (cfg.to?.trim() || DEFAULT_NOTIFY_TO).split(',').map((s) => s.trim()).filter(Boolean);
  if (!recipients.length) return undefined;
  return async (mail) => {
    const res = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: cfg.from, to: recipients, reply_to: mail.replyTo, subject: mail.subject, text: mail.text, html: mail.html }),
    });
    if (!res.ok) throw new Error(`mail provider status ${res.status}`);
  };
}
