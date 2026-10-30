import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact, LIMITS, type ContactDeps, type StoredEnquiry, type NotifyStatus } from '../lib/contact/handler.ts';
import { createMailSender, DEFAULT_NOTIFY_TO } from '../lib/contact/email.ts';
import { validateEnquiry } from '../lib/contact/validate.ts';

const valid = {
  submissionId: '11111111-1111-4111-8111-111111111111',
  startedAt: 1_000,
  website: '',
  name: 'Alex Morgan',
  email: 'Alex@Example.com',
  company: 'Example Ltd',
  interest: 'axidoc',
  message: 'We process about two thousand supplier invoices a month and want to automate capture.',
  budget: '',
  timeline: '',
  consent: 'on',
};

function req(body: unknown, init: { origin?: string; headers?: Record<string, string> } = {}) {
  return new Request('https://site.test/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: init.origin ?? 'https://site.test', ...(init.headers ?? {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function makeDeps(over: Partial<ContactDeps> = {}) {
  const rows = new Map<string, StoredEnquiry>();
  const statuses: NotifyStatus[] = [];
  const logs: string[] = [];
  const deps: ContactDeps = {
    async insert(row) {
      if (rows.has(row.id)) return 'duplicate';
      rows.set(row.id, row);
      return 'created';
    },
    async countRecent(ipHash, email) {
      const all = [...rows.values()];
      return { byIp: all.filter((r) => r.ipHash === ipHash).length, byEmail: all.filter((r) => r.email === email).length };
    },
    async markNotified(_id, s) {
      statuses.push(s);
    },
    sendMail: async () => {},
    now: () => 1_000_000,
    hashSalt: 'test',
    log: (e) => logs.push(e),
    ...over,
  };
  return { deps, rows, statuses, logs };
}

test('rejects invalid submissions with field errors and stores nothing', async () => {
  const { deps, rows } = makeDeps();
  const res = await handleContact(req({ ...valid, email: 'nope', message: 'short', consent: '' }), deps);
  assert.equal(res.status, 400);
  const body = (await res.json()) as { fields: Record<string, string> };
  assert.ok(body.fields.email && body.fields.message && body.fields.consent);
  assert.equal(rows.size, 0);
});

test('stores a valid enquiry, lowercases email, sends notification', async () => {
  let mailed = 0;
  const { deps, rows, statuses } = makeDeps({
    sendMail: async (m) => {
      mailed++;
      assert.match(m.subject, /AxiDoc/);
      assert.equal(m.replyTo, 'alex@example.com');
    },
  });
  const res = await handleContact(req(valid), deps);
  assert.equal(res.status, 201);
  assert.equal(rows.size, 1);
  assert.equal([...rows.values()][0].email, 'alex@example.com');
  assert.equal(mailed, 1);
  assert.deepEqual(statuses, ['sent']);
});

test('database failure returns 503 and never a success state', async () => {
  const { deps } = makeDeps({
    insert: async () => {
      throw new Error('d1 down');
    },
  });
  const res = await handleContact(req(valid), deps);
  assert.equal(res.status, 503);
  assert.notEqual(((await res.json()) as { ok?: boolean }).ok, true);
});

test('notification failure keeps the stored enquiry, succeeds, and records failed status', async () => {
  const { deps, rows, statuses } = makeDeps({
    sendMail: async () => {
      throw new Error('provider 500');
    },
  });
  const res = await handleContact(req(valid), deps);
  assert.equal(res.status, 201);
  assert.equal(rows.size, 1);
  assert.deepEqual(statuses, ['failed']);
});

test('missing mail configuration is recorded as skipped, not sent', async () => {
  const { deps, statuses } = makeDeps({ sendMail: undefined });
  const res = await handleContact(req(valid), deps);
  assert.equal(res.status, 201);
  assert.deepEqual(statuses, ['skipped']);
});

test('retry with the same submission id is idempotent and does not re-send mail', async () => {
  let mailed = 0;
  const { deps, rows } = makeDeps({
    sendMail: async () => {
      mailed++;
    },
  });
  await handleContact(req(valid), deps);
  const again = await handleContact(req(valid), deps);
  assert.equal(again.status, 200);
  assert.equal(rows.size, 1);
  assert.equal(mailed, 1);
});

test('recovers: a failed attempt can be retried successfully with the same id', async () => {
  let fail = true;
  const base = makeDeps();
  const deps: ContactDeps = {
    ...base.deps,
    insert: async (r) => {
      if (fail) throw new Error('transient');
      return base.deps.insert(r);
    },
  };
  assert.equal((await handleContact(req(valid), deps)).status, 503);
  fail = false;
  assert.equal((await handleContact(req(valid), deps)).status, 201);
  assert.equal(base.rows.size, 1);
});

test('rate limits repeated submissions per email', async () => {
  const { deps } = makeDeps({ countRecent: async () => ({ byIp: 0, byEmail: LIMITS.perEmail }) });
  const res = await handleContact(req({ ...valid, submissionId: '' }), deps);
  assert.equal(res.status, 429);
  assert.ok(res.headers.get('retry-after'));
});

test('rate limits repeated submissions per IP', async () => {
  const { deps } = makeDeps({ countRecent: async () => ({ byIp: LIMITS.perIp, byEmail: 0 }) });
  assert.equal((await handleContact(req(valid), deps)).status, 429);
});

test('honeypot and too-fast submissions are dropped without storing', async () => {
  const { deps, rows } = makeDeps();
  assert.equal((await handleContact(req({ ...valid, website: 'http://spam' }), deps)).status, 200);
  assert.equal((await handleContact(req({ ...valid, startedAt: 1_000_000 - 100 }), deps)).status, 200);
  assert.equal(rows.size, 0);
});

test('rejects cross-origin, wrong content type, malformed and oversized bodies', async () => {
  const { deps } = makeDeps();
  assert.equal((await handleContact(req(valid, { origin: 'https://evil.test' }), deps)).status, 403);
  const plain = new Request('https://site.test/api/contact', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'x' });
  assert.equal((await handleContact(plain, deps)).status, 415);
  assert.equal((await handleContact(req('{not json'), deps)).status, 400);
  assert.equal((await handleContact(req('[]'), deps)).status, 400);
  assert.equal((await handleContact(req({ ...valid, message: 'x'.repeat(LIMITS.maxBody) }), deps)).status, 413);
});

