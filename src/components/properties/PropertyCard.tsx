import Image from 'next/image';
import Link from 'next/link';
import { Badge, GlassPanel } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import type { Property, PropertyImage } from '@/db/schema';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: string | number;
    currency: string;
    city: string;
    country: string;
    bedrooms: number | null;
    bathrooms: number | null;
    areaSqft: string | number;
    status: string;
    featured: boolean;
    images?: Pick<PropertyImage, 'blobUrl' | 'altText'>[];
  };
  variant?: 'default' | 'featured' | 'compact';
}

export function PropertyCard({ property, variant = 'default' }: PropertyCardProps) {
  const primaryImage = property.images?.[0];
  const isFeatured = property.featured;
  const isAvailable = property.status === 'available';

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <article className="relative bg-charcoal-light rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.blobUrl}
              alt={primaryImage.altText || property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-charcoal-elevated flex items-center justify-center">
              <span className="text-white-subtle">No image available</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isFeatured && (
              <Badge variant="gold">Featured</Badge>
            )}
            {!isAvailable && (
              <Badge variant="glass">{property.status}</Badge>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4">
            <GlassPanel className="px-4 py-2" hover={false}>
              <span className="text-gold font-display text-xl font-semibold">
                {formatPrice(property.price, property.currency)}
              </span>
            </GlassPanel>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">
            {property.title}
          </h3>

          <p className="text-white-muted text-sm mb-4">
            {property.city}, {property.country}
          </p>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-white-subtle text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{Number(property.areaSqft).toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
