import React, { useState } from 'react';
import { ASSETS, INITIAL_PRODUCE } from '../data/mockData';
import { Language, ProduceListing } from '../types';
import { useNetwork } from '../hooks/useNetwork';

interface MarketScreenProps {
  language: Language;
  onAddToCart: (item: ProduceListing, qty: number) => void;
  onDirectBuy: (item: ProduceListing, qty: number) => void;
  onViewBasket: () => void;
  cartCount: number;
  cartTotal: number;
  onShowToast: (title: string, sub?: string) => void;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({
  language,
  onAddToCart,
  onDirectBuy,
  onViewBasket,
  cartCount,
  cartTotal,
  onShowToast
}) => {
  const { isOnline } = useNetwork();
  const isHindi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Steppers per item
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'prod-1': 2,
    'prod-2': 5,
    'prod-3': 2,
    'prod-4': 5,
    'prod-5': 1
  });

  const handleQtyChange = (id: string, delta: number, min = 1) => {
    setQuantities((prev) => {
      const current = prev[id] || min;
      const next = Math.max(min, Math.min(100, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleVoiceSearch = () => {
    setIsVoiceListening(true);
    onShowToast(
      isHindi ? 'सुन रहे हैं...' : 'Voice Search Listening...',
      'Say "Fresh Red Tomatoes" or "Sharbati Wheat"'
    );
    setTimeout(() => {
      setIsVoiceListening(false);
      setSearchQuery('Tomatoes');
      onShowToast(
        isHindi ? 'परिणाम: "टमाटर"' : 'Voice Recognized: "Tomatoes"',
        'Displaying direct farm harvest lots'
      );
    }, 2200);
  };

  const categories = [
    { key: 'all', labelEn: 'All Produce', labelHi: 'सब कुछ', labelPa: 'ਸਭ ਫਸਲਾਂ', labelMr: 'सर्व शेतमाल', labelTe: 'అన్ని పంటలు' },
    { key: 'veg', labelEn: 'Fresh Vegetables', labelHi: 'सब्जियां', labelPa: 'ਤਾਜ਼ੀਆਂ ਸਬਜ਼ੀਆਂ', labelMr: 'ताजी भाजीपाला', labelTe: 'కూరగాయలు' },
    { key: 'grains', labelEn: 'Organic Grains', labelHi: 'अनाज', labelPa: 'ਅਨਾਜ', labelMr: 'सेंद्रिय धान्य', labelTe: 'ధాన్యాలు' },
    { key: 'fruits', labelEn: 'Seasonal Fruits', labelHi: 'फल', labelPa: 'ਫਲ', labelMr: 'हंगामी फळे', labelTe: 'పండ్లు' },
    { key: 'pulses', labelEn: 'Pulses', labelHi: 'दालें', labelPa: 'ਦਾਲਾਂ', labelMr: 'डाळी', labelTe: 'పప్పులు' },
    { key: 'dairy', labelEn: 'Dairy & Honey', labelHi: 'शहद व दूध', labelPa: 'ਦੁੱਧ ਅਤੇ ਸ਼ਹਿਦ', labelMr: 'दूध आणि मध', labelTe: 'డైరీ & తేనె' }
  ];

  const getCategoryLabel = (cat: typeof categories[0]) => {
    switch (language) {
      case 'hi': return cat.labelHi;
      case 'pa': return cat.labelPa;
      case 'mr': return cat.labelMr;
      case 'te': return cat.labelTe;
      default: return cat.labelEn;
    }
  };

  const filteredProduce = INITIAL_PRODUCE.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.hindiName.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.regionalNames &&
        Object.values(p.regionalNames).some((val) => val.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-lg mx-auto pb-32 pt-2 flex flex-col gap-4">
      {/* Search & Voice Row */}
      <section className="px-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white rounded-xl px-3.5 h-12 shadow-sm border border-[#c0c9be]/40">
            <span className="material-symbols-outlined text-[#717970] text-[22px] flex-shrink-0">
              search
            </span>
            <input
              aria-label="Search produce"
              className="w-full bg-transparent border-none outline-none text-sm text-[#191c19] placeholder:text-[#717970] px-2 truncate"
              placeholder={
                isVoiceListening
                  ? 'Listening for "Fresh Aloo, Sharbati gehun..."'
                  : 'Search farm-fresh vegetables, grains...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#717970] hover:text-[#191c19] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              aria-label="Voice search produce"
              onClick={handleVoiceSearch}
              className={`flex items-center justify-center h-9 w-9 rounded-full transition-transform active:scale-95 flex-shrink-0 cursor-pointer ${
                isVoiceListening ? 'bg-[#fe932c] text-[#663500] animate-pulse' : 'bg-[#f3f4ef] text-[#003b1b]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>
          <button
            aria-label="Open filter settings"
            onClick={() => onShowToast('Filter applied', 'Showing direct farm gate lots nearest to you')}
            className="h-12 px-3.5 rounded-xl bg-[#e7e9e3] text-[#191c19] flex items-center justify-center gap-1 flex-shrink-0 shadow-sm hover:bg-[#c0c9be]/60 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="text-xs font-semibold hidden xs:inline">Filters</span>
          </button>
        </div>

        {/* Category Chips (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#003b1b] text-white shadow-sm'
                    : 'bg-white border border-[#c0c9be]/40 text-[#404941] hover:bg-[#edeee9]'
                }`}
              >
                <span>{getCategoryLabel(cat)}</span>
                {language !== 'en' && (
                  <span className="text-[10px] opacity-80">
                    ({cat.labelEn})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Hero Transparency Statement Banner */}
      <section className="px-4 flex flex-col gap-2">
        {/* Offline Mode Active Notice */}
        {!isOnline && (
          <div className="bg-[#ffdcc3] border border-[#ffb95f] rounded-xl p-3 flex items-center justify-between text-xs text-[#663500] font-bold shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#904d00]">cloud_off</span>
              <span>Offline Cache Active: Historical mandi prices & harvest listings stored locally.</span>
            </div>
            <span className="text-[10px] bg-[#904d00] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Local Cache
            </span>
          </div>
        )}

        <div className="relative overflow-hidden rounded-xl bg-[#14532d] text-white shadow-md p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fe932c] text-[#663500] text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              100% Direct Model
            </span>
            <span className="text-xs text-[#b1f2be] opacity-90 font-medium">
              सीधा खेत से ग्राहक तक
            </span>
          </div>
          <div>
            <h2 className="font-['Outfit'] font-bold text-xl sm:text-2xl leading-tight text-white">
              Direct from Farm to Table —{' '}
              <span className="text-[#ffb95f]">Zero Intermediaries</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#87c695] mt-1 leading-snug">
              Fair price to farmers. Fresh unadulterated food for your kitchen. Picked within 24 hours of harvest.
            </p>
          </div>
          <div className="mt-1 pt-2 flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#ffb95f] text-[18px]">currency_rupee</span>
              <span className="text-xs text-white font-medium">88% Paid to Grower</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#b1f2be] text-[18px]">schedule</span>
              <span className="text-xs text-white font-medium">&lt; 24h Transit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Produce Feed */}
      <section className="px-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">Fresh Batches Today</h3>
            <p className="text-xs text-[#404941]">Live harvesting batches dispatched this morning</p>
          </div>
          <span className="text-xs text-[#003b1b] font-bold">
            {filteredProduce.length} Lots Available
          </span>
        </div>

        {filteredProduce.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center flex flex-col items-center gap-2 shadow-sm border border-[#c0c9be]/30">
            <span className="material-symbols-outlined text-4xl text-[#717970]">search_off</span>
            <p className="text-sm font-bold text-[#191c19]">No produce found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs font-bold text-[#003b1b] underline cursor-pointer"
            >
              Reset search filters
            </button>
          </div>
        ) : (
          filteredProduce.map((p) => {
            const currentQty = quantities[p.id] || (p.minQty || 1);
            const savingsPercent = Math.round(((p.retailPrice - p.price) / p.retailPrice) * 100);

            return (
              <article
                key={p.id}
                className="produce-card rounded-xl bg-white border border-[#c0c9be]/30 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
              >
                {/* Image Banner with Badges */}
                <div className="relative w-full h-48 bg-[#f3f4ef] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={p.name}
                    src={p.image}
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#003b1b] text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">local_florist</span>
                      {p.harvestTime}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm">
                    <span className="text-xs text-[#14532d] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      {p.qualityTag}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">
                  {/* Title & Origin Badge */}
                  <div className="flex flex-col gap-1.5">
                    <h4 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                      {p.name}{' '}
                      <span className="font-semibold text-[#003b1b]">
                        ({p.regionalNames?.[language] || p.hindiName})
                      </span>
                    </h4>
                    {/* Origin Badge */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f3f4ef] text-[#191c19]">
                      <span className="material-symbols-outlined text-[#003b1b] text-[20px] flex-shrink-0">
                        nature_people
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-[#003b1b] font-bold truncate">
                          {p.farmerName} • {p.farmerHub}
                        </span>
                        <span className="text-[11px] text-[#717970] truncate">
                          {p.distance} • Certified Pesticide Tested
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown & Retail Comparison */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 p-2.5 rounded-xl bg-[#f3f4ef]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-['Outfit'] font-bold text-xl text-[#003b1b]">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-[#717970]">/ {p.unit}</span>
                      {p.retailPrice > p.price && (
                        <span className="text-xs line-through text-[#717970] ml-1">
                          ₹{p.retailPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {savingsPercent > 0 && (
                      <div className="px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] text-[10.5px] font-bold whitespace-nowrap">
                        {savingsPercent}% Cheaper than Retail
                      </div>
                    )}
                  </div>

                  {/* Quality Assurance Note */}
                  <div className="flex items-center gap-1.5 text-[#404941] text-xs">
                    <span className="material-symbols-outlined text-[#003b1b] text-[17px] flex-shrink-0">verified_user</span>
                    <span className="break-words">{p.notes}</span>
                  </div>

                  {/* Quantity Stepper & Buttons */}
                  <div className="pt-1 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#191c19] font-medium">Select Quantity:</span>
                      <div className="flex items-center rounded-lg bg-[#edeee9] p-1">
                        <button
                          aria-label="Reduce quantity"
                          onClick={() => handleQtyChange(p.id, p.minQty ? -p.minQty : -1, p.minQty || 1)}
                          className="h-8 w-8 rounded bg-white text-[#191c19] font-bold flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-sm hover:bg-[#f8faf4]"
                          type="button"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-[#191c19] min-w-[3.5rem] text-center">
                          {currentQty} {p.unit}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => handleQtyChange(p.id, p.minQty ? p.minQty : 1, p.minQty || 1)}
                          className="h-8 w-8 rounded bg-white text-[#191c19] font-bold flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-sm hover:bg-[#f8faf4]"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => onAddToCart(p, currentQty)}
                        className="min-h-[44px] px-2 sm:px-3 rounded-xl bg-white border border-[#003b1b] text-[#003b1b] font-bold text-xs shadow-sm hover:bg-[#b1f2be]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[17px] flex-shrink-0">add_shopping_cart</span>
                        <span className="truncate">Add {p.minQty ? `${currentQty}kg` : 'to Basket'}</span>
                      </button>
                      <button
                        onClick={() => onDirectBuy(p, currentQty)}
                        className="min-h-[44px] px-2 sm:px-3 rounded-xl bg-[#14532d] text-white font-bold text-xs shadow-md hover:bg-[#003b1b] active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[17px] flex-shrink-0">bolt</span>
                        <span className="truncate">Buy Direct</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Community Impact Snippet */}
      <section className="px-4 pt-1 pb-4">
        <div className="bg-[#f3f4ef] border border-[#c0c9be]/30 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-[#b1f2be] flex items-center justify-center flex-shrink-0 text-[#003b1b]">
            <span className="material-symbols-outlined text-[24px]">handshake</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h5 className="font-bold text-sm text-[#191c19] leading-tight">
              Farmer Direct Guarantee
            </h5>
            <p className="text-xs text-[#404941] leading-normal mt-0.5">
              Every rupee spent directly credits the grower’s Kisan UPI account within 3 hours of order placement.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Floating Mini-Cart Indicator */}
      {cartCount > 0 && (
        <aside
          aria-live="polite"
          className="fixed bottom-22 left-4 right-4 z-40 max-w-lg mx-auto bg-[#14532d] text-white rounded-xl shadow-xl p-3 flex items-center justify-between transition-all transform animate-in slide-in-from-bottom"
          id="floating-cart"
          role="status"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/15 flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[22px]">shopping_bag</span>
              <span className="absolute -top-1.5 -right-1.5 bg-[#fe932c] text-[#663500] text-[10px] font-bold h-4 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Direct Basket
              </span>
              <span className="text-xs text-[#87c695]">
                Subtotal: <strong className="text-white">₹{cartTotal.toFixed(2)}</strong> (Direct Farm Gate)
              </span>
            </div>
          </div>
          <button
            onClick={onViewBasket}
            className="h-10 px-3.5 rounded-lg bg-[#fe932c] text-[#663500] font-bold text-xs sm:text-sm flex items-center gap-1 shadow-sm active:scale-95 transition-transform flex-shrink-0 cursor-pointer hover:bg-[#ffdcc3]"
            type="button"
          >
            <span>View Basket</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </aside>
      )}
    </div>
  );
};
