'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import SiteNav from './SiteNav';
import ItemModal from './ItemModal';
import { DmModeControl, useDmMode } from './DmMode';
import { categoryLabel, localizedItem, useLanguage } from './i18n';
import type { Merchant } from './merchant-data';
import { allCatalogItems, itemImages } from './catalog-data';

const categoryOrder = ['Főzet', 'Fegyver', 'Páncél', 'Ékszer', 'Fókusz', 'Fogyóeszköz', 'Mágikus tárgy'];
type SortOrder = 'name' | 'price-asc' | 'price-desc';

export default function MerchantDetailClient({ merchant }: { merchant: Merchant }) {
  const { language, setLanguage } = useLanguage();
  const { dmMode, setDmMode } = useDmMode();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [category, setCategory] = useState('Mind');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name');
  const [sortOpen, setSortOpen] = useState(false);
  const closeModal = useCallback(() => setSelectedId(null), []);
  const changeDmMode = (enabled: boolean) => {
    setDmMode(enabled);
  };
  const name = language === 'hu' ? merchant.hu : merchant.en;
  const inventory = allCatalogItems
    .filter((item) => !merchant.inventoryExclude?.includes(item.name))
    .filter((item) => merchant.inventory?.includes(item.name)
      || (merchant.inventoryMode === 'potions' && item.category === 'Főzet')
      || (merchant.inventoryMode === 'gondeth' && (item.category === 'Főzet' || (item.category === 'Mágikus tárgy' && (item.price ?? Infinity) <= 1000))))
    .map((item) => localizedItem(item, language));
  const categories = ['Mind', ...categoryOrder.filter((categoryName) => inventory.some((item) => item.category === categoryName))];
  const filteredInventory = inventory
    .filter((item) => category === 'Mind' || item.category === category)
    .sort((a, b) => {
      if (sortOrder === 'price-asc') return (a.price ?? Infinity) - (b.price ?? Infinity) || a.name.localeCompare(b.name, language);
      if (sortOrder === 'price-desc') return (b.price ?? -Infinity) - (a.price ?? -Infinity) || a.name.localeCompare(b.name, language);
      return a.name.localeCompare(b.name, language);
    });
  const selected = inventory.find((item) => item.id === selectedId) ?? null;

  return (
    <main>
      <SiteNav language={language} setLanguage={setLanguage} active="merchants" controls={<DmModeControl dmMode={dmMode} setDmMode={changeDmMode} language={language} />} />
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
          </div>
        </div>
        <section className="merchantInventory" aria-labelledby="merchant-inventory-title">
          <div className="merchantInventoryHead">
            <div>
              <div className="eyebrow">{language === 'hu' ? 'Aktuális portéka' : 'Current wares'}</div>
              <h2 id="merchant-inventory-title">{language === 'hu' ? 'Kapható tárgyak' : 'Items for sale'}</h2>
            </div>
            {inventory.length > 0 && <span>{filteredInventory.length} / {inventory.length} {language === 'hu' ? 'tárgy' : 'items'}</span>}
          </div>
          {inventory.length > 0 && <div className="catalogTools merchantCatalogTools"><div className="filters" role="group" aria-label={language === 'hu' ? 'Kategóriaszűrő' : 'Category filter'}>{categories.map((categoryName) => <button key={categoryName} className={category === categoryName ? 'active' : ''} onClick={() => setCategory(categoryName)}>{categoryName === 'Mind' ? (language === 'hu' ? 'Mind' : 'All') : categoryLabel(categoryName, language)}</button>)}</div><div className="sort"><span>{language === 'hu' ? 'Rendezés' : 'Sort'}</span><div className="sortDropdown" onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setSortOpen(false)}><button className="sortTrigger" onClick={() => setSortOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={sortOpen}>{sortOrder === 'name' ? (language === 'hu' ? 'Név szerint' : 'By name') : sortOrder === 'price-asc' ? (language === 'hu' ? 'Érték: növekvő' : 'Value: ascending') : (language === 'hu' ? 'Érték: csökkenő' : 'Value: descending')}<span className="sortArrow" aria-hidden="true">⌄</span></button>{sortOpen && <div className="sortMenu" role="listbox">{([['name', language === 'hu' ? 'Név szerint' : 'By name'], ['price-asc', language === 'hu' ? 'Érték: növekvő' : 'Value: ascending'], ['price-desc', language === 'hu' ? 'Érték: csökkenő' : 'Value: descending']] as const).map(([value, label]) => <button key={value} role="option" aria-selected={sortOrder === value} className={sortOrder === value ? 'selected' : ''} onClick={() => { setSortOrder(value); setSortOpen(false); }}>{label}</button>)}</div>}</div></div></div>}
          {inventory.length > 0 ? (
            <div className="merchantItemGrid">
              {filteredInventory.map((item) => {
                const image = itemImages[item.originalName ?? item.name];
                return <button className="card itemCard merchantItemCard" key={item.id} onClick={() => setSelectedId(item.id)} aria-label={`${item.name} ${language === 'hu' ? 'részletei' : 'details'}`}>
                  <div className={`artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
                    {image ? <Image src={image} alt="" fill sizes="(max-width:760px) 100vw, (max-width:1100px) 50vw, 33vw" /> : <span>{item.name.charAt(0)}</span>}
                  </div>
                  <div className="cardBody">
                    <h3>{item.name}</h3>
                    <div className="cardInfo">
                      <span>{categoryLabel(item.category, language)}</span>
                      {dmMode && <strong>{item.price ? `${item.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} ${language === 'hu' ? 'arany' : 'gold'}` : (language === 'hu' ? 'Ár megegyezés szerint' : 'Price by agreement')}</strong>}
                    </div>
                  </div>
                </button>;
              })}
            </div>
          ) : <div className="merchantInventoryEmpty">{language === 'hu' ? 'Jelenleg nincs lajstromozott portéka.' : 'No catalogued wares are currently available.'}</div>}
          {inventory.length > 0 && filteredInventory.length === 0 && <div className="merchantInventoryEmpty">{language === 'hu' ? 'Ebben a kategóriában jelenleg nincs portéka.' : 'There are currently no wares in this category.'}</div>}
        </section>
      </section>
      {selected && <ItemModal item={selected} language={language} dmMode={dmMode} onClose={closeModal} />}
    </main>
  );
}
