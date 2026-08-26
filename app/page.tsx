'use client';

import { useEffect, useMemo, useState } from 'react';
import { items } from './items.generated';

type Item = (typeof items)[number];
const categories = ['Mind', 'Főzet', 'Fegyver', 'Páncél', 'Viselhető', 'Fókusz', 'Fogyóeszköz', 'Csodás tárgy'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [selected, setSelected] = useState<Item | null>(null);
  const filtered = useMemo(() => items.filter((item) => {
    const matchesCategory = category === 'Mind' || item.category === category;
    const haystack = `${item.name} ${item.category} ${item.summary} ${item.details}`.toLocaleLowerCase('hu');
    return matchesCategory && haystack.includes(query.toLocaleLowerCase('hu').trim());
  }), [query, category]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setSelected(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [selected]);

  return <main>
    <nav className="topbar"><a className="brand" href="#top" aria-label="Aurora Katalógusháza kezdőlap"><span className="brandMark">A</span><span><strong>Aurora</strong><small>Katalógusház</small></span></a><span className="edition">Játékosi kiadás · 1502 DR</span></nav>
    <header className="hero" id="top"><div className="eyebrow">Válogatott mágikus ritkaságok Faerûnból</div><h1>A rendkívüli tárgyak<br/><em>rendes jegyzéke.</em></h1><p>Fegyverek, ereklyék és különös portékák egy helyen.</p><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Keress név, típus vagy hatás szerint…" aria-label="Keresés a tárgyak között"/><kbd>{filtered.length} találat</kbd></label></header>
    <section className="catalog" aria-label="Mágikus tárgyak"><div className="sectionHead"><div><span className="eyebrow">A gyűjtemény</span><h2>Frissen lajstromozva</h2></div><p>Minden ár tájékoztató jellegű.<br/>A készlet kalandonként változhat.</p></div>
      <div className="filters" role="group" aria-label="Kategóriaszűrő">{categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
      <div className="grid">{filtered.map((item) => <article className="card" key={item.id}><div className={`artifact artifact${item.id % 4}`} aria-hidden="true"><span>{item.name.charAt(0)}</span></div><div className="cardBody"><div className="meta"><span>{item.category}</span><span>№ {String(item.id).padStart(3, '0')}</span></div><h3>{item.name}</h3><p>{item.summary}</p><div className="cardFoot"><strong>{item.price ? `${item.price.toLocaleString('hu-HU')} arany` : 'Ár megegyezés szerint'}</strong><button onClick={() => setSelected(item)} aria-label={`${item.name} részletei`}>Részletek <span>→</span></button></div></div></article>)}</div>
      {filtered.length === 0 && <div className="empty">A kereséshez nem találtunk tárgyat. Próbálj más kifejezést vagy kategóriát.</div>}
    </section>
    <footer><span>Aurora Katalógusháza · {items.length} lajstromozott tárgy</span><span>„Nincs olyan ritkaság, amelyet ne tudnánk felkutatni.”</span></footer>
    {selected && <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="item-title"><button className="close" onClick={() => setSelected(null)} aria-label="Bezárás">×</button><div className={`modalArtifact artifact artifact${selected.id % 4}`}><span>{selected.name.charAt(0)}</span></div><div className="modalBody"><div className="eyebrow">{selected.category} · Lajstromszám {String(selected.id).padStart(3, '0')}</div><h2 id="item-title">{selected.name}</h2>{selected.price && <div className="price">Becsült érték: <strong>{selected.price.toLocaleString('hu-HU')} arany</strong></div>}<div className="details">{selected.details}</div></div></section></div>}
  </main>;
}
