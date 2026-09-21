import React, { useState } from 'react';
import { ASSETS, INITIAL_ORDERS } from '../data/mockData';
import { DirectOrder, Language, UserProfile } from '../types';
import { SmartRecommendations } from './SmartRecommendations';
import { t } from '../utils/translations';

interface FarmerHubScreenProps {
  language: Language;
  userProfile: UserProfile;
  orders?: DirectOrder[];
  onNavigateToOrder?: (orderId: string) => void;
  onNavigateToDispatchedOrders?: () => void;
  onShowToast: (title: string, sub?: string) => void;
  onOpenOnboarding?: (step?: 'language' | 'auth' | 'profile' | 'verification') => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const FarmerHubScreen: React.FC<FarmerHubScreenProps> = ({
  language,
  userProfile,
  orders: propOrders,
  onNavigateToOrder,
  onNavigateToDispatchedOrders,
  onShowToast,
  onOpenOnboarding,
  isAuthenticated = false,
  onLogout
}) => {
  const isHindi = language === 'hi';
  const orders = propOrders || INITIAL_ORDERS;

  // Verification checks
  const isVerifiedFarmer = userProfile.farmerVerification?.status === 'verified' || (userProfile.isVerified && !userProfile.farmerVerification);
  const isPendingVerification = userProfile.farmerVerification?.status === 'pending';

  // State for interactive actions
  const [order8841Accepted, setOrder8841Accepted] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);

  // Rate updating state
  const [tomatoRate, setTomatoRate] = useState(28.5);

  // New produce form state
  const [newCropName, setNewCropName] = useState('');
  const [newCropQty, setNewCropQty] = useState('500');
  const [newCropPrice, setNewCropPrice] = useState('32');
  const [newCropGrade, setNewCropGrade] = useState('Grade A');

  const handleAcceptOrder = (orderId: string) => {
    if (isPendingVerification) {
      onShowToast(
        'Farmer Verification Required',
        'Authenticate your PM-KISAN, KCC, or Land Record credentials to dispatch produce.'
      );
      onOpenOnboarding?.('verification');
      return;
    }
    setOrder8841Accepted(true);
    onShowToast(
      isHindi ? `ऑर्डर #${orderId} स्वीकार किया गया!` : `Order #${orderId} Accepted!`,
      isHindi ? 'पैकिंग और डिस्पैच लेबल तैयार है' : 'Transit QR barcode and packaging label generated'
    );
  };

  const handleListProduceClick = () => {
    if (isPendingVerification) {
      onShowToast(
        'Farmer Verification Required',
        'Produce listing and selling tools are restricted until agricultural credentials are verified.'
      );
      onOpenOnboarding?.('verification');
      return;
    }
    setShowListModal(true);
  };

  const handleRateClick = () => {
    if (isPendingVerification) {
      onShowToast(
        'Farmer Verification Required',
        'Authenticate your farmer credentials to update live market rates.'
      );
      onOpenOnboarding?.('verification');
      return;
    }
    setShowRateModal(true);
  };

  const handleReschedule = (orderId: string) => {
    onShowToast(
      isHindi ? `री-शेड्यूल अनुरोध भेजा गया (#${orderId})` : `Reschedule Sent for #${orderId}`,
      isHindi ? 'ग्राहक को नए समय स्लॉट दिए गए हैं' : 'Buyer notified for preferred slot modification'
    );
  };

  const handleCallDriver = () => {
    onShowToast(
      isHindi ? 'चालक सुनील पवार से संपर्क किया जा रहा है' : 'Connecting to Logistics Driver',
      'EV Van Transit #MH-12-8821'
    );
  };

