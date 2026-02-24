import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyAmenities, investmentMetrics, propertyCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/properties/[slug] - Get single property
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);

    if (!property.length) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const propertyData = property[0];

    // Get related data in parallel
    const [images, amenities, metrics, category] = await Promise.all([
      db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, propertyData.id))
        .orderBy(propertyImages.sortOrder),
      db
        .select()
        .from(propertyAmenities)
        .where(eq(propertyAmenities.propertyId, propertyData.id)),
      db
        .select()
        .from(investmentMetrics)
        .where(eq(investmentMetrics.propertyId, propertyData.id))
        .limit(1),
      propertyData.categoryId
        ? db
            .select()
            .from(propertyCategories)
            .where(eq(propertyCategories.id, propertyData.categoryId))
            .limit(1)
        : null,
    ]);

    return NextResponse.json({
      property: {
        ...propertyData,
        category: category?.[0] || null,
        images,
        amenities,
        investmentMetrics: metrics[0] || null,
      },
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
