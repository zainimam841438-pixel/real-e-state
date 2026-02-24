import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const blogArticles = pgTable('blog_articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  featuredImageUrl: text('featured_image_url'),
  category: varchar('category', { length: 50 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type NewBlogArticle = typeof blogArticles.$inferInsert;
