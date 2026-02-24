'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PropertyGallery, PropertyAmenities, InvestmentMetrics } from '@/components/properties';
import { Button, GlassPanel, Badge } from '@/components/ui';
import { formatPrice } from '@/lib/utils';

// Demo property data
const demoProperty = {
  id: '1',
  title: 'The Penthouse at One57',
  slug: 'penthouse-one57',
  description: `An extraordinary full-floor penthouse offering unparalleled luxury living in one of Manhattan's most prestigious addresses. This exceptional residence features floor-to-ceiling windows with breathtaking panoramic views of Central Park and the Manhattan skyline.

The interior showcases the finest materials and craftsmanship, including imported Italian marble, custom millwork, and state-of-the-art smart home technology throughout. The gourmet kitchen features top-of-the-line appliances and custom cabinetry.

The primary suite occupies its own wing, offering complete privacy and featuring a spa-like bathroom, custom walk-in closets, and a private sitting area with park views. Additional bedrooms each feature en-suite bathrooms and generous closet space.

Residents enjoy exclusive access to world-class amenities including a private fitness center, spa, swimming pool, and 24-hour concierge and security services.`,
  price: '45000000',
  currency: 'USD',
  city: 'New York',
  country: 'USA',
  address: '157 West 57th Street, PH',
  bedrooms: 5,
  bathrooms: 6,
  areaSqft: '8500',
  yearBuilt: 2014,
  status: 'available',
  featured: true,
  category: { name: 'Penthouses', slug: 'penthouses' },
  images: [
    { id: '1', blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', altText: 'Living room', isPrimary: true },
    { id: '2', blobUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'Kitchen', isPrimary: false },
    { id: '3', blobUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Bedroom', isPrimary: false },
    { id: '4', blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'Bathroom', isPrimary: false },
    { id: '5', blobUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', altText: 'View', isPrimary: false },
  ],
  amenities: [
    { id: '1', name: 'Private Elevator', category: 'indoor', icon: null, description: 'Direct access to residence' },
    { id: '2', name: 'Smart Home System', category: 'indoor', icon: null, description: 'Full automation control' },
    { id: '3', name: 'Wine Cellar', category: 'indoor', icon: null, description: 'Climate-controlled storage' },
    { id: '4', name: 'Home Theater', category: 'indoor', icon: null, description: 'Professional-grade AV system' },
    { id: '5', name: 'Infinity Pool', category: 'outdoor', icon: null, description: 'Private rooftop pool' },
    { id: '6', name: 'Terrace Garden', category: 'outdoor', icon: null, description: 'Landscaped outdoor space' },
    { id: '7', name: '24/7 Security', category: 'security', icon: null, description: 'Round-the-clock protection' },
    { id: '8', name: 'Gated Access', category: 'security', icon: null, description: 'Private entrance' },
    { id: '9', name: 'Spa & Wellness', category: 'lifestyle', icon: null, description: 'Full-service spa facilities' },
    { id: '10', name: 'Concierge', category: 'lifestyle', icon: null, description: 'White-glove service' },
  ],
  investmentMetrics: {
    roiPercentage: '8.5',
    rentalYield: '4.2',
    appreciationForecast: '12.3',
    monthlyRentalEstimate: '150000',
    annualRentalEstimate: '1800000',
    marketData: {
      pricePerSqft: 5294,
      avgDaysOnMarket: 45,
      demandIndex: 87,
    },
  },
};

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<typeof demoProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProperty(demoProperty);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-charcoal-elevated rounded-2xl mb-8" />
            <div className="h-8 bg-charcoal-elevated rounded w-1/2 mb-4" />
            <div className="h-4 bg-charcoal-elevated rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/" className="text-white-subtle hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-white-subtle">/</li>
            <li>
              <Link href="/properties" className="text-white-subtle hover:text-white transition-colors">
                Properties
              </Link>
            </li>
            <li className="text-white-subtle">/</li>
            <li className="text-gold">{property.title}</li>
          </ol>
        </nav>

        {/* Gallery */}
        <div className="mb-12">
          <PropertyGallery images={property.images} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {property.featured && <Badge variant="gold">Featured</Badge>}
                <Badge variant="glass">{property.category.name}</Badge>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {property.title}
              </h1>
              <p className="text-white-muted flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.address}, {property.city}, {property.country}
              </p>
            </div>

            {/* Property Details */}
            <GlassPanel className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-gold">{property.bedrooms}</p>
                  <p className="text-white-subtle text-sm">Bedrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-gold">{property.bathrooms}</p>
                  <p className="text-white-subtle text-sm">Bathrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-gold">
                    {Number(property.areaSqft).toLocaleString()}
                  </p>
                  <p className="text-white-subtle text-sm">Sq Ft</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-display font-bold text-gold">{property.yearBuilt}</p>
                  <p className="text-white-subtle text-sm">Year Built</p>
                </div>
              </div>
            </GlassPanel>

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-white mb-4">About This Property</h2>
              <div className="prose prose-invert max-w-none">
                {property.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-white-muted mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-white mb-6">Amenities & Features</h2>
              <PropertyAmenities amenities={property.amenities} />
            </div>

            {/* Investment Metrics */}
            {property.investmentMetrics && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-white mb-6">Investment Analysis</h2>
                <InvestmentMetrics
                  metrics={property.investmentMetrics}
                  propertyPrice={property.price}
                  currency={property.currency}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <GlassPanel className="p-6">
                <p className="text-white-subtle text-sm mb-2">Asking Price</p>
                <p className="text-4xl font-display font-bold text-gold mb-6">
                  {formatPrice(property.price, property.currency)}
                </p>
                <div className="space-y-3">
                  <Button variant="primary" className="w-full">
                    Schedule Viewing
                  </Button>
                  <Button variant="secondary" className="w-full">
                    Request Info
                  </Button>
                </div>
              </GlassPanel>

              {/* Contact Card */}
              <GlassPanel className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contact Agent</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-semibold text-lg">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">James Davidson</p>
                    <p className="text-white-subtle text-sm">Senior Property Advisor</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white-muted flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +1 (212) 555-0123
                  </p>
                  <p className="text-white-muted flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    james@luxeestates.com
                  </p>
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
