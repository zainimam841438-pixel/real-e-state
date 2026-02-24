import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { users } from './users';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  requestedDate: timestamp('requested_date').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  notes: text('notes'),
  contactInfo: jsonb('contact_info').$type<ContactInfo>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
