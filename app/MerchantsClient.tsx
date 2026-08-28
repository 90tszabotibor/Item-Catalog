'use client';

import SiteNav from './SiteNav';
import { useLanguage } from './i18n';
import { merchants } from './merchant-data';
import Link from 'next/link';
import Image from 'next/image';

export default function MerchantsClient() {
  const { language, setLanguage } = useLanguage();
  return <main>
    <SiteNav language={language} setLanguage={setLanguage} active="merchants"/>
    <header className="hero merchantHero"><div className="eyebrow">{language === 'hu' ? 'Mesterek, kereskedők és különös alakok' : 'Artisans, merchants, and curious characters'}</div><h1><span className="titleAurora">{language === 'hu' ? 'Faerûn' : 'Faerûn’s'}</span><br/><span className="titleCatalog">{language === 'hu' ? 'Árusai' : 'Merchants'}</span></h1><p>{language === 'hu' ? 'Ismerd meg azokat, akik a ritka portékákat készítik, felkutatják és értékesítik.' : 'Meet those who craft, find, and trade rare wares.'}</p></header>
    <section className="merchantSection" aria-label={language === 'hu' ? 'Árusok' : 'Merchants'}>
      <div className="merchantGrid">{merchants.map((merchant) => <Link className="merchantCard" href={`/merchants/${merchant.slug}`} key={merchant.slug}>
        <div className={`merchantArtwork ${merchant.image ? 'hasImage' : ''}`}>{merchant.image ? <Image src={merchant.image} alt="" fill sizes="(max-width:760px) 100vw, (max-width:1000px) 50vw, 33vw"/> : <span aria-hidden="true">{(language === 'hu' ? merchant.hu : merchant.en).charAt(0)}</span>}</div>
        <div className="merchantContent"><div className="merchantMeta"><span>{language === 'hu' ? merchant.roleHu : merchant.roleEn}</span></div><h2>{language === 'hu' ? merchant.hu : merchant.en}</h2><p>{language === 'hu' ? merchant.noteHu : merchant.noteEn}</p></div>
      </Link>)}</div>
    </section>
    <footer><span>{language === 'hu' ? `${merchants.length} lajstromozott árus` : `${merchants.length} catalogued merchants`}</span><span>{language === 'hu' ? 'A portéka változhat, a jó alku örök.' : 'Wares may change; a good bargain endures.'}</span></footer>
  </main>;
}
