import React from 'react';
import { ActiveTab, Language } from '../types';
import { t, TranslationKey } from '../utils/translations';

interface BottomNavProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  language: Language;
  badgeCount?: number;
  userRole?: 'farmer' | 'consumer';
  onOpenBasket?: () => void;
}

interface NavItemConfig {
  key: string;
  tab?: ActiveTab;
  icon: string;
  translationKey: TranslationKey;
  englishFallback: string;
  badge?: number;
  action?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  language,
  badgeCount = 0,
  userRole = 'consumer',
  onOpenBasket
}) => {
  const isConsumer = userRole === 'consumer';

  // Strict role-based navigation item configurations
  const consumerNavItems: NavItemConfig[] = [
    {
      key: 'market',
      tab: 'market',
      icon: 'storefront',
      translationKey: 'tabMarket',
      englishFallback: 'Market'
    },
    {
      key: 'cart',
      icon: 'shopping_basket',
      translationKey: 'tabCart',
      englishFallback: 'Basket',
      badge: badgeCount,
      action: onOpenBasket ? onOpenBasket : () => onSelectTab('market')
    },
    {
      key: 'orders',
      tab: 'orders',
      icon: 'receipt_long',
      translationKey: 'tabOrders',
      englishFallback: 'Orders'
    },
    {
      key: 'track-and-trace',
      tab: 'track-and-trace',
      icon: 'local_shipping',
      translationKey: 'tabTrack',
      englishFallback: 'Traceability'
    },
    {
      key: 'profiles',
      tab: 'profiles',
      icon: 'account_circle',
      translationKey: 'tabConsumerProfile',
      englishFallback: 'Profile'
    }
  ];

  const farmerNavItems: NavItemConfig[] = [
    {
      key: 'farmer-hub',
      tab: 'farmer-hub',
      icon: 'agriculture',
      translationKey: 'tabKisaanHub',
      englishFallback: 'Kisaan Hub'
    },
    {
      key: 'market',
      tab: 'market',
      icon: 'trending_up',
      translationKey: 'tabMandiRates',
      englishFallback: 'Mandi Rates'
    },
    {
      key: 'orders',
      tab: 'orders',
      icon: 'local_shipping',
      translationKey: 'tabDispatchedOrders',
      englishFallback: 'Orders Dispatched'
    },
    {
      key: 'track-and-trace',
      tab: 'track-and-trace',
      icon: 'local_shipping',
      translationKey: 'tabTrack',
      englishFallback: 'Logistics'
    },
    {
      key: 'profiles',
      tab: 'profiles',
      icon: 'badge',
      translationKey: 'tabProfiles',
      englishFallback: 'Farmer Profile'
    }
  ];

  const navItems = isConsumer ? consumerNavItems : farmerNavItems;

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8faf4]/95 backdrop-blur-xl border-t border-[#c0c9be]/30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto h-18 px-1 sm:px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.tab ? currentTab === item.tab : false;
          const translatedLabel = t(item.translationKey, language);

          const handleClick = () => {
            if (item.action) {
              item.action();
            } else if (item.tab) {
              onSelectTab(item.tab);
            }
          };

          return (
            <button
              key={item.key}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] sm:min-w-[60px] min-h-[48px] py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#14532d] font-bold scale-105'
                  : 'text-[#404941] hover:text-[#191c19] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[23px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#fe932c] text-[#663500] text-[10px] px-1 rounded-full h-4 min-w-[16px] flex items-center justify-center font-extrabold shadow-sm ring-1 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-center leading-tight max-w-[62px] sm:max-w-none truncate block">
                {translatedLabel}
              </span>
              {language !== 'en' && (
                <span className="hidden sm:block text-[9px] opacity-75 font-normal truncate max-w-full">
                  {item.englishFallback}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
