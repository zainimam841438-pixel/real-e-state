// Schema exports
export * from './users';
export * from './property-categories';
export * from './properties';
export * from './property-images';
export * from './property-amenities';
export * from './investment-metrics';
export * from './bookings';
export * from './testimonials';
export * from './blog-articles';

// Relations
import { relations } from 'drizzle-orm';
import { users, properties, propertyCategories, propertyImages, propertyAmenities, investmentMetrics, bookings, testimonials } from './index';

// Users relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

// Property categories relations
export const propertyCategoriesRelations = relations(propertyCategories, ({ many }) => ({
  properties: many(properties),
}));

// Properties relations
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  category: one(propertyCategories, {
    fields: [properties.categoryId],
    references: [propertyCategories.id],
  }),
  images: many(propertyImages),
  amenities: many(propertyAmenities),
  investmentMetrics: one(investmentMetrics, {
    fields: [properties.id],
    references: [investmentMetrics.propertyId],
  }),
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

// Property images relations
export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

// Property amenities relations
export const propertyAmenitiesRelations = relations(propertyAmenities, ({ one }) => ({
  property: one(properties, {
    fields: [propertyAmenities.propertyId],
    references: [properties.id],
  }),
}));

// Investment metrics relations
export const investmentMetricsRelations = relations(investmentMetrics, ({ one }) => ({
  property: one(properties, {
    fields: [investmentMetrics.propertyId],
    references: [properties.id],
  }),
}));

// Bookings relations
export const bookingsRelations = relations(bookings, ({ one }) => ({
  property: one(properties, {
    fields: [bookings.propertyId],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

// Testimonials relations
export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  user: one(users, {
    fields: [testimonials.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [testimonials.propertyId],
    references: [properties.id],
  }),
}));
