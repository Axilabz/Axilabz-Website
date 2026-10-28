import { env } from 'cloudflare:workers';
import { and, eq, gt } from 'drizzle-orm';
import { getDb } from '../../../db/index';
import { enquiries } from '../../../db/schema';
import { handleContact, type ContactDeps } from '../../../lib/contact/handler';
import { createMailSender } from '../../../lib/contact/email';

/** Secrets are Worker bindings (wrangler secret / Sites secrets), never client code. */
type SecretEnv = { RESEND_API_KEY?: string; CONTACT_FROM?: string; CONTACT_NOTIFY_TO?: string; CONTACT_HASH_SALT?: string };

export async function POST(request: Request) {
  const secrets = env as unknown as SecretEnv;
  const deps: ContactDeps = {
    async insert(row) {
      const inserted = await getDb()
        .insert(enquiries)
        .values({
          id: row.id, name: row.name, email: row.email, interest: row.interest, message: row.message, createdAt: row.createdAt,
          company: row.company || null, budget: row.budget || null, timeline: row.timeline || null,
          sourcePath: row.sourcePath || null, ipHash: row.ipHash, notifyStatus: row.notifyStatus,
        })
        .onConflictDoNothing({ target: enquiries.id })
        .returning({ id: enquiries.id });
      return inserted.length ? 'created' : 'duplicate';
    },
    async countRecent(ipHash, email, since) {
      const db = getDb();
      const [byIp, byEmail] = await Promise.all([
        db.select({ id: enquiries.id }).from(enquiries).where(and(eq(enquiries.ipHash, ipHash), gt(enquiries.createdAt, since))),
        db.select({ id: enquiries.id }).from(enquiries).where(and(eq(enquiries.email, email), gt(enquiries.createdAt, since))),
      ]);
      return { byIp: byIp.length, byEmail: byEmail.length };
    },
    async markNotified(id, status) {
      await getDb().update(enquiries).set({ notifyStatus: status }).where(eq(enquiries.id, id));
    },
    sendMail: createMailSender({ apiKey: secrets.RESEND_API_KEY, from: secrets.CONTACT_FROM, to: secrets.CONTACT_NOTIFY_TO }),
    now: () => Date.now(),
    hashSalt: secrets.CONTACT_HASH_SALT ?? 'axilabz',
    log: (event, meta) => console.log(JSON.stringify({ event, ...meta })),
  };
  return handleContact(request, deps);
}
