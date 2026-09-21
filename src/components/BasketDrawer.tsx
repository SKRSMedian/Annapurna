import React, { useState, useEffect } from 'react';
import {
  CartItem,
  Language,
  TransportVehicleType,
  AvailableDriverVehicle
} from '../types';
import {
  TRANSPORT_VEHICLE_OPTIONS,
  AVAILABLE_DRIVERS_AND_VEHICLES
} from '../data/mockData';
import { DeliveryTransportMarketplace } from './DeliveryTransportMarketplace';
import { useNetwork } from '../hooks/useNetwork';

interface BasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (produceId: string, delta: number) => void;
  onCheckout: (
    vehicleType: TransportVehicleType,
    selectedDriverVehicle?: AvailableDriverVehicle
  ) => void;
  language: Language;
}

type CheckoutStep = 'basket' | 'transport_marketplace' | 'confirmation';

export const BasketDrawer: React.FC<BasketDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onCheckout,
  language
}) => {
  const { isOnline, queueAction } = useNetwork();
  const [draftSaved, setDraftSaved] = useState(false);
  if (!isOpen) return null;

  const isHindi = language === 'hi';
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('basket');

  // Calculate approximate total weight in kg from cart items
  const totalWeightKg = items.reduce((sum, it) => {
    const unit = it.produce.unit.toLowerCase();
    let unitMultiplier = 1;
    if (unit.includes('bag')) unitMultiplier = 10;
    else if (unit.includes('crate')) unitMultiplier = 20;
    else if (unit.includes('gm') || unit.includes('gram')) unitMultiplier = 0.001;
    else if (unit.includes('quintal')) unitMultiplier = 100;
    return sum + it.quantity * unitMultiplier;
  }, 0);

  // Auto-recommend vehicle based on total weight
  const getRecommendedVehicle = (weight: number): TransportVehicleType => {
    if (weight <= 15) return '2-wheeler';
    if (weight <= 80) return '3-wheeler';
    if (weight <= 500) return 'tempo';
    return 'truck';
  };

  const recommendedVehicle = getRecommendedVehicle(totalWeightKg);
  const [selectedVehicle, setSelectedVehicle] = useState<TransportVehicleType>(recommendedVehicle);

  // Default driver matching recommended vehicle
  const getInitialDriverId = (type: TransportVehicleType) => {
    const match = AVAILABLE_DRIVERS_AND_VEHICLES.find((d) => d.vehicleType === type);
    return match ? match.id : AVAILABLE_DRIVERS_AND_VEHICLES[0].id;
  };

  const [selectedDriverVehicleId, setSelectedDriverVehicleId] = useState<string>(
    getInitialDriverId(recommendedVehicle)
  );

  // Sync selected vehicle & default driver when weight changes if user hasn't explicitly customized
  useEffect(() => {
    setSelectedVehicle(recommendedVehicle);
    setSelectedDriverVehicleId(getInitialDriverId(recommendedVehicle));
  }, [totalWeightKg]);

  const activeDriverVehicle =
    AVAILABLE_DRIVERS_AND_VEHICLES.find((v) => v.id === selectedDriverVehicleId) ||
    AVAILABLE_DRIVERS_AND_VEHICLES[0];

  const activeVehicleConfig =
    TRANSPORT_VEHICLE_OPTIONS.find((v) => v.type === selectedVehicle) ||
    TRANSPORT_VEHICLE_OPTIONS[2];

  const subtotal = items.reduce((sum, it) => sum + it.produce.price * it.quantity, 0);
  const retailTotal = items.reduce((sum, it) => sum + it.produce.retailPrice * it.quantity, 0);
  const totalSavings = Math.max(0, retailTotal - subtotal);

  const farmerShare = Math.round(subtotal * 0.84);
  const transitFee = subtotal > 0 ? activeDriverVehicle.estimatedDeliveryCost : 0;
  const platformFee = subtotal > 0 ? Math.max(15, Math.round(subtotal * 0.05)) : 0;
  const grandTotal = subtotal + transitFee + platformFee;

  const handleSelectDriverVehicle = (driverVehicle: AvailableDriverVehicle) => {
    setSelectedDriverVehicleId(driverVehicle.id);
    setSelectedVehicle(driverVehicle.vehicleType);
  };

  const handlePlaceOrder = () => {
    if (!isOnline) return;
    onCheckout(selectedVehicle, activeDriverVehicle);
  };

  const handleSaveDraftLocally = () => {
    queueAction(
      'order_draft',
      { items, totalWeightKg, grandTotal, driver: activeDriverVehicle.driverName },
      `Direct Basket Draft (${items.length} items • ₹${grandTotal.toFixed(2)})`
    );
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[94vh] overflow-y-auto">
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

        {/* STEP 1: BASKET ITEMS & TRANSPORT PREVIEW */}
        {checkoutStep === 'basket' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#14532d] text-[26px]">
                  shopping_bag
                </span>
                <div className="flex flex-col">
                  <h2 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                    {isHindi ? 'सीधा खेत बास्केट' : 'Direct Farm Basket'}
                  </h2>
                  <span className="text-[11px] text-[#404941]">
                    Zero Mandi Intermediaries • Approx {totalWeightKg.toFixed(1)} kg Produce
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center text-[#404941] hover:bg-[#e7e9e3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Empty or Populated List */}
            {items.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-4xl text-[#717970]">
                  shopping_basket
                </span>
                <p className="text-sm font-bold text-[#191c19]">Your basket is empty</p>
                <p className="text-xs text-[#717970]">
                  Explore fresh morning harvests from verified organic farms.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {/* Items */}
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div
                      key={it.produce.id}
                      className="bg-[#f3f4ef] rounded-xl p-2.5 flex items-center justify-between gap-3"
                    >
                      <img
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                        alt={it.produce.name}
                        src={it.produce.image}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-xs sm:text-sm text-[#191c19] truncate">
                          {it.produce.name}
                        </span>
                        <span className="text-[11px] text-[#717970]">
                          {it.produce.farmerName} • ₹{it.produce.price.toFixed(2)} /{' '}
                          {it.produce.unit}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-[#c0c9be]/40 shadow-xs">
                        <button
                          onClick={() => onUpdateQty(it.produce.id, -1)}
                          className="w-6 h-6 rounded bg-[#edeee9] text-xs font-bold flex items-center justify-center hover:bg-[#e7e9e3] active:scale-95 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-[#191c19] min-w-[2rem] text-center">
                          {it.quantity} {it.produce.unit}
                        </span>
                        <button
                          onClick={() => onUpdateQty(it.produce.id, 1)}
                          className="w-6 h-6 rounded bg-[#edeee9] text-xs font-bold flex items-center justify-center hover:bg-[#e7e9e3] active:scale-95 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-['Outfit'] font-bold text-sm text-[#14532d] min-w-[3.5rem] text-right">
                        ₹{(it.produce.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bulk Harvest Order Notice if >= 25kg */}
                {totalWeightKg >= 25 && (
                  <div className="bg-[#14532d]/10 border border-[#14532d]/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <span className="text-[#003b1b] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#14532d]">
                        local_shipping
                      </span>
                      Bulk Harvest Order ({totalWeightKg.toFixed(1)} kg) • Specialized Carrier Required
                    </span>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('transport_marketplace')}
                      className="bg-[#14532d] text-white px-2 py-0.5 rounded text-[11px] font-bold hover:bg-[#003b1b] transition-colors cursor-pointer"
                    >
                      Choose Driver
                    </button>
                  </div>
                )}

                {/* Savings Callout */}
                {totalSavings > 0 && (
                  <div className="bg-[#ffdcc3]/50 border border-[#fe932c]/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <span className="text-[#2f1500] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#904d00]">
                        savings
                      </span>
                      You saved ₹{totalSavings.toFixed(2)} vs Supermarket
                    </span>
                    <span className="bg-[#fe932c] text-[#663500] px-2 py-0.5 rounded font-bold text-[11px]">
                      Farm Gate Direct
                    </span>
                  </div>
                )}

                {/* 🚚 Transport & Assigned Driver Selection Preview */}
                <div className="bg-[#f8faf4] border border-[#c0c9be]/50 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#14532d] text-[18px]">
                        local_shipping
                      </span>
                      <span className="text-xs font-bold text-[#191c19]">
                        {isHindi ? 'परिवहन व वाहन चयन' : 'Delivery Transport & Driver'}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#003b1b] bg-[#b1f2be]/40 px-2 py-0.5 rounded-full">
                      Payload: {totalWeightKg.toFixed(1)} kg
                    </span>
                  </div>

                  {/* Active Selected Driver & Vehicle Card Preview */}
                  <div className="bg-white rounded-xl p-3 border border-[#14532d]/40 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={activeDriverVehicle.driverPhoto}
                          alt={activeDriverVehicle.driverName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#14532d]/20"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#14532d] rounded-full border border-white"></span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#191c19] truncate">
                            {activeDriverVehicle.driverName}
                          </span>
                          <span className="text-[10px] bg-[#ffdcc3] text-[#904d00] font-bold px-1 py-0.2 rounded">
                            ★ {activeDriverVehicle.driverRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#404941] truncate font-medium">
                          {activeDriverVehicle.vehicleModel} • {activeDriverVehicle.capacityLabel}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#717970] mt-0.5">
                          <span className="font-mono font-bold bg-[#edeee9] px-1 rounded text-[#191c19]">
                            {activeDriverVehicle.vehiclePlateNumber}
                          </span>
                          <span>•</span>
                          <span>₹{activeDriverVehicle.ratePerKm}/km</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-[#717970] block">Transit Fee:</span>
                      <span className="font-['Outfit'] font-bold text-sm text-[#14532d]">
                        ₹{activeDriverVehicle.estimatedDeliveryCost.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Button to Open Marketplace Screen */}
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('transport_marketplace')}
                    className="w-full py-2 px-3 rounded-lg bg-[#14532d]/10 hover:bg-[#14532d]/15 border border-[#14532d]/25 text-[#003b1b] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>
                      {isHindi
                        ? 'चालक व वाहन बाजार देखें (८ उपलब्ध)'
                        : `Browse All Drivers & Vehicles (${AVAILABLE_DRIVERS_AND_VEHICLES.length} Available)`}
                    </span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>

                  {/* Quick Category Chips */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-[#c0c9be]/20">
                    {TRANSPORT_VEHICLE_OPTIONS.map((veh) => {
                      const isSelected = selectedVehicle === veh.type;
                      return (
                        <button
                          key={veh.type}
                          type="button"
                          onClick={() => {
                            setSelectedVehicle(veh.type);
                            const matchingDriver = AVAILABLE_DRIVERS_AND_VEHICLES.find(
                              (d) => d.vehicleType === veh.type
                            );
                            if (matchingDriver) {
                              setSelectedDriverVehicleId(matchingDriver.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg border text-center flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#14532d] bg-white ring-1 ring-[#14532d] font-bold text-[#14532d]'
                              : 'border-[#c0c9be]/30 bg-white/60 text-[#404941] hover:bg-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {veh.icon}
                          </span>
                          <span className="text-[9px] truncate max-w-full">
                            {veh.title.split(' ')[0]}
                          </span>
                          <span className="text-[9px] font-bold">₹{veh.baseFare}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Ledger */}
                <div className="bg-[#f3f4ef] rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-[#404941]">
                    <span>Harvest Produce Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#14532d] font-bold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">eco</span>
                      Direct Farmer Share (84%):
                    </span>
                    <span>₹{farmerShare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#404941] gap-2">
                    <span className="flex items-center gap-1 min-w-0">
                      <span className="material-symbols-outlined text-[14px] text-[#003b1b] flex-shrink-0">
                        {activeVehicleConfig.icon}
                      </span>
                      <span className="truncate">
                        {activeDriverVehicle.driverName} ({activeVehicleConfig.title}):
                      </span>
                    </span>
                    <span className="font-semibold text-[#191c19] flex-shrink-0">₹{transitFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#404941]">
                    <span>Agmark Residue Lab & Tech:</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#14532d] font-semibold border-t border-[#c0c9be]/40 pt-1">
                    <span>Middlemen Commission:</span>
                    <span>₹0.00 (Zero Mandi Cartels)</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#191c19] border-t border-[#c0c9be]/40 pt-1.5">
                    <span>Grand Total:</span>
                    <span className="font-['Outfit'] text-base text-[#003b1b]">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery address */}
                <div className="p-2.5 rounded-xl border border-[#c0c9be]/40 bg-white flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#003b1b] text-[20px]">
                    location_on
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#191c19]">
                      Deliver to: Flat 402, Green Meadows, Baner, Pune
                    </span>
                    <span className="text-[11px] text-[#717970]">
                      Live driver GPS tracking active immediately upon farm dispatch
                    </span>
                  </div>
                </div>

                {/* Primary Action Button: Proceed to Dedicated Transport & Driver Selection or Offline Draft */}
                <div className="flex flex-col gap-2 pt-1">
                  {!isOnline ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        disabled
                        className="w-full h-12 bg-[#edeee9] text-[#717970] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-[#c0c9be]"
                      >
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        <span>You are offline. Live ordering is disabled.</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDraftLocally}
                        className="w-full py-2.5 bg-[#003b1b] hover:bg-[#14532d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {draftSaved ? 'check_circle' : 'save'}
                        </span>
                        <span>
                          {draftSaved
                            ? 'Draft Saved to Offline Queue! Will Sync When Reconnected'
                            : 'Save Order Draft to Local Queue (Syncs when Online)'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('transport_marketplace')}
                      className="w-full h-12 bg-[#14532d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-[#003b1b] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      <span>
                        {totalWeightKg >= 25
                          ? `Choose Bulk Transport & Driver (${totalWeightKg.toFixed(1)} kg) →`
                          : 'Choose Delivery Transport & Driver (Step 2 of 3) →'}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#717970] px-1">
                    <span className="truncate">
                      Pre-selected: <strong>{activeDriverVehicle.driverName}</strong> ({activeDriverVehicle.vehiclePlateNumber})
                    </span>
                    {isOnline && (
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('confirmation')}
                        className="text-[#14532d] font-bold hover:underline whitespace-nowrap cursor-pointer ml-2"
                      >
                        Quick Review →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: DEDICATED CHOOSE YOUR DELIVERY TRANSPORT & DRIVER MARKETPLACE */}
        {checkoutStep === 'transport_marketplace' && (
          <DeliveryTransportMarketplace
            language={language}
            orderWeightKg={totalWeightKg}
            selectedDriverVehicleId={selectedDriverVehicleId}
            onSelectDriverVehicle={handleSelectDriverVehicle}
            onBackToBasket={() => setCheckoutStep('basket')}
            onProceedToConfirmation={() => setCheckoutStep('confirmation')}
          />
        )}

        {/* STEP 3: FINAL ORDER CONFIRMATION WITH LOCKED-IN TRANSPORT & DRIVER */}
        {checkoutStep === 'confirmation' && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            {/* Confirmation Header */}
            <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('transport_marketplace')}
                  className="w-8 h-8 rounded-full bg-[#edeee9] flex items-center justify-center text-[#191c19] hover:bg-[#e7e9e3] transition-colors cursor-pointer"
                  title="Back to Transport Selection"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <div className="flex flex-col">
                  <h2 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#191c19]">
                    {isHindi ? 'ऑर्डर की पुष्टि करें' : 'Confirm Order & Delivery'}
                  </h2>
                  <span className="text-[11px] text-[#717970]">
                    Review assigned driver, vehicle details, and final locked pricing
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-[#14532d] text-white px-2.5 py-1 rounded-full">
                Step 3 of 3
              </span>
            </div>

            {/* Confirmed Assigned Driver & Vehicle Card */}
            <div className="bg-[#f8faf4] border-2 border-[#14532d] rounded-2xl p-3.5 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#003b1b] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#14532d]">
                    verified
                  </span>
                  Assigned Delivery Transporter
                </span>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('transport_marketplace')}
                  className="text-xs text-[#14532d] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Change</span>
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>

              {/* Driver & Vehicle Details */}
              <div className="flex items-start justify-between gap-3 bg-white p-3 rounded-xl border border-[#c0c9be]/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={activeDriverVehicle.driverPhoto}
                      alt={activeDriverVehicle.driverName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#14532d]/40"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#14532d] rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-['Outfit'] font-bold text-sm text-[#191c19] truncate">
                        {activeDriverVehicle.driverName}
                      </span>
                      <span
                        className="material-symbols-outlined text-[15px] text-[#14532d]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <span className="text-[11px] text-[#717970]">
                      {activeDriverVehicle.driverPhone} • {activeDriverVehicle.driverTrips} direct trips
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#904d00] font-bold">
                      <span className="bg-[#ffdcc3] px-1.5 py-0.2 rounded">
                        ★ {activeDriverVehicle.driverRating.toFixed(1)} Direct Rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* IND Plate Badge */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <div className="flex items-center bg-white border border-[#191c19] rounded px-2 py-0.5 shadow-2xs">
                    <div className="flex flex-col items-center mr-1 pr-1 border-r border-[#191c19]/30 text-[7px] font-black text-[#002244] leading-none">
                      <span>IND</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#191c19] tracking-wider">
                      {activeDriverVehicle.vehiclePlateNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#14532d] font-bold mt-1">
                    ₹{activeDriverVehicle.ratePerKm} / km
                  </span>
                </div>
              </div>

              {/* Vehicle Specifications & Cold Chain Banner */}
              <div className="bg-white/80 rounded-xl p-2.5 border border-[#c0c9be]/30 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#191c19]">
                    Vehicle: {activeDriverVehicle.vehicleModel}
                  </span>
                  <span className="text-[#003b1b] bg-[#b1f2be]/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {activeDriverVehicle.capacityLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#404941]">
                  <span>📍 {activeDriverVehicle.proximityKm} km from Farm Gate</span>
                  <span>•</span>
                  <span>~{activeDriverVehicle.etaMins} mins direct transit</span>
                  {activeDriverVehicle.coldChainReady && (
                    <>
                      <span>•</span>
                      <span className="text-[#14532d] font-bold">❄️ 14°C Chamber</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Produce Summary List */}
            <div className="bg-[#f3f4ef] rounded-xl p-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-[#191c19]">
                Produce Items ({items.length} items • {totalWeightKg.toFixed(1)} kg):
              </span>
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div
                    key={it.produce.id}
                    className="flex items-center justify-between text-xs py-0.5 border-b border-[#c0c9be]/20 last:border-0"
                  >
                    <span className="text-[#191c19] truncate pr-2">
                      {it.produce.name} ({it.quantity} {it.produce.unit})
                    </span>
                    <span className="font-['Outfit'] font-bold text-[#14532d] flex-shrink-0">
                      ₹{(it.produce.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Ledger with Locked-in Delivery Pricing */}
            <div className="bg-[#f3f4ef] rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex justify-between text-[#404941]">
                <span>Harvest Produce Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#14532d] font-bold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">eco</span>
                  Direct Farmer Share (84%):
                </span>
                <span>₹{farmerShare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#404941]">
                <span>
                  Delivery Transit Fee ({activeDriverVehicle.driverName} • {activeDriverVehicle.vehiclePlateNumber}):
                </span>
                <span className="font-semibold text-[#191c19]">
                  ₹{activeDriverVehicle.estimatedDeliveryCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[#404941]">
                <span>Agmark Residue Lab & Tech:</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#14532d] font-semibold border-t border-[#c0c9be]/40 pt-1">
                <span>Middlemen Commission:</span>
                <span>₹0.00 (Zero Mandi Cartels)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#191c19] border-t border-[#c0c9be]/40 pt-1.5">
                <span>Grand Total:</span>
                <span className="font-['Outfit'] text-base text-[#003b1b]">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-2.5 rounded-xl border border-[#c0c9be]/40 bg-white flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#003b1b] text-[20px]">
                location_on
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#191c19]">
                  Deliver to: Flat 402, Green Meadows, Baner, Pune
                </span>
                <span className="text-[10px] text-[#717970]">
                  Immediate dispatch notice sent to driver upon confirmation
                </span>
              </div>
            </div>

            {/* Final Confirmation CTA */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCheckoutStep('transport_marketplace')}
                className="col-span-1 h-12 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] transition-colors cursor-pointer"
              >
                ← Change
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={!isOnline}
                className={`col-span-2 h-12 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                  !isOnline
                    ? 'bg-[#edeee9] text-[#717970] border border-[#c0c9be] cursor-not-allowed'
                    : 'bg-[#14532d] text-white hover:bg-[#003b1b] active:scale-95 cursor-pointer'
                }`}
              >
                <span>{!isOnline ? 'Offline • Live Ordering Disabled' : `Confirm & Dispatch • ₹${grandTotal.toFixed(2)}`}</span>
                <span className="material-symbols-outlined text-[18px]">{!isOnline ? 'lock' : 'check_circle'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
