'use client';

import { useEffect, useState } from 'react';
import translations from './item-translations.generated.json';
import type { CatalogItem } from './catalog-data';

export type Language = 'hu' | 'en';

const categoryLabels: Record<string, [string, string]> = {
  'Főzet': ['Főzet', 'Potion'], 'Fegyver': ['Fegyver', 'Weapon'], 'Páncél': ['Páncél', 'Armor'],
  'Ékszer': ['Ékszer', 'Jewelry'], 'Fókusz': ['Fókusz', 'Focus'], 'Fogyóeszköz': ['Fogyóeszköz', 'Consumable'],
  'Mágikus tárgy': ['Mágikus tárgy', 'Magic item'],
};

const huNames: Record<string, string> = {
  'Amulet of wisdom':'Bölcsesség amulettje','Basic poison':'Egyszerű méreg','Belt of the Hill Giant':'Hegyi óriás öve',
  'Black Panter Studded Armor':'Fekete párduc szegecselt bőrpáncél','Black Wolf Fur':'Fekete farkasprém','Blinkdagger':'Villanótőr',
  'Boots of Striding and Springing':'Lépés és szökkenés csizmája','Bracer of fire resistance':'Tűzellenállás karperece',
  'Bracers of Defense':'Védelem karperecei','Braclet of sleight hands':'Fürge kezek karkötője','Broom of Flying':'Repülő seprű',
  'Catpaw boots':'Macskatalp csizma','Circlet of scorching':'Gyújtogatók diadémja','Cloak of Invisibility':'Láthatatlanság köpenye',
  'Crystal ball':'Kristálygömb','Decanter of Endless Water':'Kifogyhatatlan vizű kancsó','Diadem of arcane knowledge':'Arkán tudás diadémja',
  'Displacer’s Deceptive Duster':'Délibábos Doromboló Duvad Daróc','Dragon rum':'Sárkányrum','Earrings of charm':'Bájolás fülbevalói',
  'Elixir of Aboleth':'Aboleth elixírje','Elixir of Acid Resistance':'Savellenállás elixírje','Elixir of Bear':'Medve elixírje',
  'Elixir of Bloodlust':'Vérszomj elixírje','Elixir of Cloud Giant':'Felhőóriás elixírje','Elixir of Cold Resistance':'Hidegellenállás elixírje',
  'Elixir of Fire Resistance':'Tűzellenállás elixírje','Elixir of Hill Giant':'Hegyi óriás elixírje','Elixir of Lightning Resistance':'Villámellenállás elixírje',
  'Elixir of Lynx':'Hiúz elixírje','Elixir of Necrotic Resistance':'Nekrotikus ellenállás elixírje','Elixir of Owl':'Bagoly elixírje',
  'Elixir of Ox':'Ökör elixírje','Elixir of Peacock':'Páva elixírje','Elixir of Poison Resistance':'Méregellenállás elixírje',
  'Elixir of Psychic Resistance':'Pszichikus ellenállás elixírje','Elixir of Radiant Resistance':'Sugárzó ellenállás elixírje','Elixir of Stag':'Szarvas elixírje',
  'Elixir of Tressym':'Tressym elixírje','Flametongue shortsword':'Lángnyelv rövidkard','Gauntlet of strong hands':'Erős kezek kesztyűje',
  'Greater healing potion':'Nagy gyógyító főzet','Healing potion':'Gyógyító főzet','Immovable Rod':'Mozdíthatatlan rúd',
  'Javelin of Thunder Peaks':'Mennydörgő csúcsok dárdája','Legbreaker':'Lábtörő','Lightbringer':'Fényhozó','Mithral Láncing':'Mithral láncing',
  'Orb of Detect magic':'Mágiadetektáló gömb','Potion of arcane recovery':'Arkán visszanyerés főzete','Potion of feather fall':'Tollhullás főzete',
  'Potion of Invisibility':'Láthatatlanság főzete','Potion of Speed':'Gyorsaság főzete','Prismatic Psychedelic Peepers':'Prizmatikus Pszichedelikus Pápaszem',
  'Purifying Incense':'Tisztító füstölő','Quickly Powder':'Hamar por','Reinforced Leather Coat':'Megerősített bőrkabát',
  'Ring of Arcane Recovery':'Arkán visszanyerés gyűrűje','Ring of Brightness':'Fényesség gyűrűje','Ring of Remove Curse':'Átoktörés gyűrűje',
  'Ring of Spell Storing':'Varázslattárolás gyűrűje','Ritual Dagger':'Rituális tőr','Scrying Eye Orb':'Fürkésző szem gömbje',
  'Shatter shard':'Törőszilánk','Staff of Healing':'Gyógyítás botja','Staff of Sleep':'Álmok botja','Strong poison':'Erős méreg',
  'Sunshine-Singer’s Solar Serenade Sickle':'Szolmizáló Szoláris Szerenád-Sugársarló','Tigereye Monocle of Darkvision':'Sötétlátás tigrisszem monoklija',
  'Vestments of the Noble Snow-Leopard':'A Nemes Hópárduc Öltözéke','Wand of Ice Knife':'Jégcsap pálca',
  'Wand of magic missile':'Mágikus lövedék pálcája','Wand of Sickeness':'Betegségek pálcája',
  'Cast-Iron Critical Clanger':'A Konyhai Kritikus Kongató','Handbreaker':'Kéztörő','Misztikus Rúnakő':'Misztikus Rúnakő',
  "Evoker's Robe":'Evokátor köntöse','Moonflower Diadem':'Moonflower Diadem','Veil of Agony':'Gyötrelem fátyla',
  'Tears of the Frostmaiden':'A Fagyistennő könnyei','Lost Dawn':'Elveszett Hajnal','Trailstone of the Known Path':'Az Ismert Ösvény Köve','Zsebvilág':'Zsebvilág',
};

