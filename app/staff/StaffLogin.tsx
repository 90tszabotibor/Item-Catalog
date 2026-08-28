'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSwitch, useLanguage } from '../i18n';

export default function StaffLogin() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/staff/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (!response.ok) {
      await response.json().catch(() => ({}));
      setError(language === 'hu' ? 'A belépés nem sikerült.' : 'Login failed.');
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return <main className="staffShell loginShell">
    <LanguageSwitch language={language} setLanguage={setLanguage}/>
    <Link href="/" className="backLink">← {language === 'hu' ? 'Vissza a katalógushoz' : 'Back to the catalogue'}</Link>
    <section className="loginCard">
      <div className="staffEyebrow">{language === 'hu' ? 'Aurora Katalógusháza' : 'Aurora Catalogue House'}</div>
      <h1>{language === 'hu' ? 'Személyzeti bejárat' : 'Staff entrance'}</h1>
      <p>{language === 'hu' ? 'Add meg a személyzeti belépőkódot a jelenlegi portéka szerkesztéséhez.' : 'Enter the staff access code to edit the current assortment.'}</p>
      <form onSubmit={submit}>
        <label htmlFor="staff-pin">{language === 'hu' ? 'Belépőkód' : 'Access code'}</label>
        <input id="staff-pin" value={pin} onChange={(event) => setPin(event.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={12} autoFocus />
        {error && <div className="staffError" role="alert">{error}</div>}
        <button className="primaryStaffButton" disabled={loading || !pin}>{loading ? (language === 'hu' ? 'Belépés…' : 'Signing in…') : (language === 'hu' ? 'Belépés' : 'Sign in')}</button>
      </form>
    </section>
  </main>;
}
