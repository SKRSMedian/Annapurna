import React, { useState } from 'react';
import { Language, LogisticsProvider, TrendingProduce, UserProfile } from '../types';
import { getRegionalInsight, ASSETS } from '../data/mockData';
import { t } from '../utils/translations';

interface SmartRecommendationsProps {
  userProfile: UserProfile;
  language: Language;
  onListCropPrompt?: (crop: { name: string; price: number; category: string }) => void;
  onShowToast: (title: string, sub?: string) => void;
  onChangeRegion?: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userProfile,
  language,
  onListCropPrompt,
  onShowToast,
  onChangeRegion
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'weather' | 'logistics' | 'trending'>('weather');
  const [selectedLogistics, setSelectedLogistics] = useState<LogisticsProvider | null>(null);
  const [bookingTransitId, setBookingTransitId] = useState<string | null>(null);

  const insightData = getRegionalInsight(userProfile.state, userProfile.district);
  const { weather, logistics, trendingProduce } = insightData;

  const handleBookTransit = (item: LogisticsProvider) => {
    setBookingTransitId(item.id);
    setTimeout(() => {
      setBookingTransitId(null);
      onShowToast(
        `Transit Slot Reserved with ${item.name}`,
        `Departs: ${item.departureTime} • Confirmed via SMS`
      );
    }, 800);
  };

  const handleReserveStorage = (item: LogisticsProvider) => {
    onShowToast(
      `Cold Storage Ingress Pass Created`,
      `${item.name} • 50 Crates Reserved at ${item.temperatureZone || '4°C'}`
    );
  };

  return (
    <section className="px-4 py-2 flex flex-col gap-3">
      {/* Section Header with Region Tag */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532d]">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              insights
            </span>
            <span className="uppercase tracking-wider">
              {t('smartRecommendations', language)}
            </span>
          </div>
          <h3 className="font-['Outfit'] font-bold text-xl text-[#191c19] mt-0.5">
            {insightData.regionName}
          </h3>
          <p className="text-xs text-[#404941] leading-relaxed">
            {t('smartInsightsSubtitle', language)}
          </p>
        </div>

        {onChangeRegion && (
          <button
            onClick={onChangeRegion}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] transition-colors cursor-pointer flex-shrink-0"
            title="Change Location & District"
          >
            <span className="material-symbols-outlined text-[16px] text-[#003b1b]">location_on</span>
            <span className="truncate max-w-[90px]">{userProfile.district}</span>
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
        )}
      </div>