const enNames: Record<string, string> = {
  'Adamantin Sisak':'Adamantine Helmet','Black Panter Studded Armor':'Black Panther Studded Armor',
  'Braclet of sleight hands':'Bracelet of Sleight of Hand','Méreg ellenszer':'Antidote','Misztikus Rúnakő':'Mystic Runestone',
  'Mithral Láncing':'Mithral Chain Shirt','Wand of magic missile':'Wand of Magic Missile','Wand of Sickeness':'Wand of Sickness',
  'Flametongue shortsword':'Flametongue Shortsword','Gauntlet of strong hands':'Gauntlet of Strong Hands','Zsebvilág':'Pocket World',
};

const repairEnglish = (value: string) => value
  .replaceAll('* *', '**').replaceAll('♪', '**').replaceAll('rescue boxes', 'saving throws').replaceAll('rescue balls', 'saving throws')
  .replaceAll('rescue throw', 'saving throw').replaceAll('rescue shot', 'saving throw').replaceAll('rescue bar', 'saving throw')
  .replaceAll('wound throwing', 'damage rolls').replaceAll('wound', 'damage').replaceAll('trials', 'checks')
  .replaceAll('Usage: For a long rest 3x', 'Uses: 3x per long rest').replaceAll('Usage: 1 x per long rest', 'Use: 1x per long rest')
  .replaceAll('For a long rest 3x', '3x per long rest').replaceAll('Focus: yes', 'Concentration: Yes')
  .replaceAll('You can blow the ', 'You can cast the ').replaceAll('You can burn the ', 'You can cast the ').replaceAll(' is fired at a long rest of 1x', ' can be cast 1x per long rest');

