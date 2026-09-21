import React from 'react';
import { ASSETS } from '../data/mockData';
import { Language, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';

interface WelcomeScreenProps {
  onSelectRole: (role: 'farmer' | 'consumer') => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  userProfile: UserProfile;
  onOpenOnboarding: (step?: 'language' | 'auth' | 'profile') => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectRole,
  language,
  onSelectLanguage,
  userProfile,
  onOpenOnboarding,
  isAuthenticated,
  onLogout
}) => {
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-28 pt-3 space-y-5">
      {/* 5-Language Regional Script Selector Bar */}
      <header className="bg-white rounded-2xl p-3 border border-[#c0c9be]/40 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#003b1b]">
            <span className="material-symbols-outlined text-[18px]">
              {isAuthenticated ? 'lock' : 'translate'}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              {t('chooseLanguage', language)}
            </span>
          </div>

          {isAuthenticated ? (
            <span className="text-[11px] font-bold text-[#904d00] flex items-center gap-1 bg-[#fff4e5] px-2 py-0.5 rounded-full border border-[#ffb95f]/40">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              <span>Locked</span>
            </span>
          ) : (
            <button
              onClick={() => onOpenOnboarding('language')}
              className="text-[11px] font-bold text-[#003b1b] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>All Scripts</span>
              <span className="material-symbols-outlined text-[14px]">tune</span>
            </button>
          )}
        </div>

        {isAuthenticated && (
          <div className="text-[11px] text-[#717970] bg-[#f3f4ef] px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2">
            <span>
              🔒 Language locked to <strong>{currentLangObj.nativeLabel}</strong> for this session.
            </span>
            <button
              onClick={onLogout}
              className="text-[#ba1a1a] font-bold hover:underline flex-shrink-0 cursor-pointer text-xs"
            >
              Logout to switch
            </button>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1.5 pt-0.5">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  if (!isAuthenticated) {
                    onSelectLanguage(l.code);
                  }
                }}
                disabled={isAuthenticated && !isSelected}
                className={`min-h-[44px] py-1.5 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                  isAuthenticated && !isSelected
                    ? 'opacity-40 cursor-not-allowed bg-[#edeee9] text-[#717970] border-transparent'
                    : isSelected
                    ? 'bg-[#14532d] text-white border-[#14532d] shadow-xs scale-102'
                    : 'bg-[#f3f4ef] text-[#404941] border-[#c0c9be]/30 hover:bg-[#e7e9e3] cursor-pointer'
                }`}
                type="button"
                title={
                  isAuthenticated
                    ? `Language locked: ${l.label} (Log out to change)`
                    : `${l.label} (${l.region})`
                }
              >
                <span className="text-xs leading-none font-bold truncate max-w-full">
                  {l.nativeLabel}
                </span>
                <span
                  className={`text-[9px] mt-0.5 truncate ${
                    isSelected ? 'text-[#87c695]' : 'text-[#717970]'
                  }`}
                >
                  {l.code.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Real-Time Mobile Login & Regional Status Banner */}
      {isAuthenticated && userProfile.name ? (
        <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold ring-2 ring-[#87c695]">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#87c695] text-[#00210d] flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-white truncate max-w-[170px] sm:max-w-none">
                  {userProfile.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono whitespace-nowrap">
                  +91 {userProfile.phone}
                </span>
              </div>
              <div className="text-xs text-[#87c695] flex items-center gap-1 mt-0.5 flex-wrap">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>{userProfile.district}, {userProfile.state}</span>
                <span className="text-white/40">•</span>
                <span className="capitalize">{userProfile.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="min-h-[44px] px-3.5 py-2 bg-white/15 hover:bg-[#ba1a1a] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 self-stretch sm:self-auto flex-shrink-0 border border-white/20 active:scale-98"
            title="Log out and clear session"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>{t('logout', language)}</span>
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#14532d] to-[#003b1b] text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white flex-shrink-0 mt-0.5 sm:mt-0">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white leading-tight">
                Guest Mode • Not Logged In
              </span>
              <p className="text-xs text-[#87c695] mt-1 leading-relaxed max-w-sm">
                Input your phone & region to lock local mandi rates
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenOnboarding('auth')}
            className="min-h-[44px] px-4 py-2.5 bg-white text-[#003b1b] rounded-xl text-xs font-bold hover:bg-[#b1f2be] transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-stretch sm:self-auto flex-shrink-0 shadow-xs active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px]">login</span>
            <span className="whitespace-nowrap">{t('loginWithOtp', language)}</span>
          </button>
        </div>
      )}

      {/* Welcoming Header Unit */}
      <section className="flex flex-col space-y-2">
        <div className="inline-flex items-center self-start space-x-2 px-3 py-1 rounded-full bg-[#b1f2be] text-[#00210d]">
          <span className="material-symbols-outlined text-[16px] text-[#003b1b]" style={{ fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
          <span className="text-xs font-bold tracking-wide">Direct Farm-to-Fork Movement</span>
        </div>
        <h1 className="font-['Outfit'] font-bold text-fluid-h1 text-[#191c19] leading-tight">
          {t('welcomeAnnapurna', language)}
        </h1>
        <p className="text-[#404941] text-xs sm:text-sm leading-relaxed max-w-xl">
          {t('appDescription', language)}
        </p>
      </section>

      {/* Split Interactive Role Cards */}
      <section className="flex flex-col space-y-4" id="role-selection-section">
        {/* Card A: Farmer Profile */}
        <article className="relative flex flex-col bg-white rounded-2xl shadow-md border border-[#c0c9be]/30 overflow-hidden transition-all duration-300 transform active:scale-[0.99] hover:shadow-lg">
          {/* Background banner */}
          <div className="relative h-28 w-full overflow-hidden bg-[#14532d]">
            <img
              className="w-full h-full object-cover opacity-50"
              alt="Farmer in organic crop field"
              src={ASSETS.farmerWelcomeBanner}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#003b1b]/30 to-white"></div>
            <div className="absolute top-3 left-4 flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#003b1b] shadow-sm">
                <span className="material-symbols-outlined text-[24px]">agriculture</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#003b1b] text-white text-xs font-semibold tracking-wide">
                Producers • उत्पादक
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col space-y-3 -mt-3 relative">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                  {t('imFarmer', language)}
                </h2>
                <span className="text-xs font-semibold text-[#003b1b] px-2.5 py-0.5 rounded-full bg-[#b1f2be] whitespace-nowrap">
                  Sell Produce
                </span>
              </div>
              <p className="text-xs text-[#404941] mt-1.5 leading-normal">
                Sell directly to families & bulk buyers. Keep 100% of your listed mandi value with zero broker commissions.
              </p>
            </div>

            {/* Perks List */}
            <ul className="space-y-1.5 py-1">
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#003b1b] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-xs font-semibold">Instant UPI payouts directly to bank</span>
              </li>
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#003b1b] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-xs font-semibold">Hyper-local weather & cold logistics route booking</span>
              </li>
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#003b1b] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span className="text-xs font-semibold">Guaranteed minimum support floor price</span>
              </li>
            </ul>

            {/* Big Green CTA */}
            <button
              className="w-full min-h-[48px] rounded-xl bg-[#003b1b] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:bg-[#14532d] active:scale-95 transition-all cursor-pointer"
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenOnboarding('auth');
                } else {
                  onSelectRole('farmer');
                }
              }}
              type="button"
            >
              <span>{t('enterAsFarmer', language)}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </article>

        {/* Card B: Consumer Profile */}
        <article className="relative flex flex-col bg-white rounded-2xl shadow-md border border-[#c0c9be]/30 overflow-hidden transition-all duration-300 transform active:scale-[0.99] hover:shadow-lg">
          {/* Background banner */}
          <div className="relative h-28 w-full overflow-hidden bg-[#674000]">
            <img
              className="w-full h-full object-cover opacity-50"
              alt="Farm fresh harvest basket"
              src={ASSETS.consumerWelcomeBanner}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#904d00]/20 to-white"></div>
            <div className="absolute top-3 left-4 flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#904d00] shadow-sm">
                <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#904d00] text-white text-xs font-semibold tracking-wide">
                Households • उपभोक्ता
              </span>
            </div>
          </div>

          <div className="p-4 flex flex-col space-y-3 -mt-3 relative">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                  {t('imConsumer', language)}
                </h2>
                <span className="text-xs font-semibold text-[#904d00] px-2.5 py-0.5 rounded-full bg-[#ffdcc3] whitespace-nowrap">
                  Buy Direct
                </span>
              </div>
              <p className="text-xs text-[#404941] mt-1.5 leading-normal">
                Order fresh farm-harvested crops within 24h of picking. Know exactly which farm grew your food.
              </p>
            </div>

            {/* Perks List */}
            <ul className="space-y-1.5 py-1">
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#904d00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-semibold">30-40% cheaper than supermarkets</span>
              </li>
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#904d00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-semibold">100% farm origin & harvest date traceability</span>
              </li>
              <li className="flex items-center space-x-2 text-[#191c19]">
                <span className="material-symbols-outlined text-[#904d00] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-semibold">Certified residue-free & lab tested fresh</span>
              </li>
            </ul>

            {/* Terracotta Accent CTA */}
            <button
              className="w-full min-h-[48px] rounded-xl bg-[#904d00] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:bg-[#674000] active:scale-95 transition-all cursor-pointer"
              onClick={() => onSelectRole('consumer')}
              type="button"
            >
              <span>{t('enterAsConsumer', language)}</span>
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </button>
          </div>
        </article>
      </section>

      {/* Transparent Model Explainer */}
      <section className="bg-[#f3f4ef] border border-[#c0c9be]/40 rounded-2xl p-4 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#191c19] font-bold">Fair Price Breakdown</span>
          <span className="text-xs text-[#003b1b] font-bold">100% Transparent</span>
        </div>
        {/* Stacked representation bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#e7e9e3]">
          <div className="h-full bg-[#003b1b]" style={{ width: '88%' }} title="Farmer Share: 88%"></div>
          <div className="h-full bg-[#fe932c]" style={{ width: '8%' }} title="Electric Transit: 8%"></div>
          <div className="h-full bg-[#2e6a41]" style={{ width: '4%' }} title="Platform: 4%"></div>
        </div>
        <div className="flex items-center justify-between text-[#404941] text-[11px] pt-1">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#003b1b] inline-block"></span>
            <span>Farmer: <strong>88%</strong></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#fe932c] inline-block"></span>
            <span>Electric Transit: <strong>8%</strong></span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#2e6a41] inline-block"></span>
            <span>Platform: <strong>4%</strong></span>
          </div>
        </div>
      </section>

      {/* Trust Reassurance Banner */}
      <footer className="bg-[#edeee9] border border-[#c0c9be]/30 rounded-2xl p-4 flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-[#003b1b]">
          <span className="material-symbols-outlined text-[#003b1b] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="text-[#191c19] font-['Outfit'] font-bold text-base">Guaranteed Fairness</span>
        </div>
        <p className="text-xs text-[#404941] leading-relaxed">
          Over <strong className="text-[#191c19] font-semibold">14,200+ Verified Farmers</strong> across 42 agro-districts • 
          <strong className="text-[#191c19] font-semibold"> ₹4.2 Cr Direct Savings Transferred</strong> to date • 
          100% Zero Middleman Guarantee backed by digital weight verification.
        </p>
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center space-x-1 text-[#404941] text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#003b1b]">scale</span>
            <span>Mandi Verified</span>
          </div>
          <div className="flex items-center space-x-1 text-[#404941] text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#003b1b]">speed</span>
            <span>Same Day Dispatch</span>
          </div>
          <div className="flex items-center space-x-1 text-[#404941] text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#003b1b]">lock</span>
            <span>Safe Escrow UPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
