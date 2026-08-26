'use client';

import { useEffect, useMemo, useState } from 'react';
import { items } from './items.generated';

type Item = (typeof items)[number];
const categoryOrder = ['Főzet', 'Fegyver', 'Páncél', 'Ékszer', 'Fókusz', 'Fogyóeszköz', 'Mágikus tárgy'];
const itemImages: Record<string, string> = {
  'Adamantin Sisak': '/items/adamantin-sisak.jpeg',
  'Amulet of wisdom': '/items/amulet-of-wisdom.jpeg',
  'Belt of the Hill Giant': '/items/belt-of-the-hill-giant.jpeg',
  'Basic poison': '/items/basic-poison.jpeg',
  'Black Panter Studded Armor': '/items/black-panter-studded-armor.jpeg',
  'Black Wolf Fur': '/items/black-wolf-fur.jpeg',
  'Boots of Longstrider': '/items/boots-of-longstrider.jpeg',
  'Bracer of fire resistance': '/items/bracer-of-fire-resistance.jpeg',
  'Braclet of sleight hands': '/items/braclet-of-sleight-hands.jpeg',
  'Catpaw boots': '/items/catpaw-boots.jpeg',
  'Circlet of Blasting': '/items/circlet-of-blasting.jpeg',
  'Cloak of Invisibility': '/items/cloak-of-invisibility.png',
  'Crystal ball': '/items/crystal-ball.jpeg',
  'Diadem of arcane knowledge': '/items/diadem-of-arcane-knowledge.jpeg',
  'Displacer’s Deceptive Duster': '/items/displacers-deceptive-duster.jpeg',
  'Earrings of charm': '/items/earrings-of-charm.jpeg',
  'Elixir of Bloodlust': '/items/elixir-of-bloodlust.jpeg',
  'Elixir of Hill Giant': '/items/elixir-of-hill-giant.jpeg',
  'Gauntlet of strong hands': '/items/gauntlet-of-strong-hands.jpeg',
  'Greater healing potion': '/items/greater-healing-potion.jpeg',
  'Handbreaker': '/items/handbreaker.png',
  'Healing potion': '/items/healing-potion.jpeg',
  'Immovable Rod': '/items/immovable-rod.jpeg',
  'Legbreaker': '/items/legbreaker.jpeg',
  'Mithral Láncing': '/items/mithral-lancing.jpeg',
  'Misztikus Rúnakő': '/items/misztikus-runako.jpeg',
  'Orb of Detect magic': '/items/orb-of-detect-magic.png',
  'Prismatic Psychedelic Peepers': '/items/prismatic-psychedelic-peepers.jpeg',
  'Potion of arcane recovery': '/items/potion-of-arcane-recovery.jpeg',
  'Potion of feather fall': '/items/potion-of-feather-fall.jpeg',
  'Potion of Invisibility': '/items/potion-of-invisibility.jpeg',
  'Potion of Speed': '/items/potion-of-speed.jpeg',
  'Quickly Powder': '/items/quickly-powder.jpeg',
  'Reinforced Leather Coat': '/items/reinforced-leather-coat.jpeg',
  'Ring of Arcane Recovery': '/items/ring-of-arcane-recovery.jpeg',
  'Ring of Remove Curse': '/items/ring-of-remove-curse.jpeg',
  'Ritual Dagger': '/items/ritual-dagger.png',
  'Scrying Eye Orb': '/items/scrying-eye-orb.jpeg',
  'Staff of Healing': '/items/staff-of-healing.jpeg',
  'Staff of Sleep': '/items/staff-of-sleep.jpeg',
  'Sunshine-Singer’s Solar Serenade Sickle': '/items/sunshine-singers-solar-serenade-sickle.jpeg',
  'The Cast-Iron Critical Clanger': '/items/the-cast-iron-critical-clanger.jpeg',
  'Tigereye Monocle of Darkvision': '/items/tigereye-monocle-of-darkvision.png',
  'Vestments of the Noble Snow-Leopard': '/items/vestments-of-the-noble-snow-leopard.jpeg',
  'Wand of Ice Knife': '/items/wand-of-ice-knife.jpeg',
  'Wand of Sickeness': '/items/wand-of-sickeness.jpeg',
};
const catalogItems = items.filter((item) => Boolean(itemImages[item.name]));
const categories = ['Mind', ...categoryOrder.filter((name) => catalogItems.some((item) => item.category === name))];
type SortOrder = 'name' | 'price-asc' | 'price-desc';

function ItemArtwork({ item, modal = false }: { item: Item; modal?: boolean }) {
  const image = itemImages[item.name];
  return <div className={`${modal ? 'modalArtifact ' : ''}artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
    {image ? <img src={image} alt="" /> : <span>{item.name.charAt(0)}</span>}
  </div>;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name');
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(() => catalogItems.filter((item) => {
    const haystack = `${item.name} ${item.category} ${item.summary} ${item.details}`.toLocaleLowerCase('hu');
    return (category === 'Mind' || item.category === category) && haystack.includes(query.toLocaleLowerCase('hu').trim());
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name, 'hu');
    if (sortOrder === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity) || a.name.localeCompare(b.name, 'hu');
    return a.name.localeCompare(b.name, 'hu');
  }), [query, category, sortOrder]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [selected]);

  return <main>
    <header className="hero" id="top"><div className="eyebrow">Válogatott mágikus ritkaságok Faerûnból</div><h1>Aurora Katalógusháza</h1><p>Fegyverek, ereklyék és különös portékák egy helyen.</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keress név, típus vagy hatás szerint…" aria-label="Keresés a tárgyak között"/><kbd>{filtered.length} találat</kbd></label></header>
    <section className="catalog" aria-label="Mágikus tárgyak">
      <div className="catalogTools"><div className="filters" role="group" aria-label="Kategóriaszűrő">{categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div><label className="sort">Rendezés<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} aria-label="Tárgyak rendezése"><option value="name">Név szerint</option><option value="price-asc">Érték: növekvő</option><option value="price-desc">Érték: csökkenő</option></select></label></div>
      <div className="grid">{filtered.map((item) => <button className="card itemCard" key={item.id} onClick={() => setSelected(item)} aria-label={`${item.name} részletei`}><ItemArtwork item={item}/><div className="cardBody"><h3>{item.name}</h3><div className="cardInfo"><span>{item.category}</span><strong>{item.price ? `${item.price.toLocaleString('hu-HU')} arany` : 'Ár megegyezés szerint'}</strong></div></div></button>)}</div>
      {filtered.length === 0 && <div className="empty">A kereséshez nem találtunk tárgyat. Próbálj más kifejezést.</div>}
    </section>
    <footer><span>Aurora Katalógusháza · {catalogItems.length} lajstromozott tárgy</span><span>„Nincs olyan ritkaság, amelyet ne tudnánk felkutatni.”</span></footer>
    {selected && <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close" onClick={() => setSelected(null)} aria-label="Bezárás">×</button><ItemArtwork item={selected} modal/><div className="modalBody"><div className="eyebrow">{selected.category}</div><h2 id="item-title">{selected.name}</h2>{selected.price && <div className="price">Érték: <strong>{selected.price.toLocaleString('hu-HU')} arany</strong></div>}<div className="details">{selected.details}</div></div></section></div>}
  </main>;
}
