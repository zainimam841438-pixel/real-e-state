import { GlassPanel } from '@/components/ui';

interface PropertyAmenitiesProps {
  amenities: Array<{
    id: string;
    name: string;
    category: string;
    icon: string | null;
    description: string | null;
  }>;
}

const categoryLabels: Record<string, string> = {
  indoor: 'Indoor Features',
  outdoor: 'Outdoor Features',
  security: 'Security',
  lifestyle: 'Lifestyle',
};

const categoryOrder = ['indoor', 'outdoor', 'security', 'lifestyle'];

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, typeof amenities>);

  return (
    <div className="space-y-8">
      {categoryOrder.map((category) => {
        const items = groupedAmenities[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-white mb-4">
              {categoryLabels[category] || category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((amenity) => (
                <GlassPanel key={amenity.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      {amenity.icon ? (
                        <span className="text-gold text-lg">{amenity.icon}</span>
                      ) : (
                        <svg
                          className="w-5 h-5 text-gold"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{amenity.name}</h4>
                      {amenity.description && (
                        <p className="text-white-subtle text-xs mt-1">{amenity.description}</p>
                      )}
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
