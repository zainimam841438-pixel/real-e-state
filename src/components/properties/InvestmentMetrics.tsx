import { GlassPanel } from '@/components/ui';
import { formatPrice, formatNumber } from '@/lib/utils';

interface InvestmentMetricsProps {
  metrics: {
    roiPercentage: string | null;
    rentalYield: string | null;
    appreciationForecast: string | null;
    monthlyRentalEstimate: string | null;
    annualRentalEstimate: string | null;
    marketData?: {
      pricePerSqft?: number;
      avgDaysOnMarket?: number;
      demandIndex?: number;
    } | null;
  };
  propertyPrice: string | number;
  currency: string;
}

export function InvestmentMetrics({ metrics, propertyPrice, currency }: InvestmentMetricsProps) {
  const stats = [
    {
      label: 'Expected ROI',
      value: metrics.roiPercentage ? `${metrics.roiPercentage}%` : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Rental Yield',
      value: metrics.rentalYield ? `${metrics.rentalYield}%` : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Monthly Rental',
      value: metrics.monthlyRentalEstimate
        ? formatPrice(metrics.monthlyRentalEstimate, currency)
        : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Appreciation Forecast',
      value: metrics.appreciationForecast ? `${metrics.appreciationForecast}%` : 'N/A',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const marketStats = [
    {
      label: 'Price per Sqft',
      value: metrics.marketData?.pricePerSqft
        ? formatPrice(metrics.marketData.pricePerSqft, currency)
        : 'N/A',
    },
    {
      label: 'Avg Days on Market',
      value: metrics.marketData?.avgDaysOnMarket
        ? `${metrics.marketData.avgDaysOnMarket} days`
        : 'N/A',
    },
    {
      label: 'Demand Index',
      value: metrics.marketData?.demandIndex
        ? `${metrics.marketData.demandIndex}/100`
        : 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassPanel key={stat.label} className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-4">
              {stat.icon}
            </div>
            <p className="text-2xl font-display font-semibold text-white mb-1">
              {stat.value}
            </p>
            <p className="text-white-subtle text-sm">{stat.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Market Data */}
      {metrics.marketData && (
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Market Insights</h3>
          <div className="grid grid-cols-3 gap-6">
            {marketStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold text-white">{stat.value}</p>
                <p className="text-white-subtle text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Annual Projection */}
      {metrics.annualRentalEstimate && (
        <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white-subtle text-sm mb-1">Projected Annual Rental Income</p>
              <p className="text-3xl font-display font-bold text-gold">
                {formatPrice(metrics.annualRentalEstimate, currency)}
              </p>
            </div>
            <div className="hidden md:block">
              <svg className="w-16 h-16 text-gold/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
