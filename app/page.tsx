'use client';

import { useEffect, useMemo, useState } from 'react';
import { items } from './items.generated';

type Item = (typeof items)[number];
const categoryOrder = ['Főzet', 'Fegyver', 'Páncél', 'Ékszer', 'Fókusz', 'Fogyóeszköz', 'Mágikus tárgy'];
const categories = ['Mind', ...categoryOrder.filter((name) => items.some((item) => item.category === name))];
const itemImages: Record<string, string> = {
  'Adamantin Sisak': '/items/adamantin-sisak.jpeg',
  'Amulet of wisdom': '/items/amulet-of-wisdom.jpeg',
  'Belt of the Hill Giant': '/items/belt-of-the-hill-giant.jpeg',
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
};

function ItemArtwork({ item, modal = false }: { item: Item; modal?: boolean }) {
  const image = itemImages[item.name];
  return <div className={`${modal ? 'modalArtifact ' : ''}artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
    {image ? <img src={image} alt="" /> : <span>{item.name.charAt(0)}</span>}
  </div>;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = `${item.name} ${item.category} ${item.summary} ${item.details}`.toLocaleLowerCase('hu');
    return (category === 'Mind' || item.category === category) && haystack.includes(query.toLocaleLowerCase('hu').trim());
  }), [query, category]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [selected]);

  return <main>
    <header className="hero" id="top"><div className="eyebrow">Válogatott mágikus ritkaságok Faerûnból</div><h1>A rendkívüli tárgyak<br/><em>rendes jegyzéke.</em></h1><p>Fegyverek, ereklyék és különös portékák egy helyen.</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keress név, típus vagy hatás szerint…" aria-label="Keresés a tárgyak között"/><kbd>{filtered.length} találat</kbd></label></header>
    <section className="catalog" aria-label="Mágikus tárgyak">
      <div className="filters" role="group" aria-label="Kategóriaszűrő">{categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
      <div className="grid">{filtered.map((item) => <button className="card itemCard" key={item.id} onClick={() => setSelected(item)} aria-label={`${item.name} részletei`}><ItemArtwork item={item}/><div className="cardBody"><h3>{item.name}</h3><div className="cardInfo"><span>{item.category}</span><strong>{item.price ? `${item.price.toLocaleString('hu-HU')} arany` : 'Ár megegyezés szerint'}</strong></div></div></button>)}</div>
      {filtered.length === 0 && <div className="empty">A kereséshez nem találtunk tárgyat. Próbálj más kifejezést.</div>}
    </section>
    <footer><span>Aurora Katalógusháza · {items.length} lajstromozott tárgy</span><span>„Nincs olyan ritkaság, amelyet ne tudnánk felkutatni.”</span></footer>
    {selected && <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close" onClick={() => setSelected(null)} aria-label="Bezárás">×</button><ItemArtwork item={selected} modal/><div className="modalBody"><div className="eyebrow">{selected.category}</div><h2 id="item-title">{selected.name}</h2>{selected.price && <div className="price">Becsült érték: <strong>{selected.price.toLocaleString('hu-HU')} arany</strong></div>}<div className="details">{selected.details}</div></div></section></div>}
  </main>;
}
