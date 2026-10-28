import { firestoreInsert, firestoreCountWhere, firestoreUpdate } from '../../../lib/firebase';
import { handleContact, type ContactDeps } from '../../../lib/contact/handler';
import { createMailSender } from '../../../lib/contact/email';

type SecretEnv = {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_NOTIFY_TO?: string;
  CONTACT_HASH_SALT?: string;
};

const COLLECTION = 'enquiries';

export async function POST(request: Request) {
  const secrets: SecretEnv = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM: process.env.CONTACT_FROM,
    CONTACT_NOTIFY_TO: process.env.CONTACT_NOTIFY_TO,
    CONTACT_HASH_SALT: process.env.CONTACT_HASH_SALT,
  };

  const deps: ContactDeps = {
    async insert(row) {
      return firestoreInsert(COLLECTION, row.id, {
        id: row.id,
        name: row.name,
        email: row.email,
        company: row.company || null,
        interest: row.interest,
        message: row.message,
        budget: row.budget || null,
        timeline: row.timeline || null,
        sourcePath: row.sourcePath || null,
        ipHash: row.ipHash,
        notifyStatus: row.notifyStatus,
        createdAt: row.createdAt,
      });
    },

    async countRecent(ipHash, email, sinceMs) {
      const [byIp, byEmail] = await Promise.all([
        firestoreCountWhere(COLLECTION, 'ipHash', ipHash, 'createdAt', sinceMs),
        firestoreCountWhere(COLLECTION, 'email', email, 'createdAt', sinceMs),
      ]);
      return { byIp, byEmail };
    },

    async markNotified(id, status) {
      await firestoreUpdate(COLLECTION, id, { notifyStatus: status });
    },

    sendMail: createMailSender({
      apiKey: secrets.RESEND_API_KEY,
      from: secrets.CONTACT_FROM,
      to: secrets.CONTACT_NOTIFY_TO,
    }),

    now: () => Date.now(),
    hashSalt: secrets.CONTACT_HASH_SALT ?? 'axilabz',
    log: (event, meta) => console.log(JSON.stringify({ event, ...meta })),
  };

  return handleContact(request, deps);
}
