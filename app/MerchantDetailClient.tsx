'use client';

import Image from 'next/image';
import Link from 'next/link';
import SiteNav from './SiteNav';
import { useLanguage } from './i18n';
import type { Merchant } from './merchant-data';

export default function MerchantDetailClient({ merchant }: { merchant: Merchant }) {
  const { language, setLanguage } = useLanguage();
  const name = language === 'hu' ? merchant.hu : merchant.en;

  return (
    <main>
      <SiteNav language={language} setLanguage={setLanguage} active="merchants" />
      <section className="merchantDetail">
        <Link className="merchantBack" href="/">
          ← {language === 'hu' ? 'Vissza az árusokhoz' : 'Back to merchants'}
        </Link>
        <div className="merchantProfile">
          <div className={`merchantProfileImage ${merchant.image ? 'hasImage' : ''}`}>
            {merchant.image ? (
              <Image src={merchant.image} alt={name} fill priority sizes="(max-width: 760px) 100vw, 60vw" />
            ) : (
              <span aria-hidden="true">{name.charAt(0)}</span>
            )}
          </div>
          <div className="merchantProfileBody">
            <div className="eyebrow">{language === 'hu' ? merchant.roleHu : merchant.roleEn}</div>
            <h1>{name}</h1>
            {merchant.location && (
              <div className="merchantLocation">
                {language === 'hu' ? 'Helyszín' : 'Location'}: <strong>{merchant.location}</strong>
              </div>
            )}
            <p>{language === 'hu' ? merchant.noteHu : merchant.noteEn}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
