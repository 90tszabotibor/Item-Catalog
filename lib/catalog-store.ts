import 'server-only';
import { createClient } from '@vercel/edge-config';
import { allCatalogItems, itemKey } from '@/app/catalog-data';

const allKeys = allCatalogItems.map((item) => itemKey(item.name));

export async function getEnabledItemKeys() {
  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) return allKeys;
  const stored = await createClient(connectionString).get<unknown[]>('enabledItems');
  if (!Array.isArray(stored)) return allKeys;
  const known = new Set(allKeys);
  return stored.filter((value): value is string => typeof value === 'string' && known.has(value));
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

export async function saveEnabledItemKeys(keys: string[]) {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const accessToken = process.env.EDGE_CONFIG_WRITE_TOKEN;
  const teamId = process.env.EDGE_CONFIG_TEAM_ID;
  if (!edgeConfigId || !accessToken) throw new Error('Az Edge Config írási hozzáférése nincs beállítva.');
  const known = new Set(allKeys);
  const sanitized = [...new Set(keys.filter((key) => known.has(key)))];
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items${query}`, {
    method: 'PATCH',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ items: [{ operation: 'upsert', key: 'enabledItems', value: sanitized }] }),
  });
  if (!response.ok) throw new Error(`Az Edge Config mentése sikertelen (${response.status}).`);
  return sanitized;
}
