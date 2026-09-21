import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FarmerHubScreen } from './components/FarmerHubScreen';
import { MarketScreen } from './components/MarketScreen';
import { TrackTraceScreen } from './components/TrackTraceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { FarmerDispatchedOrdersScreen } from './components/FarmerDispatchedOrdersScreen';
import { BasketDrawer } from './components/BasketDrawer';
import { OnboardingAuthModal } from './components/OnboardingAuthModal';
import { NetworkStatusModal } from './components/NetworkStatusModal';
import { KisaanAiAdvisorModal } from './components/KisaanAiAdvisorModal';
import { useNetwork } from './hooks/useNetwork';
import { INITIAL_PRODUCE, INITIAL_ORDERS, TRANSPORT_VEHICLE_OPTIONS, AVAILABLE_DRIVERS_AND_VEHICLES, ASSETS } from './data/mockData';
import { ActiveTab, CartItem, Language, ProduceListing, UserProfile, DirectOrder, TransportVehicleType, AvailableDriverVehicle } from './types';
import { SUPPORTED_LANGUAGES } from './utils/translations';

export default function App() {
  // Orders State & Active Tracking Order
  const [orders, setOrders] = useState<DirectOrder[]>(INITIAL_ORDERS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('AP-9042');

  // Real-Time Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authFlag = localStorage.getItem('annapurna_auth') === 'true';
    const saved = localStorage.getItem('annapurna_profile');
    if (authFlag && saved) {
      try {
        const parsed = JSON.parse(saved);
        return Boolean(parsed && parsed.name && parsed.phone);
      } catch {
        return false;
      }
    }
    return false;
  });

  // User Profile: Starts completely empty without dummy placeholders if not authenticated
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('annapurna_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name && parsed.phone) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      name: '',
      phone: '',
      role: 'farmer',
      state: '',
      district: '',
      preferredLanguage: 'en',
      isVerified: false,
      farmName: '',
      farmSizeAcres: undefined,
      primaryCrops: []
    };
  });

  // Navigation tab: defaults to welcome if guest, or role dashboard if authenticated
  const [currentTab, setCurrentTab] = useState<ActiveTab>(() => {
    const authFlag = localStorage.getItem('annapurna_auth') === 'true';
    if (authFlag) {
      const saved = localStorage.getItem('annapurna_profile');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.role === 'consumer' ? 'market' : 'farmer-hub';
        } catch (e) {}
      }
      return 'farmer-hub';
    }
    return 'welcome';
  });

  const [language, setLanguage] = useState<Language>(userProfile.preferredLanguage || 'en');

  // Onboarding & Auth Modal
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'language' | 'auth' | 'profile' | 'verification'>('language');

  // Initial cart with 2 items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      produce: INITIAL_PRODUCE[0], // Roma tomatoes
      quantity: 2
    },
    {
      produce: INITIAL_PRODUCE[2], // Jyoti potatoes
      quantity: 5
    }
  ]);

  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const { isOnline, status } = useNetwork();
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState<{
    id: number;
    title: string;
    sub?: string;
  } | null>(null);

  const showToast = (title: string, sub?: string) => {
    const id = Date.now();
    setToast({ id, title, sub });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const handleOpenOnboarding = (step: 'language' | 'auth' | 'profile' | 'verification' = 'language') => {
    setOnboardingStep(step);
    setIsOnboardingOpen(true);
  };

  // Language Selection: Strictly LOCKED if authenticated!
  const handleSelectLanguage = (lang: Language) => {
    if (isAuthenticated) {
      showToast(
        'Language Locked',
        'Your language is locked while logged in. Please log out to change regional language.'
      );
      return;
    }
    setLanguage(lang);
    setUserProfile((prev) => ({
      ...prev,
      preferredLanguage: lang
    }));
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    showToast(
      langObj ? `${langObj.nativeLabel} (${langObj.label})` : lang,
      'Regional language active across all screens'
    );
  };

  // User Save & Lock Profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setLanguage(newProfile.preferredLanguage);
    setIsAuthenticated(true);
    localStorage.setItem('annapurna_auth', 'true');
    localStorage.setItem('annapurna_profile', JSON.stringify(newProfile));

    if (newProfile.role === 'farmer') {
      setCurrentTab('farmer-hub');
    } else {
      setCurrentTab('market');
    }
    showToast(
      `Welcome, ${newProfile.name}!`,
      `Preferences locked for ${newProfile.district}, ${newProfile.state}`
    );
  };

  // Logout: Clears authentication, wipes session, unlocks language and region selection
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('annapurna_auth');
    localStorage.removeItem('annapurna_profile');
    setUserProfile({
      name: '',
      phone: '',
      role: 'farmer',
      state: '',
      district: '',
      preferredLanguage: language,
      isVerified: false,
      farmName: '',
      farmSizeAcres: undefined,
      primaryCrops: []
    });
    setCurrentTab('welcome');
    showToast(
      'Logged Out Successfully',
      'Session cleared. Regional language and location selection are now unlocked.'
    );
  };

  // Strict role guard: Consumers must never access or stay on 'farmer-hub'
  React.useEffect(() => {
    if (userProfile.role === 'consumer' && currentTab === 'farmer-hub') {
      setCurrentTab('market');
    }
  }, [userProfile.role, currentTab]);

  const handleSelectRole = (role: 'farmer' | 'consumer') => {
    setUserProfile((prev) => {
      const updated = { ...prev, role };
      if (localStorage.getItem('annapurna_profile')) {
        localStorage.setItem('annapurna_profile', JSON.stringify(updated));
      }
      return updated;
    });
    if (role === 'farmer') {
      setCurrentTab('farmer-hub');
      showToast(
        userProfile.name ? `Welcome, ${userProfile.name}!` : 'Farmer Hub',
        userProfile.district ? `Active in ${userProfile.district} Hub` : 'Direct farm-gate harvests'
      );
    } else {
      setCurrentTab('market');
      showToast('Welcome to Annapurna Direct Market!', 'Direct farm-gate harvests with zero middlemen');
    }
  };

  const handleAddToCart = (produce: ProduceListing, qty: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((it) => it.produce.id === produce.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, { produce, quantity: qty }];
    });
    showToast(
      `Added ${qty} ${produce.unit} ${produce.name}`,
      `Direct harvest lot from ${produce.farmerName} in your basket`
    );
  };

  const handleDirectBuy = (produce: ProduceListing, qty: number) => {
    handleAddToCart(produce, qty);
    setIsBasketOpen(true);
  };

  const handleUpdateCartQty = (produceId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.produce.id === produceId) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCheckout = (
    vehicleType: TransportVehicleType = 'tempo',
    selectedDriverVehicle?: AvailableDriverVehicle
  ) => {
    setIsBasketOpen(false);

    const vehicleOpt =
      TRANSPORT_VEHICLE_OPTIONS.find((v) => v.type === vehicleType) ||
      TRANSPORT_VEHICLE_OPTIONS[2];

    const subtotal = cartItems.reduce((acc, it) => acc + it.produce.price * it.quantity, 0);
    const transitFee = selectedDriverVehicle
      ? selectedDriverVehicle.estimatedDeliveryCost
      : vehicleOpt.baseFare;
    const platformFee = Math.max(15, Math.round(subtotal * 0.05));
    const farmerShare = Math.round(subtotal * 0.84);
    const totalAmount = subtotal + transitFee + platformFee;

    // Fallback if not chosen from marketplace
    const fallbackDriver =
      AVAILABLE_DRIVERS_AND_VEHICLES.find((d) => d.vehicleType === vehicleType) ||
      AVAILABLE_DRIVERS_AND_VEHICLES[0];

    const driverName = selectedDriverVehicle?.driverName || fallbackDriver.driverName;
    const driverPhone = selectedDriverVehicle?.driverPhone || fallbackDriver.driverPhone;
    const driverPlate = selectedDriverVehicle?.vehiclePlateNumber || fallbackDriver.vehiclePlateNumber;
    const driverPhoto = selectedDriverVehicle?.driverPhoto || fallbackDriver.driverPhoto;
    const driverRating = selectedDriverVehicle?.driverRating || fallbackDriver.driverRating;
    const driverTrips = selectedDriverVehicle?.driverTrips || fallbackDriver.driverTrips;
    const vehicleModel = selectedDriverVehicle?.vehicleModel || vehicleOpt.title;
    const capacityLabel = selectedDriverVehicle?.capacityLabel || vehicleOpt.capacityLabel;
    const isColdChain =
      selectedDriverVehicle !== undefined
        ? selectedDriverVehicle.coldChainReady
        : vehicleOpt.coldChainReady;

    const newOrderId = `AP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DirectOrder = {
      id: newOrderId,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      eta: 'Today 05:30 PM',
      farmerName: cartItems[0]?.produce.farmerName || 'Gurpreet Singh',
      farmLocation: cartItems[0]?.produce.originHub || 'Khed Block, Pune',
      status: 'In Transit',
      transportVehicle: vehicleType,
      vehicleDetails: {
        type: vehicleType,
        name: vehicleModel,
        plateNumber: driverPlate,
        capacity: capacityLabel,
        temperatureControlled: isColdChain
      },
      driver: {
        name: driverName,
        phone: driverPhone,
        photo: driverPhoto,
        rating: driverRating,
        tripsCount: driverTrips,
        vehicleType: vehicleType,
        vehicleTypeName: vehicleModel,
        vehiclePlateNumber: driverPlate,
        liveSpeedKmH: 48,
        chamberTempC: isColdChain ? 14.2 : undefined,
        statusMessage: `Direct farm transit locked with ${driverName} (${driverPlate}) • ${vehicleModel}`
      },
      distanceRemainingKm: 24,
      milestones: [
        {
          key: 'driver_assigned',
          title: 'Driver Assigned',
          hindiTitle: 'चालक आवंटित',
          description: `Driver ${driverName} allocated with vehicle ${driverPlate}.`,
          time: 'Just now',
          completed: true,
          current: false
        },
        {
          key: 'picked_up_farm',
          title: 'Picked up from Farm',
          hindiTitle: 'खेत से उठाया गया',
          description: 'Fresh farm harvest weighed and loaded at farm gate.',
          time: 'Just now',
          completed: true,
          current: false
        },
        {
          key: 'in_transit',
          title: 'In Transit',
          hindiTitle: 'मार्ग में (हाईवे)',
          description: `Cruising via direct farm highway in ${vehicleModel}. Zero middlemen delay.`,
          time: 'Active',
          completed: true,
          current: true
        },
        {
          key: 'out_for_delivery',
          title: 'Out for Delivery',
          hindiTitle: 'वितरण के लिए तैयार',
          description: 'En route to local city delivery address.',
          time: 'Est. 04:45 PM',
          completed: false,
          current: false
        },
        {
          key: 'delivered',
          title: 'Delivered',
          hindiTitle: 'घर पर delivered',
          description: 'Contactless doorstep handover with certified seal.',
          time: 'Est. 05:30 PM',
          completed: false,
          current: false
        }
      ],
      items: cartItems.map((it) => ({
        name: it.produce.name,
        quantity: it.quantity,
        unit: it.produce.unit,
        pricePerUnit: it.produce.price,
        total: it.produce.price * it.quantity
      })),
      totalAmount,
      farmerShare,
      transitFee,
      platformFee
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setActiveTrackingOrderId(newOrderId);
    setCurrentTab('track-and-trace');

    showToast(
      `Order #${newOrderId} Confirmed!`,
      `Assigned: ${driverName} (${driverPlate}) on ${vehicleModel}`
    );
  };

  const totalCartValue = cartItems.reduce(
    (acc, it) => acc + it.produce.price * it.quantity,
    0
  );

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#f8faf4] text-[#191c19] font-['Plus_Jakarta_Sans'] flex flex-col selection:bg-[#b1f2be] selection:text-[#00210d] relative overflow-x-hidden">
      {/* Universal Top Header with Language Dropdown, Locked Region and Accessible Logout */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        cartCount={cartItems.length}
        userProfile={userProfile}
        onOpenOnboarding={handleOpenOnboarding}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onOpenBasket={() => setIsBasketOpen(true)}
        onOpenNetworkModal={() => setIsNetworkModalOpen(true)}
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
      />

      {/* Network Alert: Persistent Offline Banner */}
      {!isOnline && (
        <div className="bg-[#ba1a1a] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs sticky top-[94px] sm:top-16 z-30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">cloud_off</span>
            <span>You are offline. Live ordering is disabled. Cached market prices, crop advisories & offline AI Sahayak are active.</span>
          </div>
          <button
            onClick={() => setIsNetworkModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0 ml-2"
          >
            <span>Network Details</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      )}

      {/* Main Screen Content Body */}
      <main className="flex-1 pt-24 sm:pt-20 pb-28 w-full">
        {currentTab === 'welcome' && (
          <WelcomeScreen
            language={language}
            onSelectLanguage={handleSelectLanguage}
            onSelectRole={handleSelectRole}
            userProfile={userProfile}
            onOpenOnboarding={handleOpenOnboarding}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        )}

        {/* Farmer Hub: Strictly available only to Farmers */}
        {currentTab === 'farmer-hub' && (
          userProfile.role === 'farmer' ? (
            <FarmerHubScreen
              language={language}
              userProfile={userProfile}
              orders={orders}
              onNavigateToOrder={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCurrentTab('track-and-trace');
              }}
              onNavigateToDispatchedOrders={() => setCurrentTab('orders')}
              onShowToast={showToast}
              onOpenOnboarding={handleOpenOnboarding}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          ) : (
            <div className="max-w-md mx-auto p-6 text-center flex flex-col items-center gap-4 mt-8">
              <div className="w-16 h-16 rounded-full bg-[#ffb95f]/20 text-[#904d00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                  {language === 'hi' ? 'केवल किसानों के लिए उपलब्ध' : 'Farmer Dashboard Restricted'}
                </h3>
                <p className="text-xs text-[#717970] mt-1">
                  {language === 'hi'
                    ? 'किसान हब और फसल लिस्टिंग टूल्स केवल पंजीकृत किसानों के लिए हैं।'
                    : 'The Kisaan Hub and agricultural listing tools are exclusively available to registered farmers.'}
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('market')}
                className="px-5 py-2.5 bg-[#003b1b] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#14532d] cursor-pointer"
              >
                {language === 'hi' ? 'उपभोक्ता बाजार पर जाएं' : 'Go to Fresh Marketplace'}
              </button>
            </div>
          )
        )}

        {currentTab === 'market' && (
          <MarketScreen
            language={language}
            onAddToCart={handleAddToCart}
            onDirectBuy={handleDirectBuy}
            onViewBasket={() => setIsBasketOpen(true)}
            cartCount={cartItems.length}
            cartTotal={totalCartValue}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'track-and-trace' && (
          <TrackTraceScreen
            language={language}
            orders={orders}
            activeOrderId={activeTrackingOrderId}
            onSelectOrder={(id) => setActiveTrackingOrderId(id)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'profiles' && (
          <ProfileScreen
            language={language}
            userProfile={userProfile}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onOpenOnboarding={handleOpenOnboarding}
            onAddToCart={handleAddToCart}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'orders' && (
          userProfile.role === 'farmer' ? (
            <FarmerDispatchedOrdersScreen
              language={language}
              orders={orders}
              onTrackOrder={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCurrentTab('track-and-trace');
              }}
              onShowToast={showToast}
              onUpdateOrders={setOrders}
            />
          ) : (
            <OrdersScreen
              language={language}
              orders={orders}
              onUpdateOrders={setOrders}
              onTrackOrder={(orderId) => {
                setActiveTrackingOrderId(orderId);
                setCurrentTab('track-and-trace');
              }}
              onShowToast={showToast}
            />
          )
        )}
      </main>

      {/* Persistent Bottom Tab Navigation: Strictly Role-Based */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        badgeCount={cartItems.length}
        userRole={userProfile.role}
        onOpenBasket={() => setIsBasketOpen(true)}
      />

      {/* Basket Drawer / Direct Farm Gate Checkout */}
      <BasketDrawer
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onCheckout={handleCheckout}
        language={language}
      />

      {/* Onboarding, Regional Language & Mobile OTP Modal */}
      <OnboardingAuthModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialStep={onboardingStep}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        currentLanguage={language}
        onSelectLanguage={handleSelectLanguage}
        onShowToast={showToast}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Network Connectivity & Offline Simulation Modal */}
      <NetworkStatusModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Kisaan AI Advisor (RAG with Local On-Device Fallback) */}
      <KisaanAiAdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        language={language}
        userProfile={userProfile}
        onShowToast={showToast}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <div
          role="alert"
          className="fixed top-20 left-4 right-4 z-50 max-w-sm mx-auto bg-[#003b1b] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-200 border border-[#b1f2be]/30"
        >
          <span className="material-symbols-outlined text-[#b1f2be] text-[22px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold leading-tight">{toast.title}</span>
            {toast.sub && (
              <span className="text-[11px] text-[#87c695] leading-tight truncate mt-0.5">
                {toast.sub}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
