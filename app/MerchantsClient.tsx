'use client';

import SiteNav from './SiteNav';
import { useLanguage } from './i18n';

const merchants = [
  { hu:'Xizi', en:'Xizi', roleHu:'Arkán nagykereskedő', roleEn:'Arcane wholesaler', location:'Westgate', noteHu:'A Gondeth Mageries eladója.', noteEn:'Proprietor of Gondeth Mageries.' },
  { hu:'Syla Zora', en:'Syla Zora', roleHu:'Mágiakereskedő és könyvtáros', roleEn:'Magic merchant and librarian', location:'Selgaunt', noteHu:'Mágikus tárgyak vizsgálatával és értékbecslésével is foglalkozik.', noteEn:'Also appraises and identifies magic items.' },
  { hu:'Félszemű Leon', en:'One-Eyed Leon', roleHu:'Feketepiaci kereskedő', roleEn:'Black-market merchant', location:'Suzail', noteHu:'Fegyvereket, főzeteket és mágikus portékákat szerez be.', noteEn:'Procures weapons, potions, and magical wares.' },
  { hu:'Zelen', en:'Zelen', roleHu:'Mágikustárgy-árus', roleEn:'Magic-item merchant', location:'Sirályszirt', noteHu:'A település egyetlen mágikus tárgyakkal kereskedő árusa.', noteEn:'The settlement’s only merchant dealing in magic items.' },
  { hu:'John Smith', en:'John Smith', roleHu:'Kovács', roleEn:'Blacksmith', location:'Cormyr', noteHu:'Felszereléseket, szakkönyveket és mágikus tárgyakat kínál.', noteEn:'Offers equipment, trade manuals, and magic items.' },
  { hu:'Galak „Melegparázs” Thuuntok', en:'Galak “Warm-Ember” Thuuntok', roleHu:'Szakértő kovács', roleEn:'Expert blacksmith', location:'Selgaunt', noteHu:'Kovácsmunkákat, szakkönyveket és uncommon tárgyakat kínál.', noteEn:'Offers smithing work, trade manuals, and uncommon items.' },
  { hu:'Edmund Koltelm', en:'Edmund Koltelm', roleHu:'Kovács', roleEn:'Blacksmith', location:'', noteHu:'A rábízott alapanyaggal hajlamos eltűnni.', noteEn:'Known to disappear with materials entrusted to him.' },
  { hu:'Dagna Daergel', en:'Dagna Daergel', roleHu:'Szakértő ékszerkészítő', roleEn:'Expert jeweler', location:'Selgaunt', noteHu:'Mágikus ékszereket készít, azonosít és értékesít.', noteEn:'Crafts, identifies, and sells magical jewelry.' },
  { hu:'Orla Vhalos', en:'Orla Vhalos', roleHu:'Ékszerész', roleEn:'Jeweler', location:'', noteHu:'Gnóm ékszerész és kézműves.', noteEn:'Gnome jeweler and artisan.' },
  { hu:'Nyúzó Zarathek', en:'Zarathek the Skinner', roleHu:'Szakértő bőrműves', roleEn:'Expert leatherworker', location:'Selgaunt', noteHu:'Mágikus ruházatokat és különleges páncélokat készít.', noteEn:'Crafts magical garments and unusual armor.' },
  { hu:'Lae Greystone', en:'Lae Greystone', roleHu:'Bőrműves', roleEn:'Leatherworker', location:'', noteHu:'Törp bőrműves, mágikus alapanyagokkal is dolgozik.', noteEn:'Dwarf leatherworker who also works with magical materials.' },
  { hu:'Robert Flatwater', en:'Robert Flatwater', roleHu:'Tapasztalt alkimista', roleEn:'Experienced alchemist', location:'', noteHu:'Orvosságokat, főzeteket és alkímiai szakkönyveket kínál.', noteEn:'Offers medicines, potions, and alchemical manuals.' },
  { hu:'Árnyékfőző Vesryn', en:'Shadowbrewer Vesryn', roleHu:'Szakértő alkimista', roleEn:'Expert alchemist', location:'Selgaunt', noteHu:'Orvosságokat, főzeteket és magasabb szintű szakkönyveket kínál.', noteEn:'Offers medicines, potions, and advanced alchemical manuals.' },
  { hu:'Sara Bowsuntide', en:'Sara Bowsuntide', roleHu:'Műkereskedő és értékbecslő', roleEn:'Art dealer and appraiser', location:'Selgaunt', noteHu:'A Bowsuntide műkereskedés képviselője.', noteEn:'Representative of the Bowsuntide art dealership.' },
  { hu:'Alpharra Anabravvur', en:'Alpharra Anabravvur', roleHu:'Hajóépítő műhely vezetője', roleEn:'Shipyard proprietor', location:'Selgaunt', noteHu:'Fényűző luxushajók építésével és értékesítésével foglalkozik.', noteEn:'Builds and sells lavish luxury ships.' },
];

export default function MerchantsClient() {
  const { language, setLanguage } = useLanguage();
  return <main>
    <SiteNav language={language} setLanguage={setLanguage} active="merchants"/>
    <header className="hero merchantHero"><div className="eyebrow">{language === 'hu' ? 'Mesterek, kereskedők és különös alakok' : 'Artisans, merchants, and curious characters'}</div><h1><span className="titleAurora">{language === 'hu' ? 'Faerûn' : 'Faerûn’s'}</span><br/><span className="titleCatalog">{language === 'hu' ? 'Árusai' : 'Merchants'}</span></h1><p>{language === 'hu' ? 'Ismerd meg azokat, akik a ritka portékákat készítik, felkutatják és értékesítik.' : 'Meet those who craft, find, and trade rare wares.'}</p></header>
    <section className="merchantSection" aria-label={language === 'hu' ? 'Árusok' : 'Merchants'}>
      <div className="merchantGrid">{merchants.map((merchant) => <article className="merchantCard" key={merchant.en}>
        <div className="merchantMonogram" aria-hidden="true">{(language === 'hu' ? merchant.hu : merchant.en).charAt(0)}</div>
        <div className="merchantContent"><div className="merchantMeta"><span>{language === 'hu' ? merchant.roleHu : merchant.roleEn}</span>{merchant.location && <span>{merchant.location}</span>}</div><h2>{language === 'hu' ? merchant.hu : merchant.en}</h2><p>{language === 'hu' ? merchant.noteHu : merchant.noteEn}</p></div>
      </article>)}</div>
    </section>
    <footer><span>{language === 'hu' ? `${merchants.length} lajstromozott árus` : `${merchants.length} catalogued merchants`}</span><span>{language === 'hu' ? 'A portéka változhat, a jó alku örök.' : 'Wares may change; a good bargain endures.'}</span></footer>
  </main>;
}
