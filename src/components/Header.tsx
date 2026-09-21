import React, { useState } from 'react';
import { ASSETS } from '../data/mockData';
import { ActiveTab, Language, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';
import { useNetwork } from '../hooks/useNetwork';

interface HeaderProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  cartCount: number;
  userProfile: UserProfile;
  onOpenOnboarding: (step?: 'language' | 'auth' | 'profile' | 'verification') => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenBasket?: () => void;
  onOpenNetworkModal?: () => void;
  onOpenAdvisorModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onSelectLanguage,
  cartCount,
  userProfile,
  onOpenOnboarding,
  isAuthenticated,
  onLogout,
  onOpenBasket,
  onOpenNetworkModal,
  onOpenAdvisorModal
}) => {
  const { isOnline, status, queue } = useNetwork();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showLockedLangAlert, setShowLockedLangAlert] = useState(false);
  const [showLockedRegionAlert, setShowLockedRegionAlert] = useState(false);

  const getSubTitle = () => {
    switch (currentTab) {
      case 'farmer-hub':
        return t('tabKisaanHub', language);
      case 'market':
        return userProfile.role === 'farmer' ? t('tabMandiRates', language) : t('tabMarket', language);
      case 'track-and-trace':
        return t('tabTrack', language);
      case 'profiles':
        return userProfile.role === 'farmer' ? t('tabProfiles', language) : t('tabConsumerProfile', language);
      case 'orders':
        return userProfile.role === 'farmer' ? t('tabDispatchedOrders', language) : t('tabOrders', language);
      default:
        return t('appTagline', language);
    }
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleLanguageClick = () => {
    if (isAuthenticated) {
      setShowLockedLangAlert((prev) => !prev);
    } else {
      setShowLangDropdown((prev) => !prev);
    }
  };

  const handleRegionClick = () => {
    if (isAuthenticated) {
      setShowLockedRegionAlert((prev) => !prev);
    } else {
      onOpenOnboarding('profile');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-[#f8faf4]/95 backdrop-blur-xl border-b border-[#c0c9be]/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Primary Top Header Row */}
      <div className="max-w-5xl mx-auto h-14 sm:h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Subtitle (Flexible, truncated, zero overflow) */}
        <button
          onClick={() => onSelectTab('welcome')}
          className="flex items-center gap-2 min-w-0 flex-shrink text-left cursor-pointer group"
          title="Return to Welcome Screen"
        >
          <img
            alt="Annapurna Logo"
            className="h-7 w-auto sm:h-8 object-contain flex-shrink-0 transition-transform group-hover:scale-105"
            src={ASSETS.logo}
          />
          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-['Outfit'] font-bold text-base sm:text-lg text-[#003b1b] leading-tight truncate">
                {t('appName', language)}
              </span>
              <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#14532d]/10 text-[#003b1b] whitespace-nowrap flex-shrink-0">
                {userProfile.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}
              </span>
              <span className="text-[#c0c9be] text-xs font-bold hidden md:inline">•</span>
              <span className="text-xs text-[#404941] truncate font-medium hidden md:inline">
                {getSubTitle()}
              </span>
            </div>
            <span className="text-[11px] text-[#717970] truncate hidden xs:block leading-tight">
              {t('appTagline', language)}
            </span>
          </div>
        </button>

        {/* Region Location Badge (Desktop/Tablet) */}
        <div className="relative hidden md:block">
          <button
            onClick={handleRegionClick}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              isAuthenticated
                ? 'bg-[#edeee9] text-[#191c19] border-[#c0c9be]/50 hover:bg-[#e7e9e3]'
                : 'bg-[#b1f2be]/40 text-[#00210d] border-[#14532d]/30 hover:bg-[#b1f2be]'
            }`}
            title={
              isAuthenticated
                ? `Region locked: ${userProfile.district}, ${userProfile.state} (Log out to change)`
                : 'Click to select agricultural region'
            }
          >
            <span className="material-symbols-outlined text-[15px] text-[#003b1b]">
              {isAuthenticated ? 'lock' : 'location_on'}
            </span>
            <span className="truncate max-w-[130px]">
              {userProfile.district && userProfile.state
                ? `${userProfile.district}, ${userProfile.state.slice(0, 2).toUpperCase()}`
                : 'Select Region'}
            </span>
            {isAuthenticated ? (
              <span className="text-[10px] text-[#717970] font-normal uppercase">(Locked)</span>
            ) : (
              <span className="material-symbols-outlined text-[14px] text-[#717970]">
                arrow_drop_down
              </span>
            )}
          </button>
        </div>

        {/* Action Controls: Network Indicator + AI Advisor + Language Dropdown + Cart + Profile + Login/Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Real-Time Network Indicator (Tablet & Desktop) */}
          <button
            onClick={onOpenNetworkModal}
            className={`hidden sm:flex h-9 px-2.5 rounded-full items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
              isOnline
                ? 'bg-[#b1f2be]/40 text-[#00210d] border-[#14532d]/25 hover:bg-[#b1f2be]'
                : 'bg-[#ffb95f]/30 text-[#904d00] border-[#904d00]/30 hover:bg-[#ffb95f]/40 animate-pulse'
            }`}
            title={`Network: ${isOnline ? 'Online Mode (Cloud Active)' : 'Offline Mode (Local Cache Active)'}`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#14532d]' : 'bg-[#904d00]'}`} />
            <span className="material-symbols-outlined text-[15px]">
              {isOnline ? 'wifi' : 'wifi_off'}
            </span>
            <span className="hidden md:inline font-bold">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {queue.length > 0 && (
              <span className="bg-[#fe932c] text-[#663500] text-[9px] px-1 rounded-full font-extrabold">
                {queue.length}
              </span>
            )}
          </button>

          {/* Kisaan AI Advisor / Help Trigger */}
          {onOpenAdvisorModal && (
            <button
              onClick={onOpenAdvisorModal}
              className="h-8 w-8 sm:h-9 sm:w-auto px-0 sm:px-2.5 rounded-full flex items-center justify-center gap-1 text-xs font-bold bg-[#edeee9] text-[#003b1b] hover:bg-[#b1f2be]/50 border border-[#c0c9be]/40 transition-colors cursor-pointer"
              title="Kisaan AI Sahayak (Advisor & Voice Support)"
            >
              <span className="material-symbols-outlined text-[17px] sm:text-[18px]">psychology</span>
              <span className="hidden md:inline text-[11px]">AI Sahayak</span>
            </button>
          )}

          {/* Multi-Language Dropdown (Tablet & Desktop) */}
          <div className="relative hidden sm:block">
            <button
              aria-label="Switch Regional Language"
              onClick={handleLanguageClick}
              className={`h-9 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border ${
                isAuthenticated
                  ? 'bg-[#edeee9] text-[#191c19] border-[#c0c9be]/50 hover:bg-[#e7e9e3]'
                  : 'bg-[#edeee9] text-[#191c19] border-[#c0c9be]/40 hover:bg-[#e7e9e3]'
              }`}
              title={
                isAuthenticated
                  ? `Language locked: ${currentLangObj.nativeLabel}`
                  : 'Change Regional Language'
              }
            >
              <span className="material-symbols-outlined text-[16px] text-[#003b1b]">
                {isAuthenticated ? 'lock' : 'translate'}
              </span>
              <span className="text-xs font-bold text-[#003b1b]">
                {currentLangObj.nativeLabel}
              </span>
              <span className="material-symbols-outlined text-[15px] text-[#717970]">
                {isAuthenticated ? 'info' : showLangDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Unauthenticated Language Menu Popover (Desktop) */}
            {!isAuthenticated && showLangDropdown && (
              <div className="absolute right-0 top-11 w-52 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-xl border border-[#c0c9be]/40 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#717970] border-b border-[#c0c9be]/30 mb-1">
                  Choose Language / भाषा चुनें
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#14532d] text-white'
                          : 'text-[#191c19] hover:bg-[#f3f4ef]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="leading-tight">{lang.nativeLabel}</span>
                        <span
                          className={`text-[10px] ${
                            isSelected ? 'text-[#87c695]' : 'text-[#717970]'
                          }`}
                        >
                          {lang.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consumer Dedicated Cart / Basket Button */}
          {userProfile.role === 'consumer' && onOpenBasket && (
            <button
              onClick={onOpenBasket}
              className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-[#edeee9] text-[#003b1b] hover:bg-[#b1f2be]/60 active:scale-95 border border-[#c0c9be]/40"
              title="Open My Farm Basket"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[20px] block">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#fe932c] text-[#663500] text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#f8faf4]">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Quick Orders Button (visible on tablet/desktop) */}
          <button
            onClick={() => onSelectTab('orders')}
            className={`hidden sm:flex relative p-2 rounded-full transition-colors cursor-pointer ${
              currentTab === 'orders'
                ? 'bg-[#b1f2be] text-[#00210d]'
                : 'bg-[#edeee9] text-[#191c19] hover:bg-[#e7e9e3]'
            }`}
            title={userProfile.role === 'farmer' ? 'Orders Dispatched' : 'My Orders'}
          >
            <span className="material-symbols-outlined text-[20px] block">
              {userProfile.role === 'farmer' ? 'local_shipping' : 'receipt_long'}
            </span>
          </button>

          {/* Profile & Account Button (visible on tablet/desktop) */}
          <button
            onClick={() => onSelectTab('profiles')}
            className="hidden sm:flex relative items-center justify-center cursor-pointer transition-transform active:scale-95"
            title={
              isAuthenticated
                ? `${userProfile.name} • ${userProfile.district}, ${userProfile.state}`
                : 'Guest Profile / Log In'
            }
          >
            <div className="w-8 h-8 rounded-full bg-[#14532d] text-white font-bold flex items-center justify-center text-xs ring-2 ring-[#b1f2be]">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
            </div>
            {isAuthenticated && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#f8faf4] bg-[#22c55e]"></span>
            )}
          </button>

          {/* Clear, Accessible Logout or Login Button */}
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="h-8 sm:h-9 px-2 sm:px-3 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-[#ba1a1a]/30"
              title="Log out and clear session"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden md:inline">{t('logout', language)}</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenOnboarding('auth')}
              className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#003b1b] text-white rounded-full text-xs font-bold hover:bg-[#14532d] transition-all cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap"
              title="Log in with Mobile OTP"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>{t('login', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Mobile Utility & Touch-Scroll Pill Menu (Mobile only, zero-clipping overflow-x-auto) */}
      <div className="sm:hidden w-full border-t border-[#c0c9be]/25 bg-[#f4f6f0]/95 backdrop-blur-md">
        <div className="w-full overflow-x-auto no-scrollbar py-1.5 px-3 flex items-center gap-1.5 touch-pan-x">
          {/* Language Label Icon */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#003b1b] bg-[#e7e9e3] rounded-full px-2 py-0.5 flex-shrink-0">
            <span className="material-symbols-outlined text-[13px]">translate</span>
            <span>Lang:</span>
          </div>

          {/* Horizontal Language Selection Pills */}
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    setShowLockedLangAlert(true);
                  } else {
                    onSelectLanguage(lang.code);
                  }
                }}
                className={`flex-shrink-0 h-7 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-[#14532d] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#e7e9e3] text-[#191c19] border border-[#c0c9be]/50'
                }`}
                title={lang.label}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#b1f2be]" />}
                <span>{lang.nativeLabel}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="w-px h-4 bg-[#c0c9be]/60 flex-shrink-0" />

          {/* Mobile Network Status Pill */}
          <button
            type="button"
            onClick={onOpenNetworkModal}
            className={`flex-shrink-0 h-7 px-2.5 rounded-full flex items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
              isOnline
                ? 'bg-[#b1f2be]/40 text-[#00210d] border-[#14532d]/20'
                : 'bg-[#ffb95f]/30 text-[#904d00] border-[#904d00]/30 animate-pulse'
            }`}
            title="Click to view network telemetry"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#14532d]' : 'bg-[#904d00]'}`} />
            <span className="material-symbols-outlined text-[13px]">{isOnline ? 'wifi' : 'wifi_off'}</span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            {queue.length > 0 && (
              <span className="bg-[#fe932c] text-[#663500] text-[9px] px-1 rounded-full font-extrabold">
                {queue.length}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-[#c0c9be]/60 flex-shrink-0" />

          {/* Mobile Region Location Pill */}
          <button
            type="button"
            onClick={handleRegionClick}
            className="flex-shrink-0 h-7 px-2.5 bg-white border border-[#c0c9be]/50 rounded-full text-xs font-semibold text-[#191c19] flex items-center gap-1 hover:bg-[#e7e9e3] cursor-pointer"
            title="Click to select region"
          >
            <span className="material-symbols-outlined text-[13px] text-[#003b1b]">
              {isAuthenticated ? 'lock' : 'location_on'}
            </span>
            <span className="truncate max-w-[110px]">
              {userProfile.district
                ? `${userProfile.district}, ${userProfile.state.slice(0, 2).toUpperCase()}`
                : 'Select Region'}
            </span>
          </button>
        </div>
      </div>

      {/* Locked Language Modal Overlay (Centered, safe from viewport edge clipping) */}
      {showLockedLangAlert && isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#ffb95f]/50 p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffb95f]/30 flex items-center justify-center flex-shrink-0 text-[#904d00]">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <div className="flex flex-col text-xs flex-1">
                <span className="font-bold text-sm text-[#191c19]">Language Locked to Session</span>
                <p className="text-[12px] text-[#404941] mt-1 leading-relaxed">
                  Your session is locked to <strong>{currentLangObj.nativeLabel} ({currentLangObj.label})</strong>. Log out to switch to another regional language.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c0c9be]/30">
              <button
                type="button"
                onClick={() => setShowLockedLangAlert(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#404941] hover:bg-[#f3f4ef] cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLockedLangAlert(false);
                  onLogout();
                }}
                className="px-3 py-1.5 bg-[#ba1a1a] text-white rounded-xl font-bold text-xs hover:bg-[#93000a] flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
                <span>Log Out to Switch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Locked Region Modal Overlay (Centered, safe from viewport edge clipping) */}
      {showLockedRegionAlert && isAuthenticated && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#ffb95f]/50 p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ffb95f]/30 flex items-center justify-center flex-shrink-0 text-[#904d00]">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <div className="flex flex-col text-xs flex-1">
                <span className="font-bold text-sm text-[#191c19]">Agricultural Region Locked</span>
                <p className="text-[12px] text-[#404941] mt-1 leading-relaxed">
                  Registered to <strong>{userProfile.district}, {userProfile.state}</strong>. Region is locked to guarantee accurate live mandi prices and direct transit dispatch.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#c0c9be]/30">
              <button
                type="button"
                onClick={() => setShowLockedRegionAlert(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#404941] hover:bg-[#f3f4ef] cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLockedRegionAlert(false);
                  onLogout();
                }}
                className="px-3 py-1.5 bg-[#ba1a1a] text-white rounded-xl font-bold text-xs hover:bg-[#93000a] flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">logout</span>
                <span>Log Out to Change</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
