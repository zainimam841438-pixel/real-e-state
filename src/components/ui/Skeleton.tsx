import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-white/5',
        variants[variant],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-charcoal-light rounded-2xl overflow-hidden">
      <Skeleton className="w-full h-64" />
      <div className="p-6 space-y-4">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-1/2 h-4" />
        <div className="flex gap-4">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );
}

export function PropertiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
