import { pgTable, uuid, integer, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id').defaultRandom().primaryKey(),
  x: integer('x').notNull().default(0),
  y: integer('y').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const maps = pgTable('maps', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
