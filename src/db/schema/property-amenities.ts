import { pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const propertyAmenities = pgTable('property_amenities', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 50 }),
  description: text('description'),
});

export type PropertyAmenity = typeof propertyAmenities.$inferSelect;
export type NewPropertyAmenity = typeof propertyAmenities.$inferInsert;
