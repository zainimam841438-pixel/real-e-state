'use client';

import { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/properties';
import { Button, GlassPanel, Input, PropertyCardSkeleton } from '@/components/ui';

// Demo properties data
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
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', altText: 'Luxury penthouse' }],
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
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', altText: 'Miami villa' }],
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
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', altText: 'LA residence' }],
  },
  {
    id: '4',
    title: 'Oceanfront Estate',
    slug: 'oceanfront-estate',
    price: '35000000',
    currency: 'USD',
    city: 'Malibu',
    country: 'USA',
    bedrooms: 6,
    bathrooms: 8,
    areaSqft: '9500',
    status: 'available',
    featured: false,
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', altText: 'Malibu estate' }],
  },
  {
    id: '5',
    title: 'Central Park Tower',
    slug: 'central-park-tower',
    price: '55000000',
    currency: 'USD',
    city: 'New York',
    country: 'USA',
    bedrooms: 6,
    bathrooms: 7,
    areaSqft: '10000',
    status: 'available',
    featured: true,
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', altText: 'Central Park Tower' }],
  },
  {
    id: '6',
    title: 'Beverly Hills Mansion',
    slug: 'beverly-hills-mansion',
    price: '42000000',
    currency: 'USD',
    city: 'Beverly Hills',
    country: 'USA',
    bedrooms: 8,
    bathrooms: 10,
    areaSqft: '15000',
    status: 'available',
    featured: false,
    images: [{ blobUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', altText: 'Beverly Hills mansion' }],
  },
];

const categories = [
  { slug: 'all', name: 'All Properties' },
  { slug: 'residential', name: 'Residential' },
  { slug: 'commercial', name: 'Commercial' },
  { slug: 'villas', name: 'Villas' },
  { slug: 'penthouses', name: 'Penthouses' },
];

export function PropertiesPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = demoProperties.filter((property) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Properties
          </h1>
          <p className="text-white-muted max-w-2xl mx-auto">
            Explore our curated collection of exceptional properties, each offering 
            unparalleled luxury and sophisticated living.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search by location or property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-gold text-charcoal'
                    : 'bg-white/5 text-white-muted hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-white-muted">
            Showing{' '}
            <span className="text-white font-semibold">{filteredProperties.length}</span>{' '}
            properties
          </p>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <GlassPanel className="p-12 text-center">
            <svg
              className="w-16 h-16 text-white-subtle mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
            <p className="text-white-muted mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Clear Filters
            </Button>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
