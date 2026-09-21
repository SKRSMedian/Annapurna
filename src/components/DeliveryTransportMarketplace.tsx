import React, { useState } from 'react';
import { AvailableDriverVehicle, Language, TransportVehicleType } from '../types';
import { AVAILABLE_DRIVERS_AND_VEHICLES } from '../data/mockData';
import { useNetwork } from '../hooks/useNetwork';

interface DeliveryTransportMarketplaceProps {
  language: Language;
  orderWeightKg: number;
  selectedDriverVehicleId: string;
  onSelectDriverVehicle: (driverVehicle: AvailableDriverVehicle) => void;
  onBackToBasket: () => void;
  onProceedToConfirmation: () => void;
}

export const DeliveryTransportMarketplace: React.FC<DeliveryTransportMarketplaceProps> = ({
  language,
  orderWeightKg,
  selectedDriverVehicleId,
  onSelectDriverVehicle,
  onBackToBasket,
  onProceedToConfirmation
}) => {
  const { isOnline } = useNetwork();
  const isHindi = language === 'hi';
  const [filterType, setFilterType] = useState<string>('all');

  // Auto-recommend vehicle type based on weight
  const getRecommendedType = (weight: number): TransportVehicleType => {
    if (weight <= 15) return '2-wheeler';
    if (weight <= 80) return '3-wheeler';
    if (weight <= 500) return 'tempo';
    return 'truck';
  };

  const recommendedType = getRecommendedType(orderWeightKg);

  const filteredVehicles = AVAILABLE_DRIVERS_AND_VEHICLES.filter((item) => {
    if (filterType === 'all') return true;
    return item.vehicleType === filterType;
  });

  const selectedVehicle =
    AVAILABLE_DRIVERS_AND_VEHICLES.find((v) => v.id === selectedDriverVehicleId) ||
    AVAILABLE_DRIVERS_AND_VEHICLES[0];

  const getVehicleIcon = (type: TransportVehicleType) => {
    switch (type) {
      case '2-wheeler':
        return 'two_wheeler';
      case '3-wheeler':
        return 'electric_rickshaw';
      case 'truck':
        return 'rv_hookup';
      case 'tempo':
      default:
        return 'local_shipping';
    }
  };

  const getVehicleTypeBadgeLabel = (type: TransportVehicleType) => {
    switch (type) {
      case '2-wheeler':
        return '2-Wheeler';
      case '3-wheeler':
        return '3-Wheeler / Auto';
      case 'truck':
        return 'Commercial Truck';
      case 'tempo':
      default:
        return 'Tempo / Mini Truck';
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in">
      {/* Top Navigation & Title Bar */}
      <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToBasket}
            className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center text-[#191c19] hover:bg-[#e7e9e3] transition-colors cursor-pointer"
            title="Back to Basket"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#191c19]">
              {isHindi ? 'डिलीवरी वाहन व चालक चुनें' : 'Choose Your Delivery Transport'}
            </h2>
            <span className="text-[11px] text-[#717970]">
              Direct farm-to-consumer fleet • Real-time driver & vehicle marketplace
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <span className="text-[11px] font-bold bg-[#b1f2be]/50 text-[#003b1b] px-2.5 py-1 rounded-full whitespace-nowrap">
          Step 2 of 3
        </span>
      </div>

      {/* Offline Mode Restriction Banner */}
      {!isOnline && (
        <div className="p-3 bg-[#ba1a1a] text-white rounded-xl flex items-center justify-between text-xs font-bold shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">cloud_off</span>
            <span>You are offline. Live ordering is disabled.</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
            Offline Mode
          </span>
        </div>
      )}

      {/* Order Size & Capacity Advisory Banner */}
      <div className="bg-[#f3f4ef] border border-[#c0c9be]/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#14532d] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">scale</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#191c19]">
                Total Order Payload:
              </span>
              <span className="font-['Outfit'] font-bold text-sm text-[#14532d]">
                {orderWeightKg.toFixed(1)} kg
              </span>
            </div>
            <span className="text-[11px] text-[#717970]">
              {orderWeightKg >= 30
                ? 'Bulk order detected. Compare vehicle capacity and rates below.'
                : 'Fresh harvest package. Suitable for agile 2-wheeler, cargo auto, or refrigerated tempo.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-center bg-white px-2.5 py-1 rounded-lg border border-[#c0c9be]/40 text-xs">
          <span className="material-symbols-outlined text-[16px] text-[#fe932c]">recommend</span>
          <span className="text-[11px] font-semibold text-[#191c19]">
            Recommended: <strong className="text-[#003b1b]">{getVehicleTypeBadgeLabel(recommendedType)}</strong>
          </span>
        </div>
      </div>

      {/* Vehicle Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { key: 'all', label: 'All Fleet (8)', icon: 'apps' },
          { key: '2-wheeler', label: '🛵 2-Wheeler', icon: 'two_wheeler' },
          { key: '3-wheeler', label: '🛺 3-Wheeler Auto', icon: 'electric_rickshaw' },
          { key: 'tempo', label: '🚚 Tempo / Van', icon: 'local_shipping' },
          { key: 'truck', label: '🚛 Heavy Truck', icon: 'rv_hookup' }
        ].map((tab) => {
          const isActive = filterType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-[#14532d] text-white shadow-xs'
                  : 'bg-[#edeee9] text-[#404941] hover:bg-[#e7e9e3] hover:text-[#191c19]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Available Local Drivers & Vehicles List */}
      <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-1">
        {filteredVehicles.map((vehicle) => {
          const isSelected = selectedDriverVehicleId === vehicle.id;
          const isOverCapacity = orderWeightKg > vehicle.capacityLimitKg;
          const isRecommended = recommendedType === vehicle.vehicleType;

          return (
            <div
              key={vehicle.id}
              onClick={() => onSelectDriverVehicle(vehicle)}
              className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                isSelected
                  ? 'border-[#14532d] bg-[#f8faf4] ring-2 ring-[#14532d]/25 shadow-sm'
                  : 'border-[#c0c9be]/50 bg-white hover:border-[#14532d]/40 hover:bg-[#fafbf8]'
              }`}
            >
              {/* Badges Bar: Recommended & Verification */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-[#edeee9] text-[#191c19] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-[13px] text-[#14532d]">
                      {getVehicleIcon(vehicle.vehicleType)}
                    </span>
                    <span>{vehicle.vehicleTypeName}</span>
                  </span>

                  {vehicle.coldChainReady && (
                    <span className="inline-flex items-center gap-1 bg-[#b1f2be]/60 text-[#003b1b] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      <span>❄️ Cold-Chain (14°C)</span>
                    </span>
                  )}

                  {isRecommended && (
                    <span className="bg-[#ffdcc3] text-[#663500] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Best Fit
                    </span>
                  )}
                </div>

                {/* Radio selection bubble */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSelected
                      ? 'border-[#14532d] bg-[#14532d] text-white'
                      : 'border-[#c0c9be] bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  )}
                </div>
              </div>

              {/* Main Driver & Vehicle Details Grid */}
              <div className="flex items-start justify-between gap-3">
                {/* Driver Profile */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={vehicle.driverPhoto}
                      alt={vehicle.driverName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#14532d]/30"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#14532d] rounded-full border-2 border-white"></span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Outfit'] font-bold text-sm text-[#191c19] truncate">
                        {vehicle.driverName}
                      </span>
                      {vehicle.isVerified && (
                        <span
                          className="material-symbols-outlined text-[16px] text-[#14532d]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                          title="Verified Annapurna Direct Transporter"
                        >
                          verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#717970]">
                      <span className="inline-flex items-center gap-0.5 text-[#904d00] font-bold bg-[#ffdcc3]/60 px-1.5 py-0.2 rounded text-[10px]">
                        ★ {vehicle.driverRating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{vehicle.driverTrips} trips</span>
                    </div>

                    <span className="text-[10px] text-[#404941] truncate mt-0.5">
                      {vehicle.driverBadge}
                    </span>
                  </div>
                </div>

                {/* Locked-in Rate & Estimated Cost */}
                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Outfit'] font-extrabold text-base text-[#14532d]">
                      ₹{vehicle.estimatedDeliveryCost.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#904d00] font-bold bg-[#ffdcc3]/50 px-1.5 py-0.5 rounded mt-0.5">
                    ₹{vehicle.ratePerKm.toFixed(1)} / km
                  </span>
                  <span className="text-[10px] text-[#717970] mt-0.5">
                    ~{vehicle.etaMins}m delivery
                  </span>
                </div>
              </div>

              {/* Vehicle Specs & Official License Plate Row */}
              <div className="bg-[#f3f4ef] rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-[#191c19] text-[11px] truncate">
                    {vehicle.vehicleModel}
                  </span>
                  <span className="text-[10px] text-[#717970] truncate">
                    📍 {vehicle.proximityKm} km away • {vehicle.currentHub}
                  </span>
                </div>

                {/* Number Plate with IND Insignia */}
                <div className="flex items-center bg-white border border-[#191c19] rounded px-2 py-0.5 shadow-2xs self-start sm:self-center">
                  <div className="flex flex-col items-center mr-1 pr-1 border-r border-[#191c19]/30 text-[7px] font-black text-[#002244] leading-none">
                    <span>IND</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#191c19] tracking-wider">
                    {vehicle.vehiclePlateNumber}
                  </span>
                </div>
              </div>

              {/* Capacity Limit Bar & Warning */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#404941]">
                    Payload Limit: <strong>{vehicle.capacityLabel}</strong>
                  </span>
                  {isOverCapacity ? (
                    <span className="text-[#ba1a1a] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      Order exceeds limit
                    </span>
                  ) : (
                    <span className="text-[#14532d] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      Fits {orderWeightKg.toFixed(1)} kg order
                    </span>
                  )}
                </div>

                {/* Progress Visual */}
                <div className="w-full h-1.5 bg-[#e7e9e3] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverCapacity ? 'bg-[#ba1a1a]' : 'bg-[#14532d]'
                    }`}
                    style={{
                      width: `${Math.min(100, (orderWeightKg / vehicle.capacityLimitKg) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Special Features Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {vehicle.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-white border border-[#c0c9be]/40 text-[#404941] px-2 py-0.5 rounded-md"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-[#f3f4ef] border border-[#c0c9be]/40 rounded-xl p-3 flex flex-col gap-2.5 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#14532d] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                {getVehicleIcon(selectedVehicle.vehicleType)}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#191c19] truncate">
                Selected: {selectedVehicle.driverName} ({selectedVehicle.vehiclePlateNumber})
              </span>
              <span className="text-[10px] text-[#717970] truncate">
                {selectedVehicle.vehicleModel} • ₹{selectedVehicle.ratePerKm}/km
              </span>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[10px] text-[#717970] block">Delivery Rate:</span>
            <span className="font-['Outfit'] font-bold text-sm text-[#14532d]">
              ₹{selectedVehicle.estimatedDeliveryCost.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onBackToBasket}
            className="h-11 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] transition-colors cursor-pointer"
          >
            ← Back to Basket
          </button>
          <button
            type="button"
            onClick={onProceedToConfirmation}
            disabled={!isOnline}
            className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all ${
              !isOnline
                ? 'bg-[#edeee9] text-[#717970] border border-[#c0c9be] cursor-not-allowed'
                : 'bg-[#14532d] text-white hover:bg-[#003b1b] active:scale-95 cursor-pointer'
            }`}
          >
            <span>{!isOnline ? 'Offline • Booking Disabled' : 'Lock-in & Review'}</span>
            <span className="material-symbols-outlined text-[16px]">{!isOnline ? 'lock' : 'arrow_forward'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
