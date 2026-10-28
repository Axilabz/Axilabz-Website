import { getFirestoreDb } from '../../../lib/firebase';
import { handleContact, type ContactDeps } from '../../../lib/contact/handler';
import { createMailSender } from '../../../lib/contact/email';
import { FieldValue } from 'firebase-admin/firestore';

/** Secrets from environment variables (never exposed to the client). */
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
      const db = getFirestoreDb();
      const docRef = db.collection(COLLECTION).doc(row.id);

      // Use a transaction so a duplicate submission never overwrites an existing doc.
      const created = await db.runTransaction(async (tx) => {
        const snap = await tx.get(docRef);
        if (snap.exists) return false;
        tx.set(docRef, {
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
          createdAtTs: FieldValue.serverTimestamp(),
        });
        return true;
      });

      return created ? 'created' : 'duplicate';
    },

    async countRecent(ipHash, email, sinceMs) {
      const db = getFirestoreDb();
      const col = db.collection(COLLECTION);

      const [byIpSnap, byEmailSnap] = await Promise.all([
        col.where('ipHash', '==', ipHash).where('createdAt', '>', sinceMs).get(),
        col.where('email', '==', email).where('createdAt', '>', sinceMs).get(),
      ]);

      return { byIp: byIpSnap.size, byEmail: byEmailSnap.size };
    },

    async markNotified(id, status) {
      const db = getFirestoreDb();
      await db.collection(COLLECTION).doc(id).update({ notifyStatus: status });
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
