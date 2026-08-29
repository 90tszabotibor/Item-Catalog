import CatalogClient from '../CatalogClient';
import { allCatalogItems } from '../catalog-data';

export default function ItemsPage() {
  return <CatalogClient catalogItems={allCatalogItems} />;
}
