import CatalogClient from './CatalogClient';
import { getPublicCatalogItems } from '@/lib/catalog-store';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const catalogItems = await getPublicCatalogItems();
  return <CatalogClient catalogItems={catalogItems} />;
}