const enDetailOverrides: Record<string, string> = {
  "Evoker's Robe": '**+1 Evocation**\n\n**Evoker’s Might:**\n\nUse: 1x per long rest\n\nYou can cast one prepared 1st-level Evocation spell without expending a spell slot.',
  'Moonflower Diadem': '**+1 Charisma**\n\n**Blinding Step:**\n\nAfter using Misty Step, you can create a brilliant flash within 10 feet. Creatures in the area must succeed on a **DC 17 Wisdom saving throw** or become Blinded.\n\n**Blessing of Evermeet:**\n\nActivation: Reaction, when the wearer or an ally within 30 feet is hit\nRange: 30 feet\nUse: 1x per long rest\n\nThe diadem conjures a radiant shield of moonlight around the target. The shield absorbs **4d6 + the wearer’s spellcasting ability modifier** damage from the triggering hit.',
  'Lost Dawn': '**+2 healing**\n\n**Light of Lathander:**\n\nUse: 1x per long rest\n\nYou can cast Mass Cure Wounds and Daylight simultaneously from the ring.',
  'Trailstone of the Known Path': '**Rune of the Known Path:**\n\nActivation: 10-minute ritual (verbal, somatic)\n\nYou can mark a location with a rune that becomes invisible when the ritual ends. The rune can be detected with Detect Magic.\n\n**Portal to the Known Path:**\n\nActivation: 10-minute ritual (verbal, somatic)\nDuration: 10 seconds, but it can be closed earlier\n\nActivating the stone opens a circular blue portal 2 meters in diameter leading to the marked location. Any creature can pass through it.\n\n**Close the Portal:**\n\nActivation: Action (verbal, somatic)\n\nThe portal closes immediately. When it closes, the stone loses its magic and the rune disappears. The item can be used only once.',
  'Veil of Agony': '**+1 necrotic**\n\n**Life Tap:**\n\nUses: 3x per long rest\n\nWhen you deal necrotic damage to a creature, the cloak can drain its vitality. You regain hit points equal to half the damage dealt.',
  'Tears of the Frostmaiden': '**+2 cold**\n\n**Cone of Cold:**\n\nUse: 1x per long rest\n\nYou can cast Cone of Cold from the necklace.',
  'Adamantin Sisak': '**+1 AC**\n\n**Adamantine Defense:**\n\nThe wearer has advantage on Dexterity saving throws made to avoid damage or attacks.\n\nCritical hits against the wearer count as normal hits.',
  'Basic poison': 'Activation: Bonus Action\nTarget: 1 weapon or up to 3 pieces of ammunition\nDuration: 1 minute or until the first hit\n\nOn a hit, the target must make a **DC 10 Constitution saving throw**. On a failed save, it takes **1d4 poison damage**. The poison does not inflict the Poisoned condition.',
  'Amulet of wisdom': '**Sage’s Resolve:**\n\nThe wearer gains a **+1 bonus to Wisdom saving throws**.',
  'Black Panter Studded Armor': '**13 AC + Dex mod**\n\n**Panther’s Agility:**\n\nThe wearer gains a **+1 bonus to Dexterity saving throws**.',
  'Blinkdagger': '**+1 dagger**\n\n**Blinkstep:**\n\nActivation: Bonus Action\nUses: 3x per long rest\n\nThrow the dagger toward a creature or unoccupied point you can see. As it leaves your hand, you and the dagger briefly enter the Ethereal Plane.\n\nWhen the dagger hits its target or reaches the chosen point, you immediately teleport beside it. If Blinkstep included an attack, that attack deals an additional 1d6 force damage.\n\nThe dagger then magically returns to your hand. If your hands are full, it falls at your feet.',
  'Broom of Flying': '**Flying broom**\n\n**Flying:**\n\nActivation: Action, verbal\nConcentration: Yes\nFlying speed: 60 ft\n\nUsing the broom’s flying ability requires concentration.',
  'Boots of Striding and Springing': '**Striding and Springing:**\n\nUse: 1x per long rest\nDuration: 1 minute\n\nWhen activated:\n\n- The wearer’s base speed increases by 10 ft.\n- Their jump distance is tripled.\n- Falling damage they take is halved.',
  'Bracer of fire resistance': '**Fire Resistance:**\n\nThe wearer gains resistance to **fire damage**.',
  'Cast-Iron Critical Clanger': '**+2 mace**\n\n**Critical Resonance:**\n\nThe weapon reduces the roll required to score a critical hit by 1.\n\n**Deafening Clang:**\n\nActivation: When you score a critical hit\nArea: 30-foot-radius sphere centered on the wielder\nSaving throw: DC 15 Constitution\n\nEvery other creature in the area must make a Constitution saving throw. On a failed save, a creature takes 3d8 thunder damage and is Deafened until the start of the wielder’s next turn. On a successful save, it takes half damage and is not Deafened.\n\n**Perfect Steak:**\n\nEating a steak cooked in it grants the consumer 5 temporary hit points.',
  'Circlet of scorching': '**+1 fire**\n\n**Scorching Ray:**\n\nUse: 1x per long rest\n\nYou can cast Scorching Ray from the circlet.',
  'Cloak of Invisibility': '**Magic cloak**\n\n**Invisibility:**\n\nUse: 1x per long rest\n\nYou can cast Invisibility from the cloak.',
  'Crystal ball': '**Magic crystal ball**\n\n**Scrying:**\n\nUse: 1x per long rest\nSaving throw: DC 17\n\nYou can cast Scrying from the crystal ball.',
  'Diadem of arcane knowledge': '**Arcane Knowledge:**\n\nThe wearer has advantage on Arcana checks.',
  'Displacer’s Deceptive Duster': '**14 AC + Dex mod**\n\n**Displacement:**\n\nActivation: Action\nUse: 1x per long rest\nDuration: 10 rounds\n\nWhen activated, the coat projects a magical illusion around the wearer, making them appear to stand near their actual position but somewhere else. Attack rolls against the wearer are therefore made with disadvantage. While this effect is active, the wearer is also lightly obscured.\n\nIf an attack hits the wearer, the effect is suppressed until the end of the wearer’s next turn. The effect is also suppressed while the wearer is incapacitated or has a speed of 0.',
  'Elixir of Bloodlust': 'Duration: 1 hour\n\nOnce per round, when the user kills an enemy, they gain **5 temporary HP** and one additional nonmagical Action or Bonus Action.\n\nOutside combat, the user must make a **DC 10 Wisdom saving throw**. On a failed save, they attack the nearest target for 1 minute.',
  'Earrings of charm': '**Charming Presence:**\n\nCreatures have disadvantage on saving throws against the wearer’s abilities that inflict the Charmed condition.\n\nThe wearer has advantage on Charisma checks made to seduce another creature.',
  'Handbreaker': '**+1 mace**\n\n**Handbreaker:**\n\nIf the wielder is proficient with maces, the target’s Sap condition remains until the target succeeds on a **DC 10 Constitution saving throw**. The affected creature can make its first saving throw on its first turn.',
  'Immovable Rod': '**Magic rod**\n\n**Immovable:**\n\nMove check: DC 30 Strength\nLoad capacity: 3.5 tons\n\nWhen activated, the rod becomes fixed in place. Moving it requires a successful DC 30 Strength check.',
  'Misztikus Rúnakő': '**Applying the rune:**\n\nApplying the runestone to an item turns it into a magic item. Choose **two effects** from the list below:\n\n- +1 AC\n- +1 to attack and damage rolls\n- +1 to save DC, attack rolls, and damage rolls for one chosen damage type\n- +1d4 damage of one chosen damage type\n- Cast one chosen 1st-level spell 1x per long rest\n- +1d4 to all healing\n- +1 to saving throws\n- Advantage on checks with one chosen skill\n\nThese effects are examples. Another magical effect of similar power may also be chosen.',
  'Orb of Detect magic': '**Magic orb**\n\n**Detect Magic:**\n\nUses: 3x per long rest\n\nYou can cast Detect Magic from the orb. The spell’s range is doubled.',
  'Potion of feather fall': 'When consumed, the user gains the effect of the **Feather Fall** spell.',
  'Prismatic Psychedelic Peepers': '**+2 illusion**\n\n**Hypnotic Pattern:**\n\nUse: 1x per long rest\n\nYou can cast Hypnotic Pattern from the glasses.',
  'Ring of Spell Storing': '**Magic ring**\n\n**Spell Storing:**\n\nUse: 1x per long rest\n\nAnyone can store a spell of up to 5th level in the ring for its wearer to cast later. A creature unable to cast spells can still use the stored spell.\n\nFor a non-spellcaster, the spell save DC is 14 and spell attacks use the wearer’s Dexterity modifier.',
  'Scrying Eye Orb': '**Magic orb**\n\n**Scrying Eye:**\n\nUse: 1x per long rest\nRange: 300 ft\n\nThe orb becomes a floating eye that you can control within range. You perceive its surroundings as though you were in its space.',
  'Strong poison': 'Activation: Bonus Action\nTarget: 1 weapon or up to 3 pieces of ammunition\nDuration: 1 minute or until the first hit\n\nOn a hit, the target must make a **DC 14 Constitution saving throw**. On a failed save, it takes **2d8 poison damage**.',
  'Sunshine-Singer’s Solar Serenade Sickle': '**Sickle, +2 radiant**\n\n**Solar Serenade:**\n\nUse: 1x per long rest\n\nYou can cast Sunbeam from the sickle.\n\nTo maintain the spell, you and one companion must continuously sing a song about sunlight. The sickle will not accept the same song twice.',
};

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('hu');
  useEffect(() => { const timer = window.setTimeout(() => { if (localStorage.getItem('catalog-language') === 'en') setLanguageState('en'); }, 0); return () => window.clearTimeout(timer); }, []);
  const setLanguage = (next: Language) => { setLanguageState(next); localStorage.setItem('catalog-language', next); document.documentElement.lang = next; };
  return { language, setLanguage };
}

export const categoryLabel = (category: string, language: Language) => categoryLabels[category]?.[language === 'hu' ? 0 : 1] ?? category;

export function localizedItem(item: CatalogItem, language: Language) {
  if (language === 'hu') return { ...item, originalName: item.name, name: huNames[item.name] ?? item.name };
  const entry = translations[item.name as keyof typeof translations];
  return { ...item, originalName: item.name, name: enNames[item.name] ?? entry?.enName ?? item.name, details: enDetailOverrides[item.name] ?? (entry ? repairEnglish(entry.enDetails) : item.details) };
}

export function LanguageSwitch({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  return <div className="languageSwitch" role="group" aria-label={language === 'hu' ? 'Nyelvválasztó' : 'Language selector'}>
    <button className={language === 'hu' ? 'active' : ''} onClick={() => setLanguage('hu')}>HU</button>
    <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
  </div>;
}
