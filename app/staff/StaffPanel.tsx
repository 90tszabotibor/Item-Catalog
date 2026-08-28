'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoryLabel, LanguageSwitch, localizedItem, useLanguage } from '../i18n';
import type { CatalogItem } from '../catalog-data';

type Entry = { key: string; name: string; category: string; price: number | null };

export default function StaffPanel({ entries, initialEnabledKeys }: { entries: Entry[]; initialEnabledKeys: string[] }) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const displayEntries = useMemo(() => entries.map((entry) => {
    const localized = localizedItem({ id: 0, name: entry.name, category: entry.category, price: entry.price, summary: '', details: '' } as CatalogItem, language);
    return { ...entry, name: localized.name };
  }), [entries, language]);
  const [enabled, setEnabled] = useState(() => new Set(initialEnabledKeys));
  const [saved, setSaved] = useState(() => new Set(initialEnabledKeys));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const categories = ['Mind', ...new Set(entries.map((entry) => entry.category))];
  const filtered = useMemo(() => displayEntries.filter((entry) => {
    const matchesQuery = entry.name.toLocaleLowerCase(language).includes(query.toLocaleLowerCase(language).trim());
    return matchesQuery && (category === 'Mind' || entry.category === category);
  }), [displayEntries, query, category, language]);
  const dirty = enabled.size !== saved.size || [...enabled].some((key) => !saved.has(key));

  function toggle(key: string) {
    setEnabled((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setStatus('');
  }

  async function save() {
    setSaving(true);
    setStatus('');
    const response = await fetch('/api/staff/assortment', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ enabledKeys: [...enabled] }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus(language === 'hu' ? 'A mentés nem sikerült.' : 'Save failed.');
      setSaving(false);
      if (response.status === 401) router.refresh();
      return;
    }
    setSaved(new Set(body.enabledKeys));
    setEnabled(new Set(body.enabledKeys));
    setStatus(language === 'hu' ? 'A jelenlegi portéka elmentve.' : 'Current assortment saved.');
    setSaving(false);
    router.refresh();
  }

  async function logout() {
    await fetch('/api/staff/logout', { method: 'POST' });
    router.refresh();
  }

  return <main className="staffShell panelShell">
    <LanguageSwitch language={language} setLanguage={setLanguage}/>
    <header className="staffHeader">
      <div><div className="staffEyebrow">{language === 'hu' ? 'Személyzeti terület' : 'Staff area'}</div><h1>{language === 'hu' ? 'Aktuális portéka' : 'Current assortment'}</h1><p>{language === 'hu' ? 'Jelöld ki azokat a tárgyakat, amelyeket a játékosok jelenleg láthatnak.' : 'Select the items currently visible to players.'}</p></div>
      <div className="staffHeaderActions"><Link href="/">{language === 'hu' ? 'Katalógus megnyitása' : 'Open catalogue'}</Link><button onClick={logout}>{language === 'hu' ? 'Kijelentkezés' : 'Sign out'}</button></div>
    </header>
    <section className="staffToolbar">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === 'hu' ? 'Tárgy keresése…' : 'Search items…'} aria-label={language === 'hu' ? 'Tárgy keresése' : 'Search items'} />
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={language === 'hu' ? 'Kategória' : 'Category'}>{categories.map((name) => <option key={name} value={name}>{name === 'Mind' ? (language === 'hu' ? 'Mind' : 'All') : categoryLabel(name, language)}</option>)}</select>
      <div className="selectionCount"><strong>{enabled.size}</strong> / {entries.length} {language === 'hu' ? 'kiválasztva' : 'selected'}</div>
    </section>
    <div className="bulkActions"><button onClick={() => setEnabled(new Set(entries.map((entry) => entry.key)))}>{language === 'hu' ? 'Összes kijelölése' : 'Select all'}</button><button onClick={() => setEnabled(new Set())}>{language === 'hu' ? 'Kijelölések törlése' : 'Clear selection'}</button></div>
    <section className="staffList" aria-label="Portékalista">
      {filtered.map((entry) => <label key={entry.key} className={`staffItem ${enabled.has(entry.key) ? 'isEnabled' : ''}`}>
        <input type="checkbox" checked={enabled.has(entry.key)} onChange={() => toggle(entry.key)} />
        <span className="checkMark" aria-hidden="true">✓</span>
        <span className="staffItemText"><strong>{entry.name}</strong><small>{categoryLabel(entry.category, language)}</small></span>
        <span className="staffPrice">{entry.price ? `${entry.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} ${language === 'hu' ? 'arany' : 'gold'}` : (language === 'hu' ? 'Nincs ár' : 'No price')}</span>
      </label>)}
      {!filtered.length && <div className="staffEmpty">{language === 'hu' ? 'Nincs a keresésnek megfelelő tárgy.' : 'No items match your search.'}</div>}
    </section>
    <footer className="saveBar"><div><strong>{dirty ? (language === 'hu' ? 'Mentetlen módosítások' : 'Unsaved changes') : (language === 'hu' ? 'Minden módosítás mentve' : 'All changes saved')}</strong>{status && <span className={status.includes('elmentve') || status.includes('saved') ? 'saveSuccess' : 'staffError'}>{status}</span>}</div><button className="primaryStaffButton" onClick={save} disabled={saving || !dirty}>{saving ? (language === 'hu' ? 'Mentés…' : 'Saving…') : (language === 'hu' ? 'Portéka mentése' : 'Save assortment')}</button></footer>
  </main>;
}
