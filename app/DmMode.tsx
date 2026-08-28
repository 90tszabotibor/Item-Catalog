'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Language } from './i18n';

const DM_PASSWORD = '8280';
const STORAGE_KEY = 'catalog-dm-mode';

export function useDmMode() {
  const [dmMode, setDmModeState] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDmModeState(sessionStorage.getItem(STORAGE_KEY) === 'on'), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const setDmMode = (enabled: boolean) => {
    setDmModeState(enabled);
    if (enabled) sessionStorage.setItem(STORAGE_KEY, 'on');
    else sessionStorage.removeItem(STORAGE_KEY);
  };

  return { dmMode, setDmMode };
}

export function DmModeControl({ dmMode, setDmMode, language }: { dmMode: boolean; setDmMode: (enabled: boolean) => void; language: Language }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const toggle = () => {
    if (dmMode) setDmMode(false);
    else setOpen(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (password !== DM_PASSWORD) {
      setError(true);
      return;
    }
    setDmMode(true);
    setPassword('');
    setError(false);
    setOpen(false);
  };

  return <>
    <button className={`dmToggle ${dmMode ? 'active' : ''}`} type="button" role="switch" aria-checked={dmMode} onClick={toggle}>
      <span className="dmToggleTrack" aria-hidden="true"><span /></span>
      {language === 'hu' ? 'DM mód' : 'DM mode'}
    </button>
    {open && <div className="dmGateBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <form className="dmGate" onSubmit={submit}>
        <button className="dmGateClose" type="button" onClick={() => setOpen(false)} aria-label={language === 'hu' ? 'Bezárás' : 'Close'}>×</button>
        <div className="eyebrow">{language === 'hu' ? 'Védett tartalom' : 'Protected content'}</div>
        <h2>{language === 'hu' ? 'DM mód bekapcsolása' : 'Enable DM mode'}</h2>
        <label htmlFor="dm-password">{language === 'hu' ? 'Jelszó' : 'Password'}</label>
        <input id="dm-password" type="password" inputMode="numeric" autoFocus value={password} onChange={(event) => { setPassword(event.target.value); setError(false); }} aria-invalid={error} />
        {error && <p>{language === 'hu' ? 'Hibás jelszó.' : 'Incorrect password.'}</p>}
        <button className="dmGateSubmit" type="submit">{language === 'hu' ? 'Feloldás' : 'Unlock'}</button>
      </form>
    </div>}
  </>;
}
