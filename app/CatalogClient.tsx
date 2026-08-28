'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { itemImages, type CatalogItem } from './catalog-data';
import { categoryLabel, LanguageSwitch, localizedItem, useLanguage } from './i18n';

type Item = CatalogItem;
const categoryOrder = ['Főzet', 'Fegyver', 'Páncél', 'Ékszer', 'Fókusz', 'Fogyóeszköz', 'Mágikus tárgy'];
type SortOrder = 'name' | 'price-asc' | 'price-desc';

function ItemArtwork({ item, modal = false }: { item: Item & { originalName?: string }; modal?: boolean }) {
  const image = itemImages[item.originalName ?? item.name];
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
  const { language, setLanguage } = useLanguage();
  const displayItems = useMemo(() => catalogItems.map((item) => localizedItem(item, language)), [catalogItems, language]);
  const categories = ['Mind', ...categoryOrder.filter((name) => catalogItems.some((item) => item.category === name))];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = displayItems.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(() => displayItems.filter((item) => {
    const haystack = `${item.name} ${categoryLabel(item.category, language)} ${item.summary} ${item.details}`.toLocaleLowerCase(language);
    return (category === 'Mind' || item.category === category) && haystack.includes(query.toLocaleLowerCase('hu').trim());
  }).sort((a, b) => {
    if (sortOrder === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name, 'hu');
    if (sortOrder === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity) || a.name.localeCompare(b.name, 'hu');
    return a.name.localeCompare(b.name, language);
  }), [displayItems, query, category, sortOrder, language]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelectedId(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [selected]);

  return <main>
    <div className="cornerControls"><LanguageSwitch language={language} setLanguage={setLanguage}/><Link className="staffEntrance" href="/staff">{language === 'hu' ? 'Személyzeti bejárat' : 'Staff entrance'}</Link></div>
    <header className="hero" id="top"><div className="eyebrow">{language === 'hu' ? 'Válogatott mágikus ritkaságok Faerûnból' : 'Curated magical rarities from Faerûn'}</div><h1><span className="titleAurora">Aurora</span><br/><span className="titleCatalog">{language === 'hu' ? 'Katalógusháza' : 'Catalogue House'}</span></h1><p>{language === 'hu' ? 'Fegyverek, ereklyék és különös portékák egy helyen.' : 'Weapons, relics, and curious wares in one place.'}</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === 'hu' ? 'Keress név, típus vagy hatás szerint…' : 'Search by name, type, or effect…'} aria-label={language === 'hu' ? 'Keresés a tárgyak között' : 'Search items'}/><kbd>{filtered.length} {language === 'hu' ? 'találat' : 'results'}</kbd></label></header>
    <section className="catalog" aria-label={language === 'hu' ? 'Mágikus tárgyak' : 'Magic items'}>
      <div className="catalogTools"><div className="filters" role="group" aria-label={language === 'hu' ? 'Kategóriaszűrő' : 'Category filter'}>{categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name === 'Mind' ? (language === 'hu' ? 'Mind' : 'All') : categoryLabel(name, language)}</button>)}</div><div className="sort"><span>{language === 'hu' ? 'Rendezés' : 'Sort'}</span><div className="sortDropdown" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setSortOpen(false)}><button className="sortTrigger" onClick={() => setSortOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={sortOpen}>{sortOrder === 'name' ? (language === 'hu' ? 'Név szerint' : 'By name') : sortOrder === 'price-asc' ? (language === 'hu' ? 'Érték: növekvő' : 'Value: ascending') : (language === 'hu' ? 'Érték: csökkenő' : 'Value: descending')}<span className="sortArrow" aria-hidden="true">⌄</span></button>{sortOpen && <div className="sortMenu" role="listbox">{([['name', language === 'hu' ? 'Név szerint' : 'By name'], ['price-asc', language === 'hu' ? 'Érték: növekvő' : 'Value: ascending'], ['price-desc', language === 'hu' ? 'Érték: csökkenő' : 'Value: descending']] as const).map(([value, label]) => <button key={value} role="option" aria-selected={sortOrder === value} className={sortOrder === value ? 'selected' : ''} onClick={() => { setSortOrder(value); setSortOpen(false); }}>{label}</button>)}</div>}</div></div></div>
      <div className="grid">{filtered.map((item) => <button className="card itemCard" key={item.id} onClick={() => setSelectedId(item.id)} aria-label={`${item.name} ${language === 'hu' ? 'részletei' : 'details'}`}><ItemArtwork item={item}/><div className="cardBody"><h3>{item.name}</h3><div className="cardInfo"><span>{categoryLabel(item.category, language)}</span><strong>{item.price ? `${item.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} ${language === 'hu' ? 'arany' : 'gold'}` : (language === 'hu' ? 'Ár megegyezés szerint' : 'Price by agreement')}</strong></div></div></button>)}</div>
      {filtered.length === 0 && <div className="empty">{language === 'hu' ? 'A kereséshez nem találtunk tárgyat. Próbálj más kifejezést.' : 'No items matched your search. Try another term.'}</div>}
    </section>
    <footer><span>{language === 'hu' ? 'Aurora Katalógusháza' : 'Aurora Catalogue House'} · {catalogItems.length} {language === 'hu' ? 'lajstromozott tárgy' : 'catalogued items'}</span><span>{language === 'hu' ? '„Nincs olyan ritkaság, amelyet ne tudnánk felkutatni.”' : '“No rarity is beyond our reach.”'}</span></footer>
    {selected && <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedId(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close" onClick={() => setSelectedId(null)} aria-label={language === 'hu' ? 'Bezárás' : 'Close'}>×</button><ItemArtwork item={selected} modal/><div className="modalBody"><div className="eyebrow">{categoryLabel(selected.category, language)}</div><h2 id="item-title">{selected.name}</h2>{selected.price && <div className="price">{language === 'hu' ? 'Érték' : 'Value'}: <strong>{selected.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} {language === 'hu' ? 'arany' : 'gold'}</strong></div>}<div className="details"><DetailText text={selected.details}/></div></div></section></div>}
  </main>;
}