      {/* 3 Main Insight Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#edeee9] rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('weather')}
          className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'weather'
              ? 'bg-white text-[#003b1b] shadow-xs font-bold'
              : 'text-[#404941] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">wb_cloudy</span>
          <span className="truncate">{t('weatherCropForecast', language).split(' ')[0]}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logistics')}
          className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'logistics'
              ? 'bg-white text-[#003b1b] shadow-xs font-bold'
              : 'text-[#404941] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          <span className="truncate">{t('logisticsSupport', language).split(' ')[0]}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trending')}
          className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'trending'
              ? 'bg-white text-[#003b1b] shadow-xs font-bold'
              : 'text-[#404941] hover:text-[#191c19]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span className="truncate">{t('trendingProduce', language).split(' ')[0]}</span>
        </button>
      </div>

      {/* SUB-TAB 1: WEATHER & CROP FORECAST */}
      {activeSubTab === 'weather' && (
        <div className="bg-white rounded-2xl p-4 border border-[#c0c9be]/30 shadow-xs flex flex-col gap-3.5 animate-in fade-in duration-200">
          {/* Main Weather Snapshot Strip */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#003b1b] to-[#14532d] text-white p-4 shadow-sm">
            {/* Background Atmosphere Graphic */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
              <img
                src={ASSETS.weatherRadarSky}
                alt="Agro Weather Radar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs text-[#87c695] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                  {insightData.district}, {insightData.state}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h4 className="font-['Outfit'] font-bold text-3xl sm:text-4xl text-white">
                    {weather.temperature}°C
                  </h4>
                  <span className="text-sm font-semibold text-[#b1f2be]">
                    {weather.condition}
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[28px]">
                  {weather.conditionIcon}
                </span>
              </div>
            </div>

            {/* Weather Metrics Strip */}
            <div className="relative z-10 grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/20 text-xs">
              <div className="flex flex-col">
                <span className="text-[#87c695] text-[11px]">{t('rainfallChance', language)}</span>
                <span className="font-bold text-sm text-white">{weather.rainfallChance}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#87c695] text-[11px]">{t('humidity', language)}</span>
                <span className="font-bold text-sm text-white">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#87c695] text-[11px]">{t('windSpeed', language)}</span>
                <span className="font-bold text-sm text-white">{weather.windSpeedKm} km/h</span>
              </div>
            </div>
          </div>

          {/* Hyper-Local Advisory Box */}
          <div
            className={`rounded-xl p-3.5 border flex items-start gap-3 ${
              weather.actionType === 'harvest_alert'
                ? 'bg-[#ffdcc3]/40 border-[#fe932c]/50 text-[#2f1500]'
                : 'bg-[#b1f2be]/30 border-[#14532d]/30 text-[#00210d]'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                weather.actionType === 'harvest_alert'
                  ? 'bg-[#fe932c] text-[#663500]'
                  : 'bg-[#14532d] text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {weather.actionType === 'harvest_alert' ? 'warning' : 'eco'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm leading-snug">
                {weather.advisoryHeadline}
              </span>
              <p className="text-xs text-[#404941] mt-1 leading-relaxed">
                {weather.advisoryDetail}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#003b1b]">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>
                  {t('optimalWindow', language)}: <strong>{weather.optimalWindow}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Timeline Forecast */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[#717970] uppercase tracking-wider">
              Hourly Harvest Weather Timeline
            </span>
            <div className="grid grid-cols-5 gap-2 overflow-x-auto py-1">
              {weather.hourlyForecast.map((h, i) => (
                <div
                  key={i}
                  className="bg-[#f3f4ef] rounded-xl p-2 flex flex-col items-center justify-center text-center gap-1 border border-[#c0c9be]/30 min-w-[58px]"
                >
                  <span className="text-[11px] font-semibold text-[#404941]">{h.time}</span>
                  <span className="material-symbols-outlined text-[20px] text-[#003b1b]">
                    {h.icon}
                  </span>
                  <span className="text-xs font-bold text-[#191c19]">{h.temp}</span>
                  <span className="text-[10px] text-[#717970] font-medium">
                    💧{h.rainProb}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LOGISTICS & TRANSPORT SUPPORT */}
      {activeSubTab === 'logistics' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="bg-[#b1f2be]/30 border border-[#14532d]/30 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#14532d] text-[22px]">electric_bolt</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#00210d]">
                  Direct Cooperative Transport Network
                </span>
                <span className="text-[11px] text-[#14532d]">
                  Cold-chain pre-cooled vans direct to urban apartment consumer clusters
                </span>
              </div>
            </div>
          </div>

          {logistics.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 border border-[#c0c9be]/40 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#edeee9] flex items-center justify-center text-[#003b1b] flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {item.type === 'cold_chain_ev'
                        ? 'electric_car'
                        : item.type === 'cold_storage'
                        ? 'warehouse'
                        : 'local_shipping'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-[#191c19] truncate">{item.name}</h4>
                      <span className="px-2 py-0.5 bg-[#b1f2be] text-[#00210d] text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-xs text-[#404941] flex items-center gap-1 mt-0.5 truncate">
                      <span className="material-symbols-outlined text-[14px] text-[#717970]">
                        route
                      </span>
                      {item.route}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-xs text-[#003b1b] block">{item.rate}</span>
                  {item.temperatureZone && (
                    <span className="text-[10px] text-[#717970] font-medium block">
                      ❄️ {item.temperatureZone}
                    </span>
                  )}
                </div>
              </div>

              {/* Transit Details Grid */}
              <div className="grid grid-cols-2 gap-2 bg-[#f3f4ef] rounded-lg p-2.5 text-xs text-[#404941]">
                <div>
                  <span className="text-[10px] text-[#717970] block">Available Capacity</span>
                  <span className="font-bold text-[#191c19]">{item.capacityAvailable}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#717970] block">Departure / Access</span>
                  <span className="font-bold text-[#191c19]">{item.departureTime}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  onClick={() => onShowToast(`Calling Logistics Coordinator: ${item.phone}`)}
                  className="min-h-[40px] px-3 rounded-lg bg-[#edeee9] text-[#191c19] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#e7e9e3] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Dispatch</span>
                </button>

                <button
                  onClick={() =>
                    item.type === 'cold_storage'
                      ? handleReserveStorage(item)
                      : handleBookTransit(item)
                  }
                  disabled={bookingTransitId === item.id}
                  className="min-h-[40px] px-3 rounded-lg bg-[#003b1b] text-white text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#14532d] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {item.type === 'cold_storage' ? 'bookmark_add' : 'event_seat'}
                  </span>
                  <span>
                    {bookingTransitId === item.id
                      ? 'Confirming...'
                      : item.type === 'cold_storage'
                      ? t('reserveStorage', language)
                      : t('bookTransit', language)}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: TRENDING & POPULAR PRODUCE */}
      {activeSubTab === 'trending' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="bg-[#ffdcc3]/40 border border-[#fe932c]/40 rounded-xl p-3 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#fe932c] text-[22px] flex-shrink-0">
              query_stats
            </span>
            <div className="flex flex-col text-xs text-[#404941]">
              <span className="font-bold text-[#2f1500]">
                Live Urban Mandi Intelligence
              </span>
              <span>
                Compare real-time farm gate earnings with traditional APMC commission agents. Direct listing earns +30% to +60% more net cash.
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {trendingProduce.map((crop) => {
              const diffPerUnit = crop.annapurnaPrice - crop.mandiPrice;
              const percentGain = Math.round((diffPerUnit / crop.mandiPrice) * 100);

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-xl border border-[#c0c9be]/40 shadow-xs overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="relative w-full sm:w-36 h-36 bg-[#f3f4ef] flex-shrink-0">
                    <img
                      src={crop.image}
                      alt={crop.cropName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#fe932c] text-[#2f1500] text-[10px] font-bold rounded-full shadow-sm">
                      +{crop.urbanDemandIndex}% Demand
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-sm text-[#191c19] leading-tight">
                            {crop.cropName}
                          </h4>
                          <span className="text-xs text-[#003b1b] font-semibold">
                            {crop.regionalName} • {crop.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#b1f2be] text-[#00210d] text-[10px] font-bold rounded">
                          {crop.seasonTag}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#717970] mt-1 leading-snug">
                        {crop.reason}
                      </p>
                    </div>

                    {/* Price Comparison Matrix */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#f3f4ef] rounded-lg p-2 text-center text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#717970]">Annapurna Direct</span>
                        <span className="font-['Outfit'] font-bold text-[#003b1b] text-sm">
                          ₹{crop.annapurnaPrice.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex flex-col border-x border-[#c0c9be]/40">
                        <span className="text-[10px] text-[#717970]">APMC Mandi</span>
                        <span className="font-['Outfit'] font-bold text-[#717970] text-sm line-through">
                          ₹{crop.mandiPrice.toFixed(1)}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#14532d] font-bold">Extra Gain</span>
                        <span className="font-['Outfit'] font-bold text-[#14532d] text-sm">
                          +₹{diffPerUnit.toFixed(1)} ({percentGain}%)
                        </span>
                      </div>
                    </div>

                    {/* Action to list */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-[#404941] truncate">
                        Dest: <strong>{crop.bestHubMarket}</strong>
                      </span>
                      <button
                        onClick={() => {
                          if (onListCropPrompt) {
                            onListCropPrompt({
                              name: crop.cropName,
                              price: crop.annapurnaPrice,
                              category: crop.category
                            });
                          }
                          onShowToast(
                            `Pre-filled listing for "${crop.cropName}"`,
                            `Recommended rate: ₹${crop.annapurnaPrice} / ${crop.unit}`
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#fe932c] text-[#663500] text-xs font-bold flex items-center gap-1 hover:bg-[#ffdcc3] transition-colors cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>{t('listThisCrop', language)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
