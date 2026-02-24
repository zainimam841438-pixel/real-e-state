import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyCategories } from '@/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const city = searchParams.get('city');
  const bedrooms = searchParams.get('bedrooms');
  const status = searchParams.get('status') || 'available';
  const featured = searchParams.get('featured');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    const conditions = [
      eq(properties.status, status),
      eq(properties.published, true),
    ];

    if (category) {
      const categoryRecord = await db.query.propertyCategories.findFirst({
        where: eq(propertyCategories.slug, category),
      });
      if (categoryRecord) {
        conditions.push(eq(properties.categoryId, categoryRecord.id));
      }
    }

    if (city) {
      conditions.push(eq(properties.city, city));
    }

    if (minPrice) {
      conditions.push(gte(properties.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(properties.price, maxPrice));
    }

    if (bedrooms) {
      conditions.push(eq(properties.bedrooms, parseInt(bedrooms)));
    }

    if (featured === 'true') {
      conditions.push(eq(properties.featured, true));
    }

    const whereClause = and(...conditions);

    const offset = (page - 1) * limit;

    const [results, totalResult] = await Promise.all([
      db
        .select({
          id: properties.id,
          title: properties.title,
          slug: properties.slug,
          price: properties.price,
          currency: properties.currency,
          city: properties.city,
          country: properties.country,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          areaSqft: properties.areaSqft,
          status: properties.status,
          featured: properties.featured,
          category: {
            id: propertyCategories.id,
            name: propertyCategories.name,
            slug: propertyCategories.slug,
          },
        })
        .from(properties)
        .leftJoin(propertyCategories, eq(properties.categoryId, propertyCategories.id))
        .where(whereClause)
        .orderBy(desc(properties.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(properties)
        .where(whereClause),
    ]);

    // Get images for each property
    const propertyIds = results.map((p) => p.id);
    const images = propertyIds.length > 0
      ? await db
          .select()
          .from(propertyImages)
          .where(sql`${propertyImages.propertyId} IN ${propertyIds}`)
      : [];

    const propertiesWithImages = results.map((property) => ({
      ...property,
      images: images.filter((img) => img.propertyId === property.id),
    }));

    const total = Number(totalResult[0]?.count || 0);

    return NextResponse.json({
      data: propertiesWithImages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
