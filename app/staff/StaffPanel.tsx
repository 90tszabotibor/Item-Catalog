'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Entry = { key: string; name: string; category: string; price: number | null };

export default function StaffPanel({ entries, initialEnabledKeys }: { entries: Entry[]; initialEnabledKeys: string[] }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(() => new Set(initialEnabledKeys));
  const [saved, setSaved] = useState(() => new Set(initialEnabledKeys));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Mind');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const categories = ['Mind', ...new Set(entries.map((entry) => entry.category))];
  const filtered = useMemo(() => entries.filter((entry) => {
    const matchesQuery = entry.name.toLocaleLowerCase('hu').includes(query.toLocaleLowerCase('hu').trim());
    return matchesQuery && (category === 'Mind' || entry.category === category);
  }), [entries, query, category]);
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
      setStatus(body.error || 'A mentés nem sikerült.');
      setSaving(false);
      if (response.status === 401) router.refresh();
      return;
    }
    setSaved(new Set(body.enabledKeys));
    setEnabled(new Set(body.enabledKeys));
    setStatus('A jelenlegi portéka elmentve.');
    setSaving(false);
    router.refresh();
  }

  async function logout() {
    await fetch('/api/staff/logout', { method: 'POST' });
    router.refresh();
  }

  return <main className="staffShell panelShell">
    <header className="staffHeader">
      <div><div className="staffEyebrow">Személyzeti terület</div><h1>Aktuális portéka</h1><p>Jelöld ki azokat a tárgyakat, amelyeket a játékosok jelenleg láthatnak.</p></div>
      <div className="staffHeaderActions"><Link href="/">Katalógus megnyitása</Link><button onClick={logout}>Kijelentkezés</button></div>
    </header>
    <section className="staffToolbar">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tárgy keresése…" aria-label="Tárgy keresése" />
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Kategória">{categories.map((name) => <option key={name}>{name}</option>)}</select>
      <div className="selectionCount"><strong>{enabled.size}</strong> / {entries.length} kiválasztva</div>
    </section>
    <div className="bulkActions"><button onClick={() => setEnabled(new Set(entries.map((entry) => entry.key)))}>Összes kijelölése</button><button onClick={() => setEnabled(new Set())}>Kijelölések törlése</button></div>
    <section className="staffList" aria-label="Portékalista">
      {filtered.map((entry) => <label key={entry.key} className={`staffItem ${enabled.has(entry.key) ? 'isEnabled' : ''}`}>
        <input type="checkbox" checked={enabled.has(entry.key)} onChange={() => toggle(entry.key)} />
        <span className="checkMark" aria-hidden="true">✓</span>
        <span className="staffItemText"><strong>{entry.name}</strong><small>{entry.category}</small></span>
        <span className="staffPrice">{entry.price ? `${entry.price.toLocaleString('hu-HU')} arany` : 'Nincs ár'}</span>
      </label>)}
      {!filtered.length && <div className="staffEmpty">Nincs a keresésnek megfelelő tárgy.</div>}
    </section>
    <footer className="saveBar"><div><strong>{dirty ? 'Mentetlen módosítások' : 'Minden módosítás mentve'}</strong>{status && <span className={status.includes('elmentve') ? 'saveSuccess' : 'staffError'}>{status}</span>}</div><button className="primaryStaffButton" onClick={save} disabled={saving || !dirty}>{saving ? 'Mentés…' : 'Portéka mentése'}</button></footer>
  </main>;
}

