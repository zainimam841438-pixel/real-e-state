# Ultra-Premium Real Estate Platform - Architecture Specification

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Database Schema](#2-database-schema)
3. [API Routes Structure](#3-api-routes-structure)
4. [Component Hierarchy](#4-component-hierarchy)
5. [Edge Config Structure](#5-edge-config-structure)
6. [Vercel Blob Organization](#6-vercel-blob-organization)
7. [Environment Variables](#7-environment-variables)

---

## 1. System Architecture Overview

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client
        Browser[Browser]
        Mobile[Mobile Devices]
    end

    subgraph Vercel Edge Network
        CDN[Edge CDN]
        EdgeConfig[Edge Config]
        EdgeFunctions[Edge Functions]
    end

    subgraph Next.js Application
        AppRouter[App Router]
        ServerComponents[Server Components]
        ClientComponents[Client Components]
        Middleware[Middleware]
    end

    subgraph Data Layer
        Neon[(Neon Postgres)]
        Drizzle[Drizzle ORM]
        VercelBlob[Vercel Blob Storage]
    end

    subgraph External Services
        GroqAPI[Groq AI API]
        Analytics[Analytics]
        Email[Email Service]
    end

    Browser --> CDN
    Mobile --> CDN
    CDN --> AppRouter
    AppRouter --> ServerComponents
    AppRouter --> ClientComponents
    AppRouter --> Middleware
    Middleware --> EdgeConfig
    ServerComponents --> Drizzle
    Drizzle --> Neon
    ServerComponents --> VercelBlob
    ClientComponents --> EdgeFunctions
    EdgeFunctions --> GroqAPI
    AppRouter --> Email
    AppRouter --> Analytics
```

### Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Edge-First** | Static pages served from CDN, dynamic content via Edge Functions |
| **Server Components** | Default to Server Components for data fetching, SEO, and performance |
| **Progressive Enhancement** | Core functionality works without JavaScript |
| **Type Safety** | End-to-end TypeScript with Drizzle schema inference |
| **Zero-Cold-Start AI** | Groq API for ultra-fast AI responses |

### Request Flow

```mermaid
sequenceDiagram
    participant User
    participant Edge as Vercel Edge
    participant Next as Next.js Server
    participant DB as Neon Postgres
    participant Blob as Vercel Blob
    participant AI as Groq API

    User->>Edge: Request page
    Edge->>Next: Route to App Router
    Next->>DB: Fetch property data via Drizzle
    DB-->>Next: Return data
    Next->>Blob: Get image URLs
    Blob-->>Next: Return signed URLs
    Next-->>Edge: Rendered HTML
    Edge-->>User: Cached response

    Note over User,AI: For AI Concierge
    User->>Edge: Chat message
    Edge->>AI: Stream request
    AI-->>Edge: Streamed response
    Edge-->>User: Real-time AI response
```

---

## 2. Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ bookings : creates
    users ||--o{ testimonials : writes
    properties ||--o{ property_images : has
    properties ||--o{ property_amenities : has
    properties ||--o{ investment_metrics : has
    properties ||--o{ bookings : requested_for
    properties }o--|| property_categories : belongs_to
    properties ||--o{ testimonials : featured_in

    users {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        string role
        string avatar_url
        timestamp created_at
        timestamp updated_at
    }

    properties {
        uuid id PK
        uuid category_id FK
        string title
        string slug UK
        text description
        decimal price
        string currency
        string status
        string address
        string city
        string state
        string country
        string postal_code
        decimal latitude
        decimal longitude
        integer bedrooms
        integer bathrooms
        decimal area_sqft
        integer year_built
        boolean featured
        boolean published
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    property_categories {
        uuid id PK
        string name UK
        string slug UK
        string description
        string icon
        integer sort_order
    }

    property_images {
        uuid id PK
        uuid property_id FK
        string blob_url
        string alt_text
        string type
        integer sort_order
        boolean is_primary
        integer width
        integer height
        integer size_bytes
        timestamp created_at
    }

    property_amenities {
        uuid id PK
        uuid property_id FK
        string name
        string category
        string icon
        text description
    }

    investment_metrics {
        uuid id PK
        uuid property_id FK
        decimal roi_percentage
        decimal rental_yield
        decimal appreciation_forecast
        decimal monthly_rental_estimate
        decimal annual_rental_estimate
        jsonb market_data
        timestamp last_updated
    }

    bookings {
        uuid id PK
        uuid property_id FK
        uuid user_id FK
        timestamp requested_date
        string status
        text notes
        jsonb contact_info
        timestamp created_at
        timestamp updated_at
    }

    testimonials {
        uuid id PK
        uuid user_id FK
        uuid property_id FK
        string client_name
        string client_title
        string client_company
        string avatar_url
        text content
        integer rating
        boolean featured
        timestamp created_at
    }

    blog_articles {
        uuid id PK
        string title
        string slug UK
        text excerpt
        text content
        string author
        string featured_image_url
        string category
        string[] tags
        boolean published
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
```

### Drizzle Schema Definition

```typescript
// src/db/schema/users.ts
import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 20 }).default('user').notNull(), // 'user', 'agent', 'admin'
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

```typescript
// src/db/schema/property-categories.ts
import { pgTable, uuid, varchar, text, integer } from 'drizzle-orm/pg-core';

export const propertyCategories = pgTable('property_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }), // Lucide icon name
  sortOrder: integer('sort_order').default(0),
});

export type PropertyCategory = typeof propertyCategories.$inferSelect;
```

```typescript
// src/db/schema/properties.ts
import { pgTable, uuid, varchar, text, decimal, integer, boolean, timestamp, jsonb, foreignKey } from 'drizzle-orm/pg-core';
import { propertyCategories } from './property-categories';

export const properties = pgTable('properties', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => propertyCategories.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  status: varchar('status', { length: 20 }).default('available').notNull(), // 'available', 'reserved', 'sold', 'rented'
  
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

interface PropertyMetadata {
  virtualTourUrl?: string;
  videoUrl?: string;
  floorPlanUrl?: string;
  documents?: string[];
  features?: string[];
  customFields?: Record<string, unknown>;
}

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
```

```typescript
// src/db/schema/property-images.ts
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const propertyImages = pgTable('property_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  blobUrl: text('blob_url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  type: varchar('type', { length: 20 }).default('image').notNull(), // 'image', 'video', 'floorplan'
  sortOrder: integer('sort_order').default(0),
  isPrimary: boolean('is_primary').default(false),
  width: integer('width'),
  height: integer('height'),
  sizeBytes: integer('size_bytes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type PropertyImage = typeof propertyImages.$inferSelect;
```

```typescript
// src/db/schema/property-amenities.ts
import { pgTable, uuid, varchar, text, foreignKey } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const propertyAmenities = pgTable('property_amenities', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // 'indoor', 'outdoor', 'security', 'lifestyle'
  icon: varchar('icon', { length: 50 }), // Lucide icon name
  description: text('description'),
});

export type PropertyAmenity = typeof propertyAmenities.$inferSelect;
```

```typescript
// src/db/schema/investment-metrics.ts
import { pgTable, uuid, decimal, jsonb, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { properties } from './properties';

export const investmentMetrics = pgTable('investment_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull().unique(),
  roiPercentage: decimal('roi_percentage', { precision: 5, scale: 2 }),
  rentalYield: decimal('rental_yield', { precision: 5, scale: 2 }),
  appreciationForecast: decimal('appreciation_forecast', { precision: 5, scale: 2 }),
  monthlyRentalEstimate: decimal('monthly_rental_estimate', { precision: 10, scale: 2 }),
  annualRentalEstimate: decimal('annual_rental_estimate', { precision: 10, scale: 2 }),
  marketData: jsonb('market_data').$type<MarketData>(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

interface MarketData {
  comparableSales?: ComparableSale[];
  neighborhoodTrend?: number;
  demandIndex?: number;
  pricePerSqft?: number;
  avgDaysOnMarket?: number;
}

interface ComparableSale {
  address: string;
  price: number;
  soldDate: string;
  areaSqft: number;
}

export type InvestmentMetric = typeof investmentMetrics.$inferSelect;
```

```typescript
// src/db/schema/bookings.ts
import { pgTable, uuid, varchar, text, timestamp, jsonb, foreignKey } from 'drizzle-orm/pg-core';
import { properties } from './properties';
import { users } from './users';

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  requestedDate: timestamp('requested_date').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  notes: text('notes'),
  contactInfo: jsonb('contact_info').$type<ContactInfo>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
```

```typescript
// src/db/schema/testimonials.ts
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, foreignKey } from 'drizzle-orm/pg-core';
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
  rating: integer('rating'), // 1-5 stars
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
```

```typescript
// src/db/schema/blog-articles.ts
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
```

```typescript
// src/db/schema/index.ts
export * from './users';
export * from './properties';
export * from './property-categories';
export * from './property-images';
export * from './property-amenities';
export * from './investment-metrics';
export * from './bookings';
export * from './testimonials';
export * from './blog-articles';
```

### Database Indexes

```typescript
// src/db/indexes.ts
import { index } from 'drizzle-orm/pg-core';

// Properties indexes
export const propertiesCategoryIdx = index('properties_category_idx').on(properties.categoryId);
export const propertiesStatusIdx = index('properties_status_idx').on(properties.status);
export const propertiesFeaturedIdx = index('properties_featured_idx').on(properties.featured);
export const propertiesCityIdx = index('properties_city_idx').on(properties.city);
export const propertiesPriceIdx = index('properties_price_idx').on(properties.price);

// Bookings indexes
export const bookingsStatusIdx = index('bookings_status_idx').on(bookings.status);
export const bookingsDateIdx = index('bookings_date_idx').on(bookings.requestedDate);

// Blog articles indexes
export const blogPublishedIdx = index('blog_published_idx').on(blogArticles.published);
export const blogCategoryIdx = index('blog_category_idx').on(blogArticles.category);
```

---

## 3. API Routes Structure

### API Route Map

```
src/app/api/
├── auth/
│   ├── route.ts                    # POST - Login/Logout
│   ├── register/
│   │   └── route.ts                # POST - User registration
│   └── session/
│       └── route.ts                # GET - Current session
│
├── properties/
│   ├── route.ts                    # GET - List, POST - Create
│   ├── [id]/
│   │   └── route.ts                # GET, PUT, DELETE - Single property
│   ├── featured/
│   │   └── route.ts                # GET - Featured properties
│   └── search/
│       └── route.ts                # POST - Advanced search
│
├── categories/
│   └── route.ts                    # GET - List all categories
│
├── bookings/
│   ├── route.ts                    # GET - List, POST - Create
│   └── [id]/
│       └── route.ts                # GET, PUT - Single booking
│
├── testimonials/
│   └── route.ts                    # GET - List, POST - Create
│
├── blog/
│   ├── route.ts                    # GET - List, POST - Create
│   └── [slug]/
│       └── route.ts                # GET - Single article
│
├── ai/
│   ├── concierge/
│   │   └── route.ts                # POST - AI chat stream
│   └── analysis/
│       └── route.ts                # POST - Investment analysis
│
├── upload/
│   └── route.ts                    # POST - Upload to Vercel Blob
│
└── contact/
    └── route.ts                    # POST - Contact form submission
```

### API Route Implementations

#### Properties API

```typescript
// src/app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyAmenities } from '@/db/schema';
import { eq, and, gte, lte, like, inArray } from 'drizzle-orm';

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    category: searchParams.get('category'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    city: searchParams.get('city'),
    bedrooms: searchParams.get('bedrooms'),
    status: searchParams.get('status') || 'available',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
  };

  try {
    const whereConditions = and(
      eq(properties.status, filters.status),
      eq(properties.published, true),
      filters.category && eq(properties.categoryId, filters.category),
      filters.city && eq(properties.city, filters.city),
      filters.minPrice && gte(properties.price, filters.minPrice),
      filters.maxPrice && lte(properties.price, filters.maxPrice),
      filters.bedrooms && eq(properties.bedrooms, parseInt(filters.bedrooms))
    );

    const [results, total] = await Promise.all([
      db.query.properties.findMany({
        where: whereConditions,
        with: {
          images: { limit: 1 },
          category: true,
        },
        limit: filters.limit,
        offset: (filters.page - 1) * filters.limit,
        orderBy: (properties, { desc }) => [desc(properties.createdAt)],
      }),
      db.select({ count: sql`count(*)` }).from(properties).where(whereConditions),
    ]);

    return NextResponse.json({
      data: results,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: total[0].count,
        totalPages: Math.ceil(total[0].count / filters.limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (admin only)
export async function POST(request: NextRequest) {
  // Auth check middleware would run before this
  const body = await request.json();
  
  try {
    const [property] = await db.insert(properties).values(body).returning();
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
```

#### AI Concierge API

```typescript
// src/app/api/ai/concierge/route.ts
import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/ai/concierge - Stream AI chat response
export async function POST(request: NextRequest) {
  const { message, context } = await request.json();

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an elite real estate concierge for ultra-premium properties. 
                  Be sophisticated, knowledgeable, and helpful. 
                  Current context: ${JSON.stringify(context)}`,
      },
      { role: 'user', content: message },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

#### Upload API

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// POST /api/upload - Upload file to Vercel Blob
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string || 'general';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  try {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
```

---

## 4. Component Hierarchy

### Component Tree

```
src/
├── app/
│   ├── layout.tsx                  # RootLayout
│   ├── page.tsx                    # HomePage
│   ├── properties/
│   │   ├── page.tsx                # PropertiesPage
│   │   └── [slug]/
│   │       └── page.tsx            # PropertyDetailPage
│   ├── about/
│   │   └── page.tsx                # AboutPage
│   ├── blog/
│   │   ├── page.tsx                # BlogPage
│   │   └── [slug]/
│   │       └── page.tsx            # BlogArticlePage
│   └── contact/
│       └── page.tsx                # ContactPage
│
└── components/
    ├── layout/
    │   ├── Header.tsx              # Navigation header
    │   ├── Footer.tsx              # Site footer
    │   ├── Navigation.tsx          # Main navigation
    │   ├── MobileMenu.tsx          # Mobile navigation
    │   └── Sidebar.tsx             # Dashboard sidebar
    │
    ├── ui/
    │   ├── Button.tsx              # Button variants
    │   ├── Card.tsx                # Card container
    │   ├── Input.tsx               # Form inputs
    │   ├── Select.tsx              # Select dropdown
    │   ├── Modal.tsx               # Modal dialog
    │   ├── Badge.tsx               # Status badges
    │   ├── Skeleton.tsx            # Loading skeleton
    │   ├── GlassPanel.tsx          # Glassmorphism panel
    │   └── VideoHero.tsx           # 4K video hero
    │
    ├── sections/
    │   ├── Hero.tsx                # Homepage hero
    │   ├── FeaturedProperties.tsx  # Featured listings
    │   ├── PropertyGrid.tsx        # Property listings grid
    │   ├── Testimonials.tsx        # Client testimonials
    │   ├── About.tsx               # About section
    │   ├── Contact.tsx             # Contact section
    │   └── BlogPreview.tsx         # Blog preview
    │
    ├── properties/
    │   ├── PropertyCard.tsx        # Property card
    │   ├── PropertyGallery.tsx     # Image gallery
    │   ├── PropertyDetails.tsx     # Property info
    │   ├── PropertyMap.tsx         # Location map
    │   ├── PropertyAmenities.tsx   # Amenities list
    │   ├── InvestmentMetrics.tsx   # ROI display
    │   ├── BookingForm.tsx         # Viewing request
    │   └── PropertyFilters.tsx     # Search filters
    │
    ├── ai/
    │   ├── ConciergeChat.tsx       # AI chat interface
    │   ├── InvestmentAnalysis.tsx  # AI analysis display
    │   └── ChatMessage.tsx         # Chat message bubble
    │
    └── forms/
        ├── ContactForm.tsx         # Contact form
        ├── NewsletterForm.tsx      # Newsletter signup
        └── SearchForm.tsx          # Property search
```

### Component Architecture Diagram

```mermaid
graph TB
    subgraph Pages
        Home[HomePage]
        Properties[PropertiesPage]
        PropertyDetail[PropertyDetailPage]
        Blog[BlogPage]
        Contact[ContactPage]
    end

    subgraph Layout
        Header[Header]
        Footer[Footer]
        Nav[Navigation]
    end

    subgraph Sections
        Hero[Hero]
        Featured[FeaturedProperties]
        Testimonials[Testimonials]
        PropertyGrid[PropertyGrid]
    end

    subgraph PropertyComponents
        Card[PropertyCard]
        Gallery[PropertyGallery]
        Details[PropertyDetails]
        Metrics[InvestmentMetrics]
        Booking[BookingForm]
    end

    subgraph UI
        Button[Button]
        GlassPanel[GlassPanel]
        VideoHero[VideoHero]
        Modal[Modal]
    end

    subgraph AI
        Concierge[ConciergeChat]
        Analysis[InvestmentAnalysis]
    end

    Home --> Hero
    Home --> Featured
    Home --> Testimonials
    
    Properties --> PropertyGrid
    PropertyGrid --> Card
    
    PropertyDetail --> Gallery
    PropertyDetail --> Details
    PropertyDetail --> Metrics
    PropertyDetail --> Booking
    PropertyDetail --> Concierge
    
    Header --> Nav
    Nav --> Modal
```

### Key Component Specifications

#### GlassPanel Component

```typescript
// src/components/ui/GlassPanel.tsx
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

// Design: Frosted glass effect with:
// - Background: rgba(255, 255, 255, 0.05)
// - Backdrop blur: 16px
// - Border: 1px solid rgba(255, 255, 255, 0.1)
// - Border radius: 16px
```

#### VideoHero Component

```typescript
// src/components/ui/VideoHero.tsx
interface VideoHeroProps {
  videoUrl: string;
  posterUrl?: string;
  title: string;
  subtitle?: string;
  overlay?: boolean;
}

// Design: Full-viewport 4K video with:
// - Object-fit: cover
// - Dark gradient overlay
// - Centered typography
// - Play/pause on scroll
```

#### PropertyCard Component

```typescript
// src/components/properties/PropertyCard.tsx
interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: number;
    city: string;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    images: { blobUrl: string; altText: string }[];
  };
  variant?: 'default' | 'featured' | 'compact';
}

// Design: Card with:
// - Primary image with hover zoom
// - Glassmorphism price badge
// - Property details overlay
// - Smooth hover animations
```

---

## 5. Edge Config Structure

### Edge Config Schema

```json
{
  "site": {
    "name": "Luxe Estates",
    "tagline": "Ultra-Premium Real Estate",
    "contactEmail": "concierge@luxeestates.com",
    "phone": "+1 (555) 123-4567"
  },
  
  "features": {
    "aiConcierge": true,
    "virtualTours": true,
    "investmentAnalysis": true,
    "newsletter": true,
    "blog": true
  },
  
  "propertyStatuses": [
    { "value": "available", "label": "Available", "color": "#D4AF37" },
    { "value": "reserved", "label": "Reserved", "color": "#4A90D9" },
    { "value": "sold", "label": "Sold", "color": "#2D2D2D" },
    { "value": "rented", "label": "Rented", "color": "#6B6B6B" }
  ],
  
  "propertyCategories": [
    { "slug": "residential", "name": "Residential", "icon": "home" },
    { "slug": "commercial", "name": "Commercial", "icon": "building" },
    { "slug": "villas", "name": "Villas", "icon": "castle" },
    { "slug": "penthouses", "name": "Penthouses", "icon": "building-2" },
    { "slug": "estates", "name": "Estates", "icon": "landmark" }
  ],
  
  "priceRanges": [
    { "min": 0, "max": 1000000, "label": "Under $1M" },
    { "min": 1000000, "max": 5000000, "label": "$1M - $5M" },
    { "min": 5000000, "max": 10000000, "label": "$5M - $10M" },
    { "min": 10000000, "max": null, "label": "$10M+" }
  ],
  
  "cities": [
    "New York",
    "Los Angeles",
    "Miami",
    "San Francisco",
    "Chicago",
    "London",
    "Dubai",
    "Singapore"
  ],
  
  "currencies": {
    "USD": { "symbol": "$", "rate": 1 },
    "EUR": { "symbol": "€", "rate": 0.92 },
    "GBP": { "symbol": "£", "rate": 0.79 },
    "AED": { "symbol": "د.إ", "rate": 3.67 }
  },
  
  "aiPrompts": {
    "conciergeSystemPrompt": "You are an elite real estate concierge...",
    "investmentAnalysisPrompt": "Analyze this property investment..."
  },
  
  "maintenance": {
    "enabled": false,
    "message": "We're performing scheduled maintenance."
  }
}
```

### Edge Config Usage

```typescript
// src/lib/config.ts
import { get } from '@vercel/edge-config';

export async function getSiteConfig() {
  const [site, features, categories] = await Promise.all([
    get('site'),
    get('features'),
    get('propertyCategories'),
  ]);
  
  return { site, features, categories };
}

// In Server Component
export default async function HomePage() {
  const config = await getSiteConfig();
  
  if (!config.features.aiConcierge) {
    // Hide AI features
  }
  
  return <Hero title={config.site.name} />;
}
```

---

## 6. Vercel Blob Organization

### Blob Storage Structure

```
vercel-blob://
├── properties/
│   ├── {property-id}/
│   │   ├── hero/
│   │   │   ├── hero-4k.webp          # 3840x2160
│   │   │   ├── hero-desktop.webp     # 1920x1080
│   │   │   ├── hero-tablet.webp      # 1024x768
│   │   │   └── hero-mobile.webp      # 640x480
│   │   ├── gallery/
│   │   │   ├── 001-full.webp         # 2000x1333
│   │   │   ├── 001-thumb.webp        # 400x267
│   │   │   ├── 002-full.webp
│   │   │   └── ...
│   │   ├── floorplans/
│   │   │   ├── ground-floor.pdf
│   │   │   └── first-floor.pdf
│   │   └── videos/
│   │       ├── tour-4k.mp4           # 4K virtual tour
│   │       └── tour-1080p.mp4        # 1080p fallback
│   └── shared/
│       └── placeholder.webp          # Default image
│
├── users/
│   └── {user-id}/
│       └── avatar.webp
│
├── blog/
│   └── {article-slug}/
│       └── featured.webp
│
├── testimonials/
│   └── {testimonial-id}/
│       └── avatar.webp
│
└── assets/
    ├── hero-video.mp4                # Homepage hero
    ├── logo.svg
    └── icons/
        └── *.svg
```

### Image Optimization Strategy

| Image Type | Format | Dimensions | Quality | Size Target |
|------------|--------|------------|---------|-------------|
| Hero 4K | WebP | 3840x2160 | 85% | < 500KB |
| Hero Desktop | WebP | 1920x1080 | 85% | < 200KB |
| Gallery Full | WebP | 2000x1333 | 85% | < 300KB |
| Gallery Thumb | WebP | 400x267 | 80% | < 30KB |
| Avatar | WebP | 200x200 | 85% | < 20KB |
| Video Tour | MP4 | 3840x2160 | H.265 | < 50MB |

### Blob Upload Utilities

```typescript
// src/lib/blob.ts
import { put, list, del } from '@vercel/blob';

const FOLDER_STRUCTURE = {
  propertyHero: (propertyId: string) => `properties/${propertyId}/hero`,
  propertyGallery: (propertyId: string) => `properties/${propertyId}/gallery`,
  propertyVideos: (propertyId: string) => `properties/${propertyId}/videos`,
  userAvatar: (userId: string) => `users/${userId}`,
  blogFeatured: (slug: string) => `blog/${slug}`,
} as const;

export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  type: 'hero' | 'gallery' | 'floorplan'
) {
  const folder = type === 'hero' 
    ? FOLDER_STRUCTURE.propertyHero(propertyId)
    : FOLDER_STRUCTURE.propertyGallery(propertyId);
    
  const filename = `${folder}/${Date.now()}-${file.name}`;
  
  return put(filename, file, {
    access: 'public',
    addRandomSuffix: true,
  });
}
```

---

## 7. Environment Variables

### Required Environment Variables

```bash
# ===========================================
# DATABASE
# ===========================================
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/luxe_estates?sslmode=require"

# ===========================================
# AUTHENTICATION
# ===========================================
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="https://luxeestates.com"

# ===========================================
# VERCEL BLOB STORAGE
# ===========================================
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxx"

# ===========================================
# VERCEL EDGE CONFIG
# ===========================================
EDGE_CONFIG="https://edge-config.vercel.com/ecfg_xxxxx"
EDGE_CONFIG_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ===========================================
# GROQ AI API
# ===========================================
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ===========================================
# EXTERNAL SERVICES
# ===========================================
# Email Service (Resend, SendGrid, etc.)
EMAIL_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="concierge@luxeestates.com"

# Analytics
NEXT_PUBLIC_ANALYTICS_ID="G-XXXXXXXXXX"

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN="pk.xxxxxxxxxxxxxxxxxxxxxxxx"

# ===========================================
# APPLICATION
# ===========================================
NEXT_PUBLIC_SITE_URL="https://luxeestates.com"
NEXT_PUBLIC_SITE_NAME="Luxe Estates"

# ===========================================
# OPTIONAL ENHANCEMENTS
# ===========================================
# CRM Integration
HUBSPOT_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Payment Processing
STRIPE_SECRET_KEY="your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key_here"

# Social Media
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_LINKEDIN_PARTNER_ID="xxxxxxxxxxxxxxxx"
```

### Environment Variable Usage

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  BLOB_READ_WRITE_TOKEN: z.string(),
  EDGE_CONFIG: z.string().url(),
  GROQ_API_KEY: z.string().startsWith('gsk_'),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## Design System Reference

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-charcoal` | #0A0A0A | Primary background |
| `--color-charcoal-light` | #1A1A1A | Secondary background |
| `--color-charcoal-dark` | #050505 | Deepest background |
| `--color-gold` | #D4AF37 | Primary accent |
| `--color-gold-light` | #E5C76B | Hover states |
| `--color-gold-dark` | #B8960C | Active states |
| `--color-white` | #FFFFFF | Primary text |
| `--color-white-muted` | #B3B3B3 | Secondary text |
| `--color-glass` | rgba(255, 255, 255, 0.05) | Glassmorphism |
| `--color-glass-border` | rgba(255, 255, 255, 0.1) | Glass borders |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Playfair Display | 700 | 72px / 4.5rem |
| H2 | Playfair Display | 600 | 48px / 3rem |
| H3 | Playfair Display | 600 | 32px / 2rem |
| Body | Inter | 400 | 16px / 1rem |
| Small | Inter | 400 | 14px / 0.875rem |
| Caption | Inter | 500 | 12px / 0.75rem |
| Button | Inter | 600 | 14px / 0.875rem |

### Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

---

## Summary

This architecture provides a complete foundation for an ultra-premium real estate platform with:

1. **Edge-First Performance**: Vercel Edge Network for global CDN, Edge Config for dynamic configuration, and Edge Functions for AI streaming
2. **Type-Safe Database**: Complete Drizzle schema with 9 interconnected tables, proper indexes, and TypeScript inference
3. **Scalable Storage**: Organized Vercel Blob structure with optimization strategies for images and videos
4. **AI Integration**: Groq API for ultra-fast AI concierge and investment analysis
5. **Premium Design System**: Dark theme with gold accents, glassmorphism, and elegant typography

The architecture is designed to scale from MVP to enterprise-level traffic while maintaining the premium feel expected of ultra-luxury real estate platforms.
