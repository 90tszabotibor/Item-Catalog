import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const campaignRoot = '/Users/szabotibor/Desktop/DnD - dr 1502';
const campaign = join(campaignRoot, 'Items');
const auroraPath = '/Users/szabotibor/Desktop/DnD - dr 1502/Knowledge base/Aurora Katalógusháza.md';
const availableFiles = [
  ...readdirSync(campaignRoot).filter((name) => name.endsWith('.md')).map((name) => join(campaignRoot, name)),
  ...readdirSync(campaign).filter((name) => name.endsWith('.md')).map((name) => join(campaign, name)),
  ...readdirSync(join(campaign, 'Equipement')).filter((name) => name.endsWith('.md')).map((name) => join(campaign, 'Equipement', name)),
  ...readdirSync(join(campaign, 'Potions')).filter((name) => name.endsWith('.md')).map((name) => join(campaign, 'Potions', name)),
];
const fileByName = new Map(availableFiles.map((file) => [basename(file, '.md'), file]));
const auroraItemNames = [...readFileSync(auroraPath, 'utf8').matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => match[1]);
const files = [...new Set(auroraItemNames)].map((name) => fileByName.get(name)).filter(Boolean);

const classify = (name, text) => {
  const value = `${name} ${text}`.toLowerCase();
  if (/potion|elixir|poison|dragon rum|incense|powder|ellenszer|csillapító|stout of valor/.test(value)) return 'Főzet';
  if (/\bstaff\b|\bwand\b/.test(value)) return 'Fegyver';
  if (/shatter shard/.test(value)) return 'Mágikus tárgy';
  if (/broom of flying|decanter of endless water/.test(value)) return 'Mágikus tárgy';
  if (/misztikus rúnakő|\borb\b|prismatic psychedelic peepers|tigereye monocle of darkvision/.test(value)) return 'Mágikus tárgy';
  if (/\bamulet\b|\bring\b|earring|circlet of blasting|diadem of arcane knowledge|braclet of sleight hands/.test(value)) return 'Ékszer';
  if (/lightbringer/.test(value)) return 'Fegyver';
  if (/armor|helmet|sisak|cloak|cloak|coat|láncing|vestment|fur|daróc/.test(value)) return 'Páncél';
  if (/boot|gauntlet|bracer|ring|amulet|belt|circlet|diadem|monocle|braclet/.test(value)) return 'Páncél';
  if (/sword|rapier|mace|maul|javelin|hammer|sickle|dagger|fegyver/.test(value)) return 'Fegyver';
  if (/wand|staff|orb|scepter|focus|gömb|pálca/.test(value)) return 'Fókusz';
  if (/scroll|bomb|shard|fenőkő|rúnakő/.test(value)) return 'Fogyóeszköz';
  return 'Mágikus tárgy';
};
const clean = (text, hidePreparation = false) => (hidePreparation ? text
  .replace(/^\s*\*\*Alapanyagok\*\*[\s\S]*$/gim, '')
  .replace(/^\s*\*\*(?:Készítési DC|Készítési idő|Típus):\*\*[^\n]*$/gim, '')
  : text)
  .replace(/!\[\[[^\]]+\]\]/g, '')
  .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
  .replace(/^!?[^\n]*(?:Gemini_Generated_Image|\.(?:jpe?g|png|webp|gif))[^\n]*$/gim, '')
  .replace(/^\s*(?:\*\*Ár:\*\*\s*)?[\d .]+\s*arany\s*$/gim, '')
  .replace(/\[\[([^\]]+)\]\]/g, '$1')
  .replace(/^#+\s*/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();
const summary = (text, hidePreparation = false) => clean(text, hidePreparation).split(/\n\s*\n|\n/).find((line) => line.trim() && !/^\*\*/.test(line))?.replace(/^[-*]\s*/, '').slice(0, 170) || 'Ismeretlen eredetű mágikus tárgy.';
const price = (text) => {
  const matches = [...text.matchAll(/([\d .]+)\s*(?:arany|Arany)/g)];
  if (!matches.length) return null;
  return Number(matches.at(-1)[1].replace(/[ .]/g, '')) || null;
};
const items = files.map((file, id) => {
  const raw = readFileSync(file, 'utf8').trim();
  const name = basename(file, '.md').replaceAll('ressistance', 'resistance').replaceAll('wishdom', 'wisdom').replaceAll('Cloack', 'Cloak');
  const category = classify(name, raw);
  const hidePreparation = category === 'Főzet';
  return { id: id + 1, name, category, price: price(raw), summary: summary(raw, hidePreparation), details: clean(raw, hidePreparation) };
}).filter((item) => item.details).sort((a, b) => a.name.localeCompare(b.name, 'hu'));

writeFileSync(new URL('../app/items.generated.ts', import.meta.url), `export const items = ${JSON.stringify(items, null, 2)} as const;\n`);
console.log(`${items.length} Aurora-tárgy feldolgozva.`);
