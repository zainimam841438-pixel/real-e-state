import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

const blurValues = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

export function GlassPanel({
  children,
  className,
  hover = true,
  blur = 'lg',
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'bg-white/5 border border-white/10 rounded-2xl',
        blurValues[blur],
        hover && 'transition-all duration-250 hover:bg-white/8 hover:border-white/15',
        className
      )}
    >
      {children}
    </div>
  );
}

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  onClick,
  interactive = true,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden',
        interactive && 'transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:-translate-y-1',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
