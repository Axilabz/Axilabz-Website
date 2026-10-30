import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * Contact enquiries. Contains personal data: never expose through a public route.
 * `id` is the client-generated submission ID, which makes retries idempotent.
 */
export const enquiries = sqliteTable(
  'enquiries',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    interest: text('interest').notNull(),
    message: text('message').notNull(),
    createdAt: integer('created_at').notNull(),
    company: text('company'),
    budget: text('budget'),
    timeline: text('timeline'),
    sourcePath: text('source_path'),
    ipHash: text('ip_hash'),
    notifyStatus: text('notify_status'),
  },
  (t) => [index('enquiries_ip_created_idx').on(t.ipHash, t.createdAt), index('enquiries_email_created_idx').on(t.email, t.createdAt)],
);