  const handleListProduceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName) return;
    setShowListModal(false);
    onShowToast(
      isHindi ? `फसल "${newCropName}" लाइव लिस्ट हो गई!` : `Crop "${newCropName}" Listed Live!`,
      isHindi ? `${newCropQty} किग्रा @ ₹${newCropPrice}/किग्रा खरीदारों को दृश्यमान है` : `${newCropQty} kg @ ₹${newCropPrice}/kg visible to direct buyers`
    );
    setNewCropName('');
  };

  const handleSaveRate = () => {
    setShowRateModal(false);
    onShowToast(
      isHindi ? 'टमाटर की दर अपडेट हो गई!' : 'Tomato Price Updated!',
      `₹${tomatoRate.toFixed(2)} / kg live across marketplace`
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-28 pt-2 flex flex-col gap-4">
      {/* Farmer Profile Header Strip */}
      <div className="px-4 pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-13 h-13 rounded-full bg-[#14532d] text-white text-lg font-bold flex items-center justify-center ring-2 ring-[#b1f2be] shadow-xs">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '👨‍🌾'}
            </div>
            {isAuthenticated && (
              isVerifiedFarmer ? (
                <span className="absolute -bottom-1 -right-1 bg-[#14532d] text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm" title="Verified Farmer">
                  <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </span>
              ) : (
                <span className="absolute -bottom-1 -right-1 bg-[#fe932c] text-[#663500] rounded-full w-5 h-5 flex items-center justify-center shadow-sm" title="Pending Verification">
                  <span className="material-symbols-outlined text-[13px]">
                    hourglass_top
                  </span>
                </span>
              )
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-['Outfit'] font-bold text-base sm:text-lg text-[#191c19] truncate">
                {userProfile.name || 'Guest Farmer'}
              </span>
              {isAuthenticated && (
                isVerifiedFarmer ? (
                  <span className="bg-[#b1f2be] text-[#00210d] px-1.5 py-0.2 rounded text-[10px] font-bold">
                    Verified Hub
                  </span>
                ) : (
                  <span className="bg-[#ffb95f]/30 text-[#904d00] px-1.5 py-0.2 rounded text-[10px] font-bold border border-[#ffb95f]/60">
                    Pending Verification
                  </span>
                )
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[#404941] flex-wrap mt-0.5">
              {isAuthenticated ? (
                <div
                  className="text-xs text-[#003b1b] font-bold flex items-center gap-1 bg-[#f3f4ef] px-2 py-0.5 rounded-lg border border-[#c0c9be]/40"
                  title="Region is locked while logged in. Log out to change."
                >
                  <span className="material-symbols-outlined text-[13px] text-[#904d00]">lock</span>
                  <span>{userProfile.district}, {userProfile.state}</span>
                  <span className="text-[10px] text-[#717970] font-normal">(Locked)</span>
                </div>
              ) : (
                <button
                  onClick={() => onOpenOnboarding?.('profile')}
                  className="text-xs text-[#003b1b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Select Region</span>
                  <span className="material-symbols-outlined text-[14px]">add_location</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            aria-label="Notifications"
            onClick={() => onShowToast(isHindi ? 'नई सूचनाएं उपलब्ध हैं' : '2 Pending Inquiries', 'From local consumer groups')}
            className="w-10 h-10 rounded-full bg-[#e7e9e3] flex items-center justify-center text-[#191c19] shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className="h-10 px-3 bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-[#ba1a1a]/30"
              title="Log Out of Session"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span className="hidden sm:inline">{t('logout', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* Farmer Verification Alert Banner when pending */}
      {isPendingVerification && (
        <div className="mx-4 bg-[#fff4e5] border-2 border-[#ffb95f] rounded-2xl p-4 space-y-2.5 text-xs text-[#904d00] shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-[#904d00]">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
              <span>Agricultural Identity Verification Required</span>
            </div>
            <span className="px-2 py-0.5 bg-[#fe932c] text-[#663500] rounded-full font-bold text-[10px]">
              Review Pending
            </span>
          </div>
          <p className="text-[11px] text-[#404941] leading-relaxed">
            Your submitted credentials ({userProfile.farmerVerification?.docType?.toUpperCase()}: {userProfile.farmerVerification?.docNumber}) are awaiting field officer validation. Produce listing and selling features are locked until certified.
          </p>
          <button
            onClick={() => onOpenOnboarding?.('verification')}
            className="w-full py-2.5 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Fast-Track Instant AgriStack E-Verification (Unlock Selling)</span>
          </button>
        </div>
      )}

      {/* Primary Action Button: List New Produce (Sticky/Prominent Placement) */}
      <div className="px-4">
        <button
          onClick={handleListProduceClick}
          className="w-full min-h-[56px] bg-[#fe932c] text-[#663500] rounded-xl flex items-center justify-between px-4 shadow-md active:bg-[#ffdcc3] transition-all cursor-pointer hover:shadow-lg"
          id="listProduceBtn"
        >
          <div className="flex items-center gap-3 py-1">
            <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              photo_camera
            </span>
            <div className="flex flex-col text-left">
              <span className="font-bold text-base text-[#663500] leading-tight">
                + List New Produce
              </span>
              <span className="text-xs text-[#663500]/90 leading-tight">
                नई फसल जोड़ें (कैमरा या गैलरी)
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </button>
      </div>

      {/* Monthly Earnings Tracker Hero Card */}
      <div className="px-4">
        <div className="w-full bg-[#14532d] text-white rounded-xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden">
          {/* Decorative Earthy Grain Watermark */}
          <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none text-white">
            <span className="material-symbols-outlined text-[160px]">agriculture</span>
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs text-[#87c695] uppercase tracking-wider font-semibold block">
                Direct Selling Revenue • सीधी आय
              </span>
              <h2 className="font-['Outfit'] font-bold text-3xl sm:text-4xl text-white leading-none tracking-tight mt-1">
                ₹1,42,850
              </h2>
              <span className="text-xs text-[#87c695] block mt-1">
                This Month's Earnings • इस महीने की कमाई
              </span>
            </div>
            <div className="bg-[#003b1b] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[#b1f2be] text-[18px]">trending_up</span>
              <span className="text-xs text-[#b1f2be] font-bold">+28%</span>
            </div>
          </div>

          {/* Commission Saved Pill */}
          <div className="bg-[#003b1b]/80 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#b1f2be] text-[#00210d] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">savings</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#b1f2be] leading-tight">
                  + ₹28,400 Middleman Fee Saved
                </span>
                <span className="text-xs text-[#87c695] leading-tight">
                  0% बिचौलिया कमीशन (सीधा लाभ)
                </span>
              </div>
            </div>
            <span className="text-xs bg-[#96d5a3] text-[#12512c] px-2 py-1 rounded font-bold whitespace-nowrap">
              100% Direct
            </span>
          </div>

          {/* Payout Status */}
          <div className="bg-white/15 rounded-lg px-3 py-2 flex items-center gap-2 relative z-10">
            <span className="material-symbols-outlined text-[#ffdcc3] text-[20px] flex-shrink-0">
              account_balance
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#ffdcc3] font-bold leading-tight">
                Next Direct Bank Transfer
              </span>
              <span className="font-bold text-xs sm:text-sm text-white truncate leading-tight">
                Tomorrow • ₹34,200 via UPI (HDFC **4921)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action & Stats Overview */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <div className="bg-[#f3f4ef] border border-[#c0c9be]/30 p-3.5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#404941] mb-1">
            <span className="text-xs font-semibold">Active Harvests</span>
            <span className="material-symbols-outlined text-[22px] text-[#003b1b]">potted_plant</span>
          </div>
          <span className="font-['Outfit'] text-xl sm:text-2xl text-[#191c19] font-bold">3 Batches</span>
          <span className="text-xs text-[#717970] mt-1">3,300 kg listed</span>
        </div>
        <div className="bg-[#f3f4ef] border border-[#c0c9be]/30 p-3.5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#404941] mb-1">
            <span className="text-xs font-semibold">Pending Orders</span>
            <span className="material-symbols-outlined text-[22px] text-[#904d00]">pending_actions</span>
          </div>
          <span className="font-['Outfit'] text-xl sm:text-2xl text-[#904d00] font-bold">
            {order8841Accepted ? '0 Urgent' : '1 Urgent'}
          </span>
          <span className="text-xs text-[#717970] mt-1">
            {order8841Accepted ? 'All processed' : '₹750 awaiting accept'}
          </span>
        </div>
      </div>

      {/* Region-Based Smart Recommendations & Insights Feed */}
      <SmartRecommendations
        userProfile={userProfile}
        language={language}
        onShowToast={onShowToast}
        onChangeRegion={() => onOpenOnboarding?.('profile')}
        onListCropPrompt={(crop) => {
          setNewCropName(crop.name);
          setNewCropPrice(String(crop.price));
          setShowListModal(true);
        }}
      />

      {/* Section: Orders Dispatched (Farmer Perspective) */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#14532d] animate-pulse"></span>
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
              {isHindi ? 'भेजे गए ऑर्डर (डिस्पैच)' : 'Orders Dispatched'}
            </h3>
            <span className="text-[11px] text-[#404941] block">
              {isHindi ? 'खेत से निकले सक्रिय व पूर्ण डिस्पैच' : 'Active & fulfilled direct farm dispatches'}
            </span>
          </div>
        </div>
        {onNavigateToDispatchedOrders && (
          <button
            type="button"
            onClick={onNavigateToDispatchedOrders}
            className="text-xs font-bold text-[#003b1b] bg-[#b1f2be]/40 hover:bg-[#b1f2be] border border-[#14532d]/20 px-2.5 py-1 rounded-full transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <span>{isHindi ? 'सभी देखें' : 'View Ledger'}</span>
            <span className="font-semibold">({orders.length})</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        )}
      </div>

      <div className="px-4 space-y-3">
        {orders.slice(0, 3).map((order) => {
          const isDelivered = order.status === 'Delivered';
          const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div
              key={order.id}
              className="bg-white border border-[#c0c9be]/35 rounded-xl p-4 shadow-xs hover:shadow-sm flex flex-col gap-3 transition-all"
            >
              {/* Top row: Order ID, Timestamp, Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-[#b1f2be]/40 text-[#003b1b] border border-[#14532d]/20 px-2 py-0.5 rounded font-bold font-mono">
                      #{order.id}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isDelivered
                          ? 'bg-[#e7e9e3] text-[#404941]'
                          : order.status === 'Picked up from Farm'
                          ? 'bg-[#ffdcc3] text-[#663500]'
                          : 'bg-[#14532d] text-white'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDelivered
                            ? 'bg-[#717970]'
                            : order.status === 'Picked up from Farm'
                            ? 'bg-[#fe932c]'
                            : 'bg-[#b1f2be] animate-ping'
                        }`}
                      ></span>
                      {order.status}
                    </span>
                  </div>

                  {/* Buyer Name & Location */}
                  <h4 className="font-bold text-sm text-[#191c19] mt-1.5 truncate">
                    {order.buyerName || 'Direct Consumer'}
                  </h4>
                  <span className="text-xs text-[#404941] flex items-center gap-1 truncate">
                    <span className="material-symbols-outlined text-[14px] text-[#717970] flex-shrink-0">
                      location_on
                    </span>
                    <span className="truncate">{order.buyerLocation || 'Direct Delivery'}</span>
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-[#717970] block uppercase font-bold">Farmer Net</span>
                  <span className="font-['Outfit'] font-bold text-base text-[#003b1b]">
                    ₹{order.farmerShare.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Crop Type & Quantity summary */}
              <div className="bg-[#f3f4ef] rounded-lg p-2.5 flex items-center justify-between text-[#191c19] text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[18px] text-[#003b1b] flex-shrink-0">
                    agriculture
                  </span>
                  <span className="font-semibold truncate">
                    {order.items.map((it) => `${it.quantity} ${it.unit} ${it.name}`).join(' • ')}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#404941] flex-shrink-0 bg-white px-2 py-0.5 rounded border border-[#c0c9be]/30 ml-2">
                  Total: {totalQty} {order.items[0]?.unit || 'kg'}
                </span>
              </div>

              {/* Assigned Transport & Driver Details */}
              <div className="bg-[#edeee9]/70 rounded-lg p-2.5 flex items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {order.driver?.photo ? (
                    <img
                      src={order.driver.photo}
                      alt={order.driver.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#c0c9be]/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#14532d] text-white flex items-center justify-center flex-shrink-0 font-bold">
                      🚚
                    </div>
                  )}

                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-[#191c19] truncate">
                      {order.driver?.name || 'Assigned Driver'}
                    </span>
                    <span className="text-[11px] text-[#404941] truncate">
                      {order.vehicleDetails?.name || order.driver?.vehicleTypeName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="bg-white border border-[#c0c9be] rounded px-1.5 py-0.5 text-[11px] font-mono font-bold text-gray-900 shadow-2xs">
                    {order.vehicleDetails?.plateNumber || order.driver?.vehiclePlateNumber || 'MH-14'}
                  </div>

                  <button
                    aria-label="Call Transporter"
                    onClick={() => {
                      if (order.driver) {
                        onShowToast(
                          `Calling ${order.driver.name}`,
                          `${order.driver.phone} • ${order.driver.vehiclePlateNumber}`
                        );
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-white text-[#003b1b] flex items-center justify-center shadow-2xs hover:bg-[#b1f2be] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">phone</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                {onNavigateToOrder && (
                  <button
                    type="button"
                    onClick={() => onNavigateToOrder(order.id)}
                    className="text-[#14532d] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">location_searching</span>
                    <span>Live GPS Telemetry</span>
                  </button>
                )}
                {onNavigateToDispatchedOrders && (
                  <button
                    type="button"
                    onClick={onNavigateToDispatchedOrders}
                    className="text-[#404941] hover:text-[#191c19] text-[11px] font-semibold flex items-center gap-0.5 cursor-pointer ml-auto"
                  >
                    <span>Fulfillment Details</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section: Active Produce Listings */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div>
          <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
            Live Produce Listings • उपलब्ध फसल
          </h3>
          <span className="text-xs text-[#404941]">Your farm stock visible to direct buyers</span>
        </div>
        <span className="text-xs text-[#003b1b] font-bold">3 Active</span>
      </div>

      <div className="px-4 space-y-4">
        {/* Listing 1: Tomatoes */}
        <div className="bg-white rounded-xl shadow-sm border border-[#c0c9be]/30 overflow-hidden flex flex-col">
          <div className="relative w-full h-44 bg-[#f3f4ef]">
            <img
              className="w-full h-full object-cover"
              alt="Fresh Roma tomatoes in crates"
              src={ASSETS.tomatoesListing}
            />
            <div className="absolute top-3 left-3 bg-[#f8faf4]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#003b1b] animate-ping"></span>
              <span className="text-xs text-[#003b1b] font-bold">Active • 14 Inquiries</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-[#14532d] text-white px-3 py-1 rounded-lg font-bold shadow-md">
              ₹{tomatoRate.toFixed(2)} <span className="text-xs font-normal text-[#87c695]">/ kg</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h4 className="font-bold text-base text-[#191c19]">Hybrid Red Tomatoes (Roma)</h4>
              <span className="text-xs text-[#404941] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-[#003b1b]">calendar_today</span>
                Picked Yesterday (04 Sep) • Grade A Direct
              </span>
            </div>

            {/* Inventory Stock Bar */}
            <div className="bg-[#edeee9] rounded-lg p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-[#191c19]">
                <span>Remaining Stock</span>
                <span className="font-bold text-[#003b1b]">
                  850 kg available <span className="text-[#717970] font-normal">/ 1,200 kg</span>
                </span>
              </div>
              <div className="w-full bg-[#e7e9e3] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#14532d] h-full rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>

            {/* Price Breakdown Comparison */}
            <div className="bg-[#f3f4ef] rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#717970]">Farmer Price</span>
                <span className="font-bold text-xs sm:text-sm text-[#003b1b]">₹{tomatoRate.toFixed(2)} / kg</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-[#717970]">Local Mandi Rate</span>
                <span className="text-xs sm:text-sm text-[#ba1a1a] line-through">₹21.00 / kg</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#904d00] font-bold">+₹{(tomatoRate - 21).toFixed(2)} / kg Extra</span>
                <span className="text-[10px] text-[#717970]">Direct margin</span>
              </div>
            </div>

            {/* Action Controls */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleRateClick}
                className="min-h-[44px] bg-[#edeee9] text-[#191c19] font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#e7e9e3] transition-colors cursor-pointer hover:bg-[#e7e9e3]"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                Update Rate
              </button>
              <button
                onClick={() => setShowChatModal(true)}
                className="min-h-[44px] bg-[#14532d] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#003b1b] transition-colors cursor-pointer hover:bg-[#003b1b]"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                View 14 Chats
              </button>
            </div>
          </div>
        </div>

        {/* Listing 2: Table Potatoes */}
        <div className="bg-white rounded-xl shadow-sm border border-[#c0c9be]/30 overflow-hidden flex flex-col">
          <div className="relative w-full h-44 bg-[#f3f4ef]">
            <img
              className="w-full h-full object-cover"
              alt="Jyoti potatoes in cold storage"
              src={ASSETS.potatoesListing}
            />
            <div className="absolute top-3 left-3 bg-[#f8faf4]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-[#003b1b]">local_shipping</span>
              <span className="text-xs text-[#003b1b] font-bold">Active • 8 Dispatched</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-[#14532d] text-white px-3 py-1 rounded-lg font-bold shadow-md">
              ₹18.00 <span className="text-xs font-normal text-[#87c695]">/ kg</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h4 className="font-bold text-base text-[#191c19]">Jyoti Table Potatoes (Grade A)</h4>
              <span className="text-xs text-[#404941] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-[#003b1b]">ac_unit</span>
                Stored: Agra Cold Hub • Harvested 01 Sep
              </span>
            </div>
            <div className="bg-[#edeee9] rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#003b1b]">warehouse</span>
                <span className="text-[#191c19]">2,400 kg certified in Cold Hub</span>
              </div>
              <span className="text-[#717970] font-bold">Batch #JP-29</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onShowToast('Link Copied!', 'Direct batch link copied to clipboard')}
                className="min-h-[44px] bg-[#edeee9] text-[#191c19] font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#e7e9e3] transition-colors cursor-pointer hover:bg-[#e7e9e3]"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Share Link
              </button>
              <button
                onClick={() => onShowToast('Stock Sync Verified', 'Agra Cold Hub sensor reports 2,400 kg @ 4°C')}
                className="min-h-[44px] bg-[#003b1b] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#14532d] transition-colors cursor-pointer hover:bg-[#14532d]"
              >
                <span className="material-symbols-outlined text-[18px]">inventory</span>
                Manage Stock
              </button>
            </div>
          </div>
        </div>

        {/* Listing 3: Sharbati Wheat */}
        <div className="bg-white rounded-xl shadow-sm border border-[#c0c9be]/30 overflow-hidden flex flex-col">
          <div className="relative w-full h-44 bg-[#f3f4ef]">
            <img
              className="w-full h-full object-cover"
              alt="Golden Sharbati wheat grains"
              src={ASSETS.wheatListing}
            />
            <div className="absolute top-3 left-3 bg-[#f8faf4]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-[#003b1b] font-bold">Active • Direct Mill Orders</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-[#14532d] text-white px-3 py-1 rounded-lg font-bold shadow-md">
              ₹2,850 <span className="text-xs font-normal text-[#87c695]">/ quintal</span>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h4 className="font-bold text-base text-[#191c19]">Sharbati Golden Wheat (MP Origin)</h4>
              <span className="text-xs text-[#404941] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px] text-[#003b1b]">verified</span>
                100% Sun-Dried • Low Moisture &lt;11%
              </span>
            </div>
            <div className="bg-[#edeee9] rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#003b1b]">grain</span>
                <span className="text-[#191c19]">50 Quintals Ready (5,000 kg)</span>
              </div>
              <span className="bg-[#b1f2be] text-[#00210d] px-2 py-0.5 rounded font-bold">Premium</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onShowToast('3 Active Bids', 'Highest Bid: ₹2,920/quintal from Pune Organic Flour Mill')}
                className="min-h-[44px] bg-[#edeee9] text-[#191c19] font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#e7e9e3] transition-colors cursor-pointer hover:bg-[#e7e9e3]"
              >
                <span className="material-symbols-outlined text-[18px]">sell</span>
                Bulk Bids (3)
              </button>
              <button
                onClick={() => setShowLabModal(true)}
                className="min-h-[44px] bg-[#14532d] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 active:bg-[#003b1b] transition-colors cursor-pointer hover:bg-[#003b1b]"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                Lab Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Farmer Assurance Notice */}
      <div className="px-4 pb-4">
        <div className="bg-[#ffdcc3]/40 border border-[#fe932c]/30 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fe932c] text-[#663500] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">handshake</span>
          </div>
          <div className="flex flex-col">
            <h5 className="font-bold text-sm sm:text-base text-[#2f1500] leading-tight">
              Annapurna Direct Promise
            </h5>
            <p className="text-xs text-[#404941] mt-1 leading-relaxed">
              Zero deduction on farmer selling price. Transport partner fees and cold hub costs are transparently funded by urban consumers.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: List New Produce */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fe932c] text-[26px]">photo_camera</span>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                  List New Harvest / नई फसल
                </h3>
              </div>
              <button
                onClick={() => setShowListModal(false)}
                className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center text-[#404941] hover:bg-[#e7e9e3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleListProduceSubmit} className="flex flex-col gap-3.5">
              {/* Photo Upload Simulation */}
              <div className="border-2 border-dashed border-[#b1f2be] rounded-xl p-4 bg-[#f3f4ef] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#e7e9e3] transition-colors">
                <span className="material-symbols-outlined text-[36px] text-[#003b1b]">add_a_photo</span>
                <span className="text-xs font-bold text-[#003b1b] mt-1">Take Crop Photo or Browse Gallery</span>
                <span className="text-[11px] text-[#717970]">AI Crop Scanner auto-grades quality & color</span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c19] block mb-1">
                  Crop Name / फसल का नाम
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Cauliflower, Shimla Mirch, Alphonso..."
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#f3f4ef] border border-[#c0c9be]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003b1b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#191c19] block mb-1">
                    Available Quantity (kg)
                  </label>
                  <input
                    type="number"
                    value={newCropQty}
                    onChange={(e) => setNewCropQty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#f3f4ef] border border-[#c0c9be]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003b1b]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#191c19] block mb-1">
                    Your Direct Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    value={newCropPrice}
                    onChange={(e) => setNewCropPrice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#f3f4ef] border border-[#c0c9be]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#003b1b]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#191c19] block mb-1">
                  Quality Grade / जैविक स्थिति
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Grade A Export', 'Organic Desi', 'Regular Direct'].map((grade) => (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => setNewCropGrade(grade)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                        newCropGrade === grade
                          ? 'bg-[#14532d] text-white border-[#14532d]'
                          : 'bg-[#f3f4ef] text-[#404941] border-[#c0c9be]/40'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#b1f2be]/30 p-2.5 rounded-lg text-xs text-[#00210d]">
                ✨ <strong>Zero Middleman Guarantee:</strong> 100% of ₹{newCropPrice}/kg will be deposited directly to your bank account upon dispatch scan.
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#fe932c] text-[#663500] font-bold rounded-xl shadow hover:bg-[#ffdcc3] transition-all cursor-pointer mt-1"
              >
                Publish Live to 14,000+ Consumers
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Rate */}
      {showRateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                Update Tomato Rate (₹/kg)
              </h3>
              <button
                onClick={() => setShowRateModal(false)}
                className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center text-[#404941]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 py-2">
              <button
                onClick={() => setTomatoRate((r) => Math.max(15, r - 1))}
                className="w-12 h-12 rounded-xl bg-[#edeee9] text-xl font-bold hover:bg-[#e7e9e3] active:scale-95"
              >
                -
              </button>
              <span className="font-['Outfit'] font-bold text-3xl text-[#003b1b]">
                ₹{tomatoRate.toFixed(2)}
              </span>
              <button
                onClick={() => setTomatoRate((r) => r + 1)}
                className="w-12 h-12 rounded-xl bg-[#edeee9] text-xl font-bold hover:bg-[#e7e9e3] active:scale-95"
              >
                +
              </button>
            </div>
            <p className="text-xs text-[#717970] text-center">
              Local Mandi price is ₹21.00/kg. Your price allows consumers to save 36% while giving you 35% higher profit.
            </p>
            <button
              onClick={handleSaveRate}
              className="w-full h-11 bg-[#14532d] text-white font-bold rounded-xl shadow cursor-pointer hover:bg-[#003b1b]"
            >
              Confirm New Rate
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: View 14 Chats */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2.5">
              <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                Direct Consumer Inquiries (14)
              </h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-2.5">
              {[
                { name: 'Dr. Anita Joshi (Pune)', query: 'Can I order 50kg Roma tomatoes for society sauce making batch this Sunday?', time: '10m ago' },
                { name: 'Gourmet Organic Cafe', query: 'Need certified residue report before dispatching 100kg lot.', time: '28m ago' },
                { name: 'Vikram Mehta (Kothrud)', query: 'Are these tomatoes vine-ripened without calcium carbide spray?', time: '1h ago' }
              ].map((c, i) => (
                <div key={i} className="bg-[#f3f4ef] p-3 rounded-xl flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs font-bold text-[#191c19]">
                    <span>{c.name}</span>
                    <span className="text-[11px] text-[#717970] font-normal">{c.time}</span>
                  </div>
                  <p className="text-xs text-[#404941]">{c.query}</p>
                  <button
                    onClick={() => onShowToast('Replying to ' + c.name, 'Direct audio reply memo ready')}
                    className="self-end text-[11px] font-bold text-[#003b1b] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">reply</span>
                    Quick Voice Reply (ऑडियो उत्तर)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Lab Report */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14532d]">verified</span>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                  Sharbati Wheat Lab Certificate
                </h3>
              </div>
              <button
                onClick={() => setShowLabModal(false)}
                className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="bg-[#f3f4ef] rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1">
                <span className="text-[#717970]">NPOP Organic ID:</span>
                <span className="font-bold text-[#191c19]">NPOP/ORG/2024-9128</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-[#717970]">Moisture Content:</span>
                <span className="font-bold text-[#003b1b]">9.4% (Ultra Safe &lt;11%)</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-[#717970]">Protein Value:</span>
                <span className="font-bold text-[#191c19]">14.2% High Glutenin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Pesticide Residues:</span>
                <span className="font-bold text-[#003b1b]">ND (Not Detected - 0.00 ppm)</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowLabModal(false);
                onShowToast('Certificate Downloaded', 'PDF saved with digital NPOP stamp');
              }}
              className="w-full h-11 bg-[#14532d] text-white font-bold rounded-xl shadow cursor-pointer hover:bg-[#003b1b]"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
