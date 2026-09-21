import React, { useState } from 'react';
import { ASSETS, INITIAL_PRODUCE } from '../data/mockData';
import { Language, ProduceListing, UserProfile } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';

interface ProfileScreenProps {
  language: Language;
  userProfile: UserProfile;
  isAuthenticated: boolean;
  onLogout: () => void;
  onOpenOnboarding: (step?: 'language' | 'auth' | 'profile' | 'verification') => void;
  onAddToCart: (item: ProduceListing, qty: number) => void;
  onShowToast: (title: string, sub?: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  language,
  userProfile,
  isAuthenticated,
  onLogout,
  onOpenOnboarding,
  onAddToCart,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'account' | 'producers'>('account');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(1240);
  const [showAppreciationModal, setShowAppreciationModal] = useState(false);
  const [appreciationNote, setAppreciationNote] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(50);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
      onShowToast('Unfollowed', 'You will no longer receive harvest alerts');
    } else {
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
      onShowToast('Following Farm!', 'You will get notified when tomorrow’s harvest goes live');
    }
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAppreciationModal(false);
    onShowToast(
      'Appreciation Sent!',
      `Your note & ₹${selectedTip} direct thank-you tip transferred to the farmer's UPI`
    );
    setAppreciationNote('');
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-32 pt-2 px-3 sm:px-4 flex flex-col gap-4">
      {/* Top Navigation Tabs: My Account & Settings vs Producer Directory */}
      <div className="flex bg-[#edeee9] p-1 rounded-2xl border border-[#c0c9be]/40">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'bg-white text-[#003b1b] shadow-xs'
              : 'text-[#404941] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
          <span>{userProfile.role === 'consumer' ? t('tabConsumerProfile', language) : t('tabProfiles', language)}</span>
        </button>
        <button
          onClick={() => setActiveTab('producers')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'producers'
              ? 'bg-white text-[#003b1b] shadow-xs'
              : 'text-[#404941] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">agriculture</span>
          <span>
            {userProfile.role === 'consumer'
              ? (language === 'hi' ? 'हमारे किसान' : 'Verified Farmers')
              : (language === 'hi' ? 'किसान समुदाय' : 'Producer Showcase')}
          </span>
        </button>
      </div>

      {/* TAB 1: MY ACCOUNT, AUTHENTICATION & LOCKED SETTINGS */}
      {activeTab === 'account' && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          {isAuthenticated && userProfile.name ? (
            <>
              {/* User Identity Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#c0c9be]/40 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#14532d] text-white text-xl font-bold flex items-center justify-center ring-4 ring-[#b1f2be]">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="font-['Outfit'] font-bold text-lg text-[#191c19] leading-tight">
                          {userProfile.name}
                        </h2>
                        {userProfile.role === 'farmer' ? (
                          userProfile.farmerVerification?.status === 'verified' || (userProfile.isVerified && !userProfile.farmerVerification) ? (
                            <span className="bg-[#b1f2be] text-[#00210d] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-[#87c695]">
                              <span className="material-symbols-outlined text-[13px] text-[#003b1b]">verified_user</span>
                              <span>Verified Farmer</span>
                            </span>
                          ) : (
                            <span className="bg-[#ffb95f]/30 text-[#904d00] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-[#ffb95f]/60">
                              <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                              <span>Pending Verification</span>
                            </span>
                          )
                        ) : (
                          <span className="bg-[#b1f2be] text-[#00210d] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">verified</span>
                            <span>Verified Consumer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#717970] font-mono mt-0.5">
                        +91 {userProfile.phone}
                      </span>
                      <span className="text-xs font-semibold text-[#003b1b] capitalize mt-0.5">
                        {userProfile.role === 'farmer'
                          ? '🌾 Farmer / Producer (किसान / उत्पादक)'
                          : '🛒 Consumer / Buyer (उपभोक्ता)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Farmer Identity & Certificate Verification Card */}
                {userProfile.role === 'farmer' && (
                  userProfile.farmerVerification?.status === 'pending' ? (
                    <div className="bg-[#fff4e5] border border-[#ffb95f]/70 rounded-xl p-3.5 space-y-2.5 text-xs text-[#904d00]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#904d00]">
                          <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                          <span>Pending Farmer Verification</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#fe932c] text-[#663500] rounded font-bold text-[10px]">
                          Under Review
                        </span>
                      </div>
                      <p className="text-[11px] text-[#717970] leading-relaxed">
                        Agricultural documents ({userProfile.farmerVerification?.docType?.toUpperCase()}: {userProfile.farmerVerification?.docNumber}) are awaiting nodal officer review. Produce listing and selling tools are restricted until verification is complete.
                      </p>
                      <button
                        onClick={() => onOpenOnboarding('verification')}
                        className="w-full py-2 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Fast-Track Instant E-Verification (AgriStack / PM-KISAN)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#eafaf1] border border-[#b1f2be] rounded-xl p-3.5 space-y-2 text-xs text-[#003b1b]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-[#003b1b]">
                          <span className="material-symbols-outlined text-[20px] text-[#003b1b]">shield</span>
                          <span>Verified Agricultural Producer</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#003b1b] text-white rounded font-bold text-[10px]">
                          AgriStack Active
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#404941]">
                        <div className="bg-white/80 p-2 rounded-lg border border-[#c0c9be]/30">
                          <span className="text-[10px] text-[#717970] block">Document Authenticated</span>
                          <span className="font-bold text-[#191c19]">
                            {userProfile.farmerVerification?.docType ? userProfile.farmerVerification.docType.toUpperCase() : 'PM-KISAN ID'}
                          </span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-[#c0c9be]/30">
                          <span className="text-[10px] text-[#717970] block">Credential Number</span>
                          <span className="font-mono font-bold text-[#191c19]">
                            {userProfile.farmerVerification?.docNumber || 'PMK-MH-9812450'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#14532d] pt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Full Kisaan Hub Access: Produce listing, direct UPI payouts, and EV logistics enabled.</span>
                      </div>
                    </div>
                  )
                )}

                {/* Consumer Account Feature Summary */}
                {userProfile.role === 'consumer' && (
                  <div className="bg-[#f3f4ef] rounded-xl p-3 flex flex-col gap-1.5 text-xs border border-[#c0c9be]/30">
                    <span className="text-[11px] text-[#717970] font-semibold uppercase tracking-wider">
                      {language === 'hi' ? 'उपभोक्ता विशेषाधिकार' : 'Consumer Account Privileges'}
                    </span>
                    <div className="flex items-center gap-2 text-[#003b1b] font-medium flex-wrap">
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#c0c9be]/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#22c55e]">check_circle</span>
                        {language === 'hi' ? 'सीधा खेत कनेक्शन' : 'Direct Farm Harvests'}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#c0c9be]/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#22c55e]">check_circle</span>
                        {language === 'hi' ? 'शून्य बिचौलिया मुनाफा' : 'Zero Middlemen Markup'}
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-[#c0c9be]/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#22c55e]">check_circle</span>
                        {language === 'hi' ? 'खेत से थाली ट्रैकिंग' : 'Live Batch Traceability'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Farm details if entered for farmer */}
                {userProfile.role === 'farmer' && (userProfile.farmName || userProfile.farmSizeAcres) && (
                  <div className="bg-[#f3f4ef] rounded-xl p-3 flex items-center justify-between text-xs border border-[#c0c9be]/30">
                    <div>
                      <span className="text-[11px] text-[#717970] block">Farm Enterprise</span>
                      <span className="font-bold text-[#191c19]">{userProfile.farmName || 'Private Agro Farm'}</span>
                    </div>
                    {userProfile.farmSizeAcres && (
                      <span className="px-2 py-1 bg-white rounded-lg font-bold text-[#003b1b] border border-[#c0c9be]/30">
                        {userProfile.farmSizeAcres} Acres
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Locked Preferences Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#ffb95f]/50 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#904d00]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                    <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                      Locked Regional Preferences
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#904d00] bg-[#fff4e5] px-2 py-0.5 rounded border border-[#ffb95f]/40">
                    Locked While Logged In
                  </span>
                </div>

                <p className="text-xs text-[#404941] leading-relaxed">
                  Your agricultural region and language are locked to this active session. This ensures that direct mandi prices, hyper-local weather alerts, and transport routes remain strictly synchronized.
                </p>

                {/* Preference Row: Region */}
                <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#003b1b] text-[20px]">
                      location_on
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#717970] font-medium">
                        Active Agricultural Region
                      </span>
                      <span className="text-xs font-bold text-[#191c19]">
                        {userProfile.district}, {userProfile.state}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#717970] flex items-center gap-1 font-semibold bg-[#edeee9] px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Cannot Edit</span>
                  </span>
                </div>

                {/* Preference Row: Language */}
                <div className="p-3 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#003b1b] text-[20px]">
                      translate
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#717970] font-medium">
                        Locked Display Language
                      </span>
                      <span className="text-xs font-bold text-[#191c19]">
                        {currentLangObj.nativeLabel} ({currentLangObj.label})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#717970] flex items-center gap-1 font-semibold bg-[#edeee9] px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Cannot Edit</span>
                  </span>
                </div>

                {/* Locked Notice Message */}
                <div className="bg-[#fff4e5] text-[#663500] p-3 rounded-xl text-xs flex items-start gap-2 border border-[#ffb95f]/30">
                  <span className="material-symbols-outlined text-[18px] text-[#904d00] flex-shrink-0">
                    info
                  </span>
                  <span>
                    To change your district, state, or language script, you must log out of Annapurna. Logging out clears the session state and unlocks language and region selection.
                  </span>
                </div>
              </div>

              {/* Accessible & Prominent Logout Section */}
              <div className="bg-white rounded-2xl p-4 border border-[#ba1a1a]/20 shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#191c19]">Session Management</span>
                  <span className="text-[11px] text-[#717970]">Active Mobile Session</span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full min-h-[48px] bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span>Log Out of Annapurna ({t('logout', language)})</span>
                </button>
              </div>
            </>
          ) : (
            /* Unauthenticated View: Prompt to Log In */
            <div className="bg-white rounded-2xl p-6 border border-[#c0c9be]/40 shadow-sm flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#f3f4ef] text-[#003b1b] flex items-center justify-center">
                <span className="material-symbols-outlined text-[36px]">account_circle</span>
              </div>
              <h2 className="font-['Outfit'] font-bold text-xl text-[#191c19]">
                You Are Currently in Guest Mode
              </h2>
              <p className="text-xs text-[#404941] max-w-sm leading-relaxed">
                Log in with your 10-digit phone number and OTP to register your personal details, unlock farmer listings, and set your locked regional hub.
              </p>
              <button
                onClick={() => onOpenOnboarding('auth')}
                className="mt-2 min-h-[48px] px-6 bg-[#003b1b] hover:bg-[#14532d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>{t('loginWithOtp', language)}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCER SHOWCASE (COMMUNITY FARMS & TRANSPARENCY) */}
      {activeTab === 'producers' && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          {/* Hero Farm Banner & Avatar */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md">
            <div className="relative h-44 w-full bg-[#14532d] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Organic Farmland"
                src={ASSETS.heroFarm}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">yard</span>
                <span>Sahyadri Organic Cluster</span>
              </div>
            </div>

            {/* Profile Avatar Strip */}
            <div className="px-4 -mt-12 relative z-10 flex items-end justify-between gap-3 pb-3">
              <div className="relative flex-shrink-0">
                <img
                  className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white"
                  alt="Verified Master Producer"
                  src={ASSETS.gurpreetWarmPortrait}
                />
                <span className="absolute bottom-0 right-0 bg-[#14532d] text-white rounded-full p-1 shadow-md">
                  <span className="material-symbols-outlined text-[14px] block" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={toggleFollow}
                  className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer ${
                    isFollowing
                      ? 'bg-[#edeee9] text-[#191c19] hover:bg-[#e7e9e3]'
                      : 'bg-[#14532d] text-white hover:bg-[#003b1b]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isFollowing ? 'check' : 'notifications_active'}
                  </span>
                  <span>{isFollowing ? 'Following' : 'Follow Farm'}</span>
                </button>
                <button
                  onClick={() => setShowAppreciationModal(true)}
                  className="h-9 px-3 rounded-xl bg-[#fe932c] text-[#663500] font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-[#ffdcc3]"
                  title="Send appreciation note & direct tip"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>Tip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Farm Info */}
          <div className="bg-white rounded-2xl p-4 border border-[#c0c9be]/30 shadow-sm flex flex-col gap-2">
            <h1 className="font-['Outfit'] font-bold text-xl text-[#191c19] leading-tight">
              Featured Community Producer: Sardar Gurpreet
            </h1>
            <p className="text-xs text-[#404941] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#717970]">location_on</span>
              <span>Nashik Organic Valley, Maharashtra • 18 Acres Natural Cultivation</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="bg-[#f3f4ef] px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs text-[#191c19]">
                <span className="material-symbols-outlined text-[16px] text-[#fe932c]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold">4.9</span>
                <span className="text-[#717970]">(342 verified buyer reviews)</span>
              </div>
              <div className="bg-[#f3f4ef] px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs text-[#191c19]">
                <span className="material-symbols-outlined text-[16px] text-[#14532d]">groups</span>
                <span className="font-bold">{followerCount}</span>
                <span className="text-[#717970]">Household Followers</span>
              </div>
            </div>
          </div>

          {/* Sustainable Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-2.5 shadow-sm flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[#14532d] text-[24px]">compost</span>
              <span className="text-xs font-bold text-[#191c19] mt-1 leading-tight">Desi Cow Dung</span>
              <span className="text-[10px] text-[#717970]">Jeevamrut Enriched</span>
            </div>
            <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-2.5 shadow-sm flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[24px]">science</span>
              <span className="text-xs font-bold text-[#191c19] mt-1 leading-tight">Zero Urea</span>
              <span className="text-[10px] text-[#717970]">Residue Free Tested</span>
            </div>
            <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-2.5 shadow-sm flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[#003b1b] text-[24px]">water_drop</span>
              <span className="text-xs font-bold text-[#191c19] mt-1 leading-tight">Solar Drip</span>
              <span className="text-[10px] text-[#717970]">Clean Ground Water</span>
            </div>
          </div>

          {/* Farm Story */}
          <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
            <h2 className="font-['Outfit'] font-bold text-base text-[#191c19]">
              Transparent Revenue Guarantee
            </h2>
            <p className="text-xs text-[#404941] leading-relaxed">
              On the Annapurna Direct platform, verified farmers receive ₹88 for every ₹100 paid by the consumer. In traditional APMC mandi chains, farmers receive an average of only ₹42 after middleman cuts.
            </p>
            <div className="bg-[#f3f4ef] rounded-lg p-3 flex items-center justify-between text-xs">
              <span className="text-[#14532d] font-bold">₹88 / ₹100 Direct Farmer Payout</span>
              <span className="text-[#717970]">vs ₹42 APMC Middleman Mandi</span>
            </div>
          </div>

          {/* Harvest Lots */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
              Today's Live Farm Lots
            </h3>
            <div className="space-y-2.5">
              {INITIAL_PRODUCE.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#c0c9be]/30 rounded-xl p-3 shadow-sm flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-[#191c19] truncate">{p.name}</span>
                      <span className="text-[11px] text-[#717970]">
                        ₹{p.price}/{p.unit} • {p.harvestTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(p, 1)}
                    className="px-3 py-1.5 bg-[#003b1b] text-white rounded-lg text-xs font-bold hover:bg-[#14532d] cursor-pointer flex-shrink-0"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Direct Farmer Tip & Appreciation Modal */}
      {showAppreciationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#c0c9be]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#003b1b]">
                <span className="material-symbols-outlined text-[22px] text-[#fe932c]">favorite</span>
                <span className="font-['Outfit'] font-bold text-base">Direct Kisan Tip</span>
              </div>
              <button
                onClick={() => setShowAppreciationModal(false)}
                className="w-7 h-7 rounded-full bg-[#f3f4ef] flex items-center justify-center text-[#717970] cursor-pointer hover:bg-[#e7e9e3]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#404941]">
              100% of tips are transferred instantly to the farmer's registered UPI without any deduction.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 100, 200].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setSelectedTip(tip)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedTip === tip
                      ? 'bg-[#fe932c] text-white border-[#fe932c]'
                      : 'bg-[#f3f4ef] text-[#191c19] border-[#c0c9be]/40 hover:bg-[#e7e9e3]'
                  }`}
                >
                  ₹{tip}
                </button>
              ))}
            </div>

            <textarea
              value={appreciationNote}
              onChange={(e) => setAppreciationNote(e.target.value)}
              placeholder="Add a thank you note for tomorrow's harvest (optional)..."
              rows={2}
              className="w-full p-2.5 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/60 text-xs text-[#191c19] focus:outline-none focus:ring-2 focus:ring-[#003b1b]"
            ></textarea>

            <button
              onClick={handleSendNote}
              className="w-full py-2.5 bg-[#003b1b] text-white font-bold text-xs rounded-xl hover:bg-[#14532d] cursor-pointer shadow-md transition-all"
            >
              Send ₹{selectedTip} Direct Tip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
