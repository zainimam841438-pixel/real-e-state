import Link from 'next/link';
import { PropertyCard } from '@/components/properties';
import { Button } from '@/components/ui';

// Demo data for featured properties
const demoProperties = [
  {
    id: '1',
    title: 'The Penthouse at One57',
    slug: 'penthouse-one57',
    price: '45000000',
    currency: 'USD',
    city: 'New York',
    country: 'USA',
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: '8500',
    status: 'available',
    featured: true,
    images: [
      {
        blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        altText: 'Luxury penthouse exterior',
      },
    ],
  },
  {
    id: '2',
    title: 'Villa Serenita',
    slug: 'villa-serenita',
    price: '28500000',
    currency: 'USD',
    city: 'Miami Beach',
    country: 'USA',
    bedrooms: 7,
    bathrooms: 9,
    areaSqft: '12000',
    status: 'available',
    featured: true,
    images: [
      {
        blobUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
        altText: 'Miami villa with pool',
      },
    ],
  },
  {
    id: '3',
    title: 'Sky Residence',
    slug: 'sky-residence',
    price: '18000000',
    currency: 'USD',
    city: 'Los Angeles',
    country: 'USA',
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: '6200',
    status: 'available',
    featured: true,
    images: [
      {
        blobUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        altText: 'Modern LA residence',
      },
    ],
  },
];

export function FeaturedProperties() {
  return (
    <section className="py-24 bg-charcoal-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
            Exclusive Listings
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Featured Properties
          </h2>
          <p className="text-white-muted max-w-2xl mx-auto">
            Handpicked selection of our most distinguished properties, 
            each offering unparalleled luxury and exceptional craftsmanship.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/properties">
            <Button variant="gold" size="lg">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
