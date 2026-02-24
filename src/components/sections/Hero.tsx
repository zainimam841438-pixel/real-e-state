import Link from 'next/link';
import { Button } from '@/components/ui';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-charcoal">
        {/* Placeholder for video/image background */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="text-gold text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Ultra-Premium Real Estate
          </p>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover
            <span className="block text-gold">Extraordinary</span>
            Properties
          </h1>

          {/* Subheading */}
          <p className="text-white-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Curated collection of the world&apos;s most exceptional residences, 
            from breathtaking penthouses to private estates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button variant="primary" size="lg">
                Explore Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg">
                Schedule Consultation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-gold">$2B+</p>
              <p className="text-white-subtle text-sm mt-1">Properties Sold</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-gold">500+</p>
              <p className="text-white-subtle text-sm mt-1">Luxury Listings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-gold">50+</p>
              <p className="text-white-subtle text-sm mt-1">Global Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white-subtle"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
