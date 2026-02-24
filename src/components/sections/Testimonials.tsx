import { GlassPanel } from '@/components/ui';

const testimonials = [
  {
    id: '1',
    clientName: 'Alexander Mitchell',
    clientTitle: 'CEO',
    clientCompany: 'Mitchell Ventures',
    content:
      'LuxeEstates provided an exceptional experience in finding our dream penthouse. Their attention to detail and understanding of our needs was unparalleled.',
    rating: 5,
  },
  {
    id: '2',
    clientName: 'Victoria Chen',
    clientTitle: 'Art Collector',
    clientCompany: 'Private Collector',
    content:
      'The team at LuxeEstates understands luxury at its core. They found us a property that perfectly matches our lifestyle and investment goals.',
    rating: 5,
  },
  {
    id: '3',
    clientName: 'James Richardson',
    clientTitle: 'Entrepreneur',
    clientCompany: 'Tech Innovations Inc.',
    content:
      'Outstanding service from start to finish. The investment analysis provided invaluable insights that helped us make the right decision.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-charcoal">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
            Client Stories
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <GlassPanel key={testimonial.id} className="p-8">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-white-muted mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold font-semibold text-lg">
                    {testimonial.clientName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.clientName}</p>
                  <p className="text-white-subtle text-sm">
                    {testimonial.clientTitle}, {testimonial.clientCompany}
                  </p>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
