import { Metadata } from 'next';
import { PropertiesPageContent } from './PropertiesPageContent';

export const metadata: Metadata = {
  title: 'Properties | LuxeEstates',
  description: 'Browse our exclusive collection of ultra-premium properties worldwide.',
};

export default function PropertiesPage() {
  return <PropertiesPageContent />;
}
