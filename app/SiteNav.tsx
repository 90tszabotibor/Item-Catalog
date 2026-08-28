'use client';

import Link from 'next/link';
import { LanguageSwitch, type Language } from './i18n';

export default function SiteNav({ language, setLanguage, active }: { language: Language; setLanguage: (language: Language) => void; active: 'merchants' | 'items' }) {
  return <nav className="siteNav" aria-label={language === 'hu' ? 'Főmenü' : 'Main navigation'}>
    <div className="navLinks">
      <Link className={active === 'merchants' ? 'active' : ''} href="/">{language === 'hu' ? 'Árusok' : 'Merchants'}</Link>
      <Link className={active === 'items' ? 'active' : ''} href="/items">{language === 'hu' ? 'Mágikus tárgyak' : 'Magic items'}</Link>
    </div>
    <LanguageSwitch language={language} setLanguage={setLanguage}/>
  </nav>;
}
