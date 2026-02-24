import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { propertyCategories } from './property-categories';

export interface PropertyMetadata {
  virtualTourUrl?: string;
  videoUrl?: string;
  floorPlanUrl?: string;
  documents?: string[];
  features?: string[];
  customFields?: Record<string, unknown>;
}

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => propertyCategories.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  status: varchar('status', { length: 20 }).default('available').notNull(),
  
  // Location
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  
  // Property Details
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  areaSqft: decimal('area_sqft', { precision: 10, scale: 2 }).notNull(),
  yearBuilt: integer('year_built'),
  
  // Flags
  featured: boolean('featured').default(false),
  published: boolean('published').default(false),
  
  // Flexible metadata
  metadata: jsonb('metadata').$type<PropertyMetadata>(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
