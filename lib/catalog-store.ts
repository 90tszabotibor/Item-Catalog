import 'server-only';
import { createClient } from '@vercel/edge-config';
import { allCatalogItems, itemKey } from '@/app/catalog-data';

const allKeys = allCatalogItems.map((item) => itemKey(item.name));
const newlyAddedKeys = ["Evoker's Robe", 'Moonflower Diadem', 'Veil of Agony', 'Tears of the Frostmaiden'].map(itemKey);

export async function getEnabledItemKeys() {
  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) return allKeys;
  const stored = await createClient(connectionString).get<unknown[]>('enabledItems');
  if (!Array.isArray(stored)) return allKeys;
  const known = new Set(allKeys);
  return [...new Set([
    ...stored.filter((value): value is string => typeof value === 'string' && known.has(value)),
    ...newlyAddedKeys,
  ])];
}

export async function getPublicCatalogItems() {
  try {
    const enabled = new Set(await getEnabledItemKeys());
    return allCatalogItems.filter((item) => enabled.has(itemKey(item.name)));
  } catch (error) {
    console.error('A portékalista nem tölthető be, minden tárgy megjelenik.', error);
    return allCatalogItems;
  }
}
