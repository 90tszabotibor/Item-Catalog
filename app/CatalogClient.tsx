'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { itemImages, type CatalogItem } from './catalog-data';

type Item = CatalogItem;
const categoryOrder = ['Főzet', 'Fegyver', 'Páncél', 'Ékszer', 'Fókusz', 'Fogyóeszköz', 'Mágikus tárgy'];
type SortOrder = 'name' | 'price-asc' | 'price-desc';

function ItemArtwork({ item, modal = false }: { item: Item; modal?: boolean }) {
  const image = itemImages[item.name];
  return <div className={`${modal ? 'modalArtifact ' : ''}artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
    {image ? <Image src={image} alt="" fill sizes={modal ? '(max-width: 760px) 100vw, calc(100vw - 390px)' : '(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw'} /> : <span>{item.name.charAt(0)}</span>}
  </div>;
}

function DetailText({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part)}</>;
}

export default function CatalogClient({ catalogItems }: { catalogItems: readonly CatalogItem[] }) {
  const categories = ['Mind', ...categoryOrder.filter((name) => catalogItems.some((item) => item.category === name))];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(() => catalogItems.filter((item) => {
    const haystack = `${item.name} ${item.category} ${item.summary} ${item.details}`.toLocaleLowerCase('hu');
    return (category === 'Mind' || item.category === category) && haystack.includes(query.toLocaleLowerCase('hu').trim());
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name, 'hu');
    if (sortOrder === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity) || a.name.localeCompare(b.name, 'hu');
    return a.name.localeCompare(b.name, 'hu');
  }), [catalogItems, query, category, sortOrder]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [selected]);

  return <main>
    <Link className="staffEntrance" href="/staff">Személyzeti bejárat</Link>
    <header className="hero" id="top"><div className="eyebrow">Válogatott mágikus ritkaságok Faerûnból</div><h1><span className="titleAurora">Aurora</span><br/><span className="titleCatalog">Katalógusháza</span></h1><p>Fegyverek, ereklyék és különös portékák egy helyen.</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keress név, típus vagy hatás szerint…" aria-label="Keresés a tárgyak között"/><kbd>{filtered.length} találat</kbd></label></header>
    <section className="catalog" aria-label="Mágikus tárgyak">
      <div className="catalogTools"><div className="filters" role="group" aria-label="Kategóriaszűrő">{categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div><div className="sort"><span>Rendezés</span><div className="sortDropdown" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setSortOpen(false)}><button className="sortTrigger" onClick={() => setSortOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={sortOpen}>{sortOrder === 'name' ? 'Név szerint' : sortOrder === 'price-asc' ? 'Érték: növekvő' : 'Érték: csökkenő'}<span className="sortArrow" aria-hidden="true">⌄</span></button>{sortOpen && <div className="sortMenu" role="listbox" aria-label="Tárgyak rendezése">{([['name', 'Név szerint'], ['price-asc', 'Érték: növekvő'], ['price-desc', 'Érték: csökkenő']] as const).map(([value, label]) => <button key={value} role="option" aria-selected={sortOrder === value} className={sortOrder === value ? 'selected' : ''} onClick={() => { setSortOrder(value); setSortOpen(false); }}>{label}</button>)}</div>}</div></div></div>
      <div className="grid">{filtered.map((item) => <button className="card itemCard" key={item.id} onClick={() => setSelected(item)} aria-label={`${item.name} részletei`}><ItemArtwork item={item}/><div className="cardBody"><h3>{item.name}</h3><div className="cardInfo"><span>{item.category}</span><strong>{item.price ? `${item.price.toLocaleString('hu-HU')} arany` : 'Ár megegyezés szerint'}</strong></div></div></button>)}</div>
      {filtered.length === 0 && <div className="empty">A kereséshez nem találtunk tárgyat. Próbálj más kifejezést.</div>}
    </section>
    <footer><span>Aurora Katalógusháza · {catalogItems.length} lajstromozott tárgy</span><span>„Nincs olyan ritkaság, amelyet ne tudnánk felkutatni.”</span></footer>
    {selected && <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close" onClick={() => setSelected(null)} aria-label="Bezárás">×</button><ItemArtwork item={selected} modal/><div className="modalBody"><div className="eyebrow">{selected.category}</div><h2 id="item-title">{selected.name}</h2>{selected.price && <div className="price">Érték: <strong>{selected.price.toLocaleString('hu-HU')} arany</strong></div>}<div className="details"><DetailText text={selected.details}/></div></div></section></div>}
  </main>;
}
