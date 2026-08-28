'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { itemImages, type CatalogItem } from './catalog-data';
import { categoryLabel, type Language } from './i18n';

type DisplayItem = CatalogItem & { originalName?: string };

function DetailText({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : part)}</>;
}

export default function ItemModal({ item, language, onClose }: { item: DisplayItem; language: Language; onClose: () => void }) {
  const image = itemImages[item.originalName ?? item.name];

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', close); };
  }, [onClose]);

  return <div className="modalBack" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="merchant-item-title">
      <button className="close" onClick={onClose} aria-label={language === 'hu' ? 'Bezárás' : 'Close'}>×</button>
      <div className={`modalArtifact artifact artifact${item.id % 4}${image ? ' hasImage' : ''}`} aria-hidden="true">
        {image ? <Image src={image} alt="" fill sizes="(max-width:1024px) 100vw, calc(100vw - 390px)" /> : <span>{item.name.charAt(0)}</span>}
      </div>
      <div className="modalBody">
        <div className="eyebrow">{categoryLabel(item.category, language)}</div>
        <h2 id="merchant-item-title">{item.name}</h2>
        {item.price && <div className="price">{language === 'hu' ? 'Érték' : 'Value'}: <strong>{item.price.toLocaleString(language === 'hu' ? 'hu-HU' : 'en-US')} {language === 'hu' ? 'arany' : 'gold'}</strong></div>}
        <div className="details"><DetailText text={item.details} /></div>
      </div>
    </section>
  </div>;
}
