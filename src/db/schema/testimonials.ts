import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { properties } from './properties';

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  propertyId: uuid('property_id').references(() => properties.id),
  clientName: varchar('client_name', { length: 100 }).notNull(),
  clientTitle: varchar('client_title', { length: 100 }),
  clientCompany: varchar('client_company', { length: 100 }),
  avatarUrl: text('avatar_url'),
  content: text('content').notNull(),
  rating: integer('rating'),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
