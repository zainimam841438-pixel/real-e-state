import { pgTable, uuid, varchar, text, integer } from 'drizzle-orm/pg-core';

export const propertyCategories = pgTable('property_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  sortOrder: integer('sort_order').default(0),
});

export type PropertyCategory = typeof propertyCategories.$inferSelect;
export type NewPropertyCategory = typeof propertyCategories.$inferInsert;
