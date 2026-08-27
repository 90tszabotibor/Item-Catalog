import 'server-only';
import { neon } from '@neondatabase/serverless';
import { allCatalogItems, itemKey } from '@/app/catalog-data';

const allKeys = allCatalogItems.map((item) => itemKey(item.name));

const databaseUrl = () => process.env.DATABASE_URL;

async function ensureTable() {
  const url = databaseUrl();
  if (!url) return null;
  const sql = neon(url);
  await sql`
    create table if not exists catalog_settings (
      id text primary key,
      enabled_items jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  return sql;
}

export async function getEnabledItemKeys() {
  const sql = await ensureTable();
  if (!sql) return allKeys;
  const rows = await sql`select enabled_items from catalog_settings where id = 'current' limit 1`;
  if (!rows.length || !Array.isArray(rows[0].enabled_items)) return allKeys;
  const known = new Set(allKeys);
  return (rows[0].enabled_items as unknown[]).filter((value): value is string => typeof value === 'string' && known.has(value));
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
  const sql = await ensureTable();
  if (!sql) throw new Error('A DATABASE_URL nincs beállítva.');
  const known = new Set(allKeys);
  const sanitized = [...new Set(keys.filter((key) => known.has(key)))];
  const payload = JSON.stringify(sanitized);
  await sql`
    insert into catalog_settings (id, enabled_items, updated_at)
    values ('current', ${payload}::jsonb, now())
    on conflict (id) do update
      set enabled_items = excluded.enabled_items,
          updated_at = excluded.updated_at
  `;
  return sanitized;
}

