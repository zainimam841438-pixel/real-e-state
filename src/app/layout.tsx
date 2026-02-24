import type { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { ConciergeChat } from '@/components/ai';
import './globals.css';

export const metadata: Metadata = {
  title: 'LuxeEstates | Ultra-Premium Real Estate',
  description: 'Discover extraordinary properties that define luxury living. Our curated collection represents the finest real estate opportunities worldwide.',
  keywords: ['luxury real estate', 'premium properties', 'villas', 'penthouses', 'estates'],
  authors: [{ name: 'LuxeEstates' }],
  openGraph: {
    title: 'LuxeEstates | Ultra-Premium Real Estate',
    description: 'Discover extraordinary properties that define luxury living.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LuxeEstates',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxeEstates | Ultra-Premium Real Estate',
    description: 'Discover extraordinary properties that define luxury living.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-charcoal text-white antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ConciergeChat />
      </body>
    </html>
  );
}
