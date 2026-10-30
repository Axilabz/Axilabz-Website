import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const enquiries=sqliteTable('enquiries',{id:text('id').primaryKey(),name:text('name').notNull(),email:text('email').notNull(),interest:text('interest').notNull(),message:text('message').notNull(),createdAt:integer('created_at').notNull()});
