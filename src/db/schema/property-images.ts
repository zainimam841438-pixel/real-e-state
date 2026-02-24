import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const propertyImages = pgTable('property_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  blobUrl: text('blob_url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  type: varchar('type', { length: 20 }).default('image').notNull(),
  sortOrder: integer('sort_order').default(0),
  isPrimary: boolean('is_primary').default(false),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: integer('size_bytes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
export type NewPropertyImage = typeof propertyImages.$inferInsert;