test('logs never contain personal data', async () => {
  const { deps, logs } = makeDeps();
  await handleContact(req(valid), deps);
  assert.ok(logs.length > 0);
  for (const l of logs) assert.ok(!/alex|example|invoice/i.test(l));
});

test('validation accepts optional fields and rejects unknown option values', () => {
  assert.equal(validateEnquiry({ ...valid, company: '' }).ok, true);
  const bad = validateEnquiry({ ...valid, interest: 'hack', budget: 'free', timeline: 'now' });
  assert.equal(bad.ok, false);
});

test('mail sender returns undefined without config and throws on provider error', async () => {
  assert.equal(createMailSender({}), undefined);
  const ok = createMailSender({ apiKey: 'k', from: 'a@b.c', to: 'x@y.z' }, (async () => new Response('{}', { status: 200 })) as typeof fetch);
  await ok!({ subject: 's', text: 't', html: '', replyTo: 'r@r.r' });
  const bad = createMailSender({ apiKey: 'k', from: 'a@b.c', to: 'x@y.z' }, (async () => new Response('no', { status: 500 })) as typeof fetch);
  await assert.rejects(() => bad!({ subject: 's', text: 't', html: '', replyTo: 'r@r.r' }));
});

test('enquiries are emailed to axilabzoffl@gmail.com by default, and CONTACT_NOTIFY_TO overrides it', async () => {
  assert.equal(DEFAULT_NOTIFY_TO, 'axilabzoffl@gmail.com');
  const bodies: { to: string[]; reply_to: string; subject: string; text: string }[] = [];
  const spy = (async (_url: string, init: RequestInit) => { bodies.push(JSON.parse(String(init.body))); return new Response('{}', { status: 200 }); }) as unknown as typeof fetch;
  const send = createMailSender({ apiKey: 'k', from: 'Axilabz <noreply@example.com>' }, spy)!;
  await send({ subject: 'New enquiry', text: 'Name: A', html: '', replyTo: 'visitor@example.com' });
  assert.deepEqual(bodies[0].to, ['axilabzoffl@gmail.com']);
  assert.equal(bodies[0].reply_to, 'visitor@example.com');
  const other = createMailSender({ apiKey: 'k', from: 'x@y.z', to: 'a@b.c, d@e.f' }, spy)!;
  await other({ subject: 's', text: 't', html: '', replyTo: 'r@r.r' });
  assert.deepEqual(bodies[1].to, ['a@b.c', 'd@e.f']);
});

test('a complete enquiry produces an email to the default inbox containing the visitor details', async () => {
  const sent: { to: string[]; text: string; subject: string }[] = [];
  const spy = (async (_u: string, init: RequestInit) => { sent.push(JSON.parse(String(init.body))); return new Response('{}', { status: 200 }); }) as unknown as typeof fetch;
  const { deps, statuses } = makeDeps({ sendMail: createMailSender({ apiKey: 'k', from: 'noreply@example.com' }, spy) });
  const res = await handleContact(req(valid), deps);
  assert.equal(res.status, 201);
  assert.deepEqual(sent[0].to, ['axilabzoffl@gmail.com']);
  assert.match(sent[0].text, /Alex Morgan/);
  assert.match(sent[0].text, /alex@example.com/);
  assert.match(sent[0].text, /supplier invoices/);
  assert.deepEqual(statuses, ['sent']);
});
