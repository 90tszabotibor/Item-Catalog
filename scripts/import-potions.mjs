import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const encoded = execFileSync('gh', ['api', 'repos/90tszabotibor/Jewelcrafting-DC-calculator/contents/alchemy.html', '--jq', '.content'], { encoding: 'utf8' });
const html = Buffer.from(encoded.replace(/\s/g, ''), 'base64').toString('utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error('Az alchemy.html scriptje nem található.');
const dataOnly = script.split("document.querySelectorAll('.tab')")[0] + '\n;globalThis.__potions=POTIONS;';
const context = { console };
vm.createContext(context);
vm.runInContext(dataOnly, context);
const potions = context.__potions;
const target = '/Users/szabotibor/Desktop/DnD - dr 1502/Items/Potions';
mkdirSync(target, { recursive: true });

for (const potion of potions) {
  const ingredients = potion.ingredients.map((item) => `- ${item.qty}× ${item.name}`).join('\n');
  const body = [
    potion.desc,
    '',
    `**Készítési DC:** ${potion.dc ?? '–'}`,
    `**Ár:** ${potion.price} arany`,
    `**Készítési idő:** ${potion.time ?? '–'}`,
    `**Típus:** ${potion.tags.join(', ')}`,
    '',
    '**Alapanyagok**',
    ingredients,
    '',
  ].join('\n');
  writeFileSync(`${target}/${potion.name}.md`, body);
}
console.log(`${potions.length} potion tárgylap létrehozva.`);
