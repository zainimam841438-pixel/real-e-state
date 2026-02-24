import { Metadata } from 'next';
import { PropertyDetailPage } from './PropertyDetailPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ')} | LuxeEstates`,
    description: 'View this ultra-premium property on LuxeEstates.',
  };
}

export default function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  return <PropertyDetailPage params={params} />;
}
