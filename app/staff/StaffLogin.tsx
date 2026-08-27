'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffLogin() {
  const router = useRouter();
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
      const body = await response.json().catch(() => ({}));
      setError(body.error || 'A belépés nem sikerült.');
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return <main className="staffShell loginShell">
    <Link href="/" className="backLink">← Vissza a katalógushoz</Link>
    <section className="loginCard">
      <div className="staffEyebrow">Aurora Katalógusháza</div>
      <h1>Személyzeti bejárat</h1>
      <p>Add meg a személyzeti belépőkódot a jelenlegi portéka szerkesztéséhez.</p>
      <form onSubmit={submit}>
        <label htmlFor="staff-pin">Belépőkód</label>
        <input id="staff-pin" value={pin} onChange={(event) => setPin(event.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={12} autoFocus />
        {error && <div className="staffError" role="alert">{error}</div>}
        <button className="primaryStaffButton" disabled={loading || !pin}>{loading ? 'Belépés…' : 'Belépés'}</button>
      </form>
    </section>
  </main>;
}

