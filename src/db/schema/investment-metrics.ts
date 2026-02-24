import { pgTable, uuid, decimal, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { properties } from './properties';

interface ComparableSale {
  address: string;
  price: number;
  soldDate: string;
  areaSqft: number;
}

export interface MarketData {
  comparableSales?: ComparableSale[];
  neighborhoodTrend?: number;
  demandIndex?: number;
  pricePerSqft?: number;
  avgDaysOnMarket?: number;
}

export const investmentMetrics = pgTable('investment_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'cascade' }).notNull().unique(),
  roiPercentage: decimal('roi_percentage', { precision: 5, scale: 2 }),
  rentalYield: decimal('rental_yield', { precision: 5, scale: 2 }),
  appreciationForecast: decimal('appreciation_forecast', { precision: 5, scale: 2 }),
  monthlyRentalEstimate: decimal('monthly_rental_estimate', { precision: 10, scale: 2 }),
  annualRentalEstimate: decimal('annual_rental_estimate', { precision: 10, scale: 2 }),
  marketData: jsonb('market_data').$type<MarketData>(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

export type InvestmentMetric = typeof investmentMetrics.$inferSelect;
export type NewInvestmentMetric = typeof investmentMetrics.$inferInsert;
