'use client';

import Image from 'next/image';
import Link from 'next/link';
import SiteNav from './SiteNav';
import { categoryLabel, localizedItem, useLanguage } from './i18n';
import type { Merchant } from './merchant-data';
import { allCatalogItems, itemImages } from './catalog-data';

export default function MerchantDetailClient({ merchant }: { merchant: Merchant }) {
  const { language, setLanguage } = useLanguage();
  const name = language === 'hu' ? merchant.hu : merchant.en;
  const inventory = allCatalogItems
    .filter((item) => merchant.inventory?.includes(item.name)
      || (merchant.inventoryMode === 'potions' && item.category === 'Főzet')
      || (merchant.inventoryMode === 'gondeth' && (item.category === 'Főzet' || (item.category === 'Mágikus tárgy' && (item.price ?? Infinity) <= 1000))))
    .map((item) => localizedItem(item, language))
    .sort((a, b) => a.name.localeCompare(b.name, language));

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
            {(language === 'hu' ? merchant.noteHu : merchant.noteEn) && <p>{language === 'hu' ? merchant.noteHu : merchant.noteEn}</p>}
          </div>
        </div>
        <section className="merchantInventory" aria-labelledby="merchant-inventory-title">
          <div className="merchantInventoryHead">
            <div>
              <div className="eyebrow">{language === 'hu' ? 'Aktuális portéka' : 'Current wares'}</div>
              <h2 id="merchant-inventory-title">{language === 'hu' ? 'Kapható tárgyak' : 'Items for sale'}</h2>
            </div>
            {inventory.length > 0 && <span>{inventory.length} {language === 'hu' ? 'tárgy' : 'items'}</span>}
          </div>
          {inventory.length > 0 ? (
            <div className="merchantItemGrid">
              {inventory.map((item) => {
                const image = itemImages[item.originalName ?? item.name];
                return <article className="card merchantItemCard" key={item.id}>
                  <div className={`artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
                    {image ? <Image src={image} alt="" fill sizes="(max-width:760px) 100vw, (max-width:1100px) 50vw, 33vw" /> : <span>{item.name.charAt(0)}</span>}
                  </div>
                  <div className="cardBody">
                    <h3>{item.name}</h3>
                    <div className="cardInfo">
                      <span>{categoryLabel(item.category, language)}</span>
                      <strong>{item.price ? `${item.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} ${language === 'hu' ? 'arany' : 'gold'}` : (language === 'hu' ? 'Ár megegyezés szerint' : 'Price by agreement')}</strong>
                    </div>
                  </div>
                </article>;
              })}
            </div>
          ) : <div className="merchantInventoryEmpty">{language === 'hu' ? 'Jelenleg nincs lajstromozott portéka.' : 'No catalogued wares are currently available.'}</div>}
        </section>
      </section>
    </main>
  );
}
