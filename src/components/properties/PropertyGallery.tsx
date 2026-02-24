'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: Array<{
    id: string;
    blobUrl: string;
    altText: string | null;
    isPrimary: boolean | null;
  }>;
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const primaryImage = images.find((img) => img.isPrimary) || images[0];
  const otherImages = images.filter((img) => img.id !== primaryImage?.id).slice(0, 4);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] bg-charcoal-elevated rounded-2xl flex items-center justify-center">
        <p className="text-white-subtle">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {/* Main Image */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => {
            setSelectedIndex(0);
            setIsLightboxOpen(true);
          }}
        >
          <Image
            src={primaryImage.blobUrl}
            alt={primaryImage.altText || 'Property image'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>

        {/* Secondary Images */}
        {otherImages.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setSelectedIndex(index + 1);
              setIsLightboxOpen(true);
            }}
          >
            <Image
              src={image.blobUrl}
              alt={image.altText || 'Property image'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}

        {/* Show More Button */}
        {images.length > 5 && (
          <div
            className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={images[4].blobUrl}
              alt={images[4].altText || 'Property image'}
              fill
              className="object-cover"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                +{images.length - 5} more
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors z-10"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          <button
            onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-6 text-white hover:text-gold transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-6 text-white hover:text-gold transition-colors"
            aria-label="Next image"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Main Image */}
          <div className="relative w-full max-w-6xl h-[80vh] mx-4">
            <Image
              src={images[selectedIndex].blobUrl}
              alt={images[selectedIndex].altText || 'Property image'}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                  index === selectedIndex ? 'ring-2 ring-gold' : 'opacity-50 hover:opacity-100'
                )}
              >
                <Image
                  src={image.blobUrl}
                  alt={image.altText || 'Thumbnail'}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
