import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wide transition-all duration-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gold text-charcoal hover:bg-gold-light hover:-translate-y-0.5 focus:ring-gold',
      secondary: 'bg-transparent text-white border border-white/10 hover:border-gold hover:text-gold focus:ring-gold',
      ghost: 'bg-white/5 text-white backdrop-blur-md hover:bg-white/10 focus:ring-white/20',
      gold: 'bg-transparent text-gold border border-gold hover:bg-gold/10 focus:ring-gold',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
