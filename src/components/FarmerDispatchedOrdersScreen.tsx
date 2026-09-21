import React, { useState } from 'react';
import { DirectOrder, Language } from '../types';

interface FarmerDispatchedOrdersScreenProps {
  language: Language;
  orders: DirectOrder[];
  onTrackOrder: (orderId: string) => void;
  onShowToast: (title: string, sub?: string) => void;
  onUpdateOrders?: (orders: DirectOrder[]) => void;
}

export const FarmerDispatchedOrdersScreen: React.FC<FarmerDispatchedOrdersScreenProps> = ({
  language,
  orders,
  onTrackOrder,
  onShowToast,
  onUpdateOrders
}) => {
  const isHindi = language === 'hi';

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGatePassOrder, setSelectedGatePassOrder] = useState<DirectOrder | null>(null);
  const [callingDriverOrder, setCallingDriverOrder] = useState<DirectOrder | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (filterTab === 'active' && order.status === 'Delivered') return false;
    if (filterTab === 'delivered' && order.status !== 'Delivered') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchesBuyer = order.buyerName?.toLowerCase().includes(query);
    const matchesId = order.id.toLowerCase().includes(query);
    const matchesDriver = order.driver?.name.toLowerCase().includes(query);
    const matchesPlate = order.vehicleDetails?.plateNumber.toLowerCase().includes(query) ||
      order.driver?.vehiclePlateNumber.toLowerCase().includes(query);
    const matchesCrop = order.items.some((it) => it.name.toLowerCase().includes(query));

    return matchesBuyer || matchesId || matchesDriver || matchesPlate || matchesCrop;
  });

  // Aggregate Metrics for Farmer
  const totalDispatchedKg = orders.reduce((acc, ord) => {
    const ordKg = ord.items.reduce((sum, item) => {
      // Estimate kg if unit is bag/crate/litre
      if (item.unit === 'bag') return sum + item.quantity * 10;
      if (item.unit === 'Litre') return sum + item.quantity * 0.92;
      return sum + item.quantity;
    }, 0);
    return acc + ordKg;
  }, 0);

  const totalFarmerRevenue = orders.reduce((acc, ord) => acc + ord.farmerShare, 0);
  const activeTransitCount = orders.filter((ord) => ord.status !== 'Delivered').length;
  const deliveredCount = orders.filter((ord) => ord.status === 'Delivered').length;

  const handleCallDriver = (order: DirectOrder) => {
    setCallingDriverOrder(order);
  };

  const handleSimulateCall = () => {
    if (!callingDriverOrder?.driver) return;
    onShowToast(
      isHindi ? `कॉलिंग: ${callingDriverOrder.driver.name}` : `Calling Transporter: ${callingDriverOrder.driver.name}`,
      `${callingDriverOrder.driver.phone} • ${callingDriverOrder.driver.vehiclePlateNumber}`
    );
    setTimeout(() => {
      setCallingDriverOrder(null);
    }, 1500);
  };

  const handleMarkDelivered = (orderId: string) => {
    if (!onUpdateOrders) return;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Delivered',
          currentMilestone: 'delivered' as const,
          distanceRemainingKm: 0,
          milestones: o.milestones?.map((m) => ({
            ...m,
            completed: true,
            current: m.key === 'delivered'
          }))
        };
      }
      return o;
    });
    onUpdateOrders(updated);
    onShowToast(
      isHindi ? `ऑर्डर #${orderId} पूर्ण चिह्नित!` : `Order #${orderId} Confirmed Delivered!`,
      isHindi ? 'भुगतान किसान खाते में जमा हुआ' : 'Direct payment confirmed in farmer bank balance'
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-32 pt-2 flex flex-col gap-4">
      {/* Farmer Dispatched Orders Header Banner */}
      <div className="px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#14532d] animate-pulse"></span>
            <h1 className="font-['Outfit'] font-bold text-2xl text-[#191c19]">
              {isHindi ? 'भेजे गए ऑर्डर (डिस्पैच)' : 'Orders Dispatched'}
            </h1>
          </div>
          <span className="bg-[#b1f2be] text-[#00210d] text-xs px-2.5 py-1 rounded-full font-bold border border-[#14532d]/30">
            {isHindi ? 'किसान हब' : 'Farmer Fulfillment'}
          </span>
        </div>
        <p className="text-xs text-[#404941] mt-0.5">
          {isHindi
            ? 'खेत से सीधे भेजे गए सभी सक्रिय व पूर्ण ऑर्डर • खरीदार, फसल मात्रा व वाहन ट्रैकिंग'
            : 'Direct harvest dispatch ledger • Buyer details, crop volume, carrier telemetry & direct payouts'}
        </p>
      </div>

      {/* Farmer High-Level Metric Dashboard Card */}
      <div className="px-4">
        <div className="bg-[#14532d] text-white rounded-2xl p-4 shadow-md relative overflow-hidden flex flex-col gap-3">
          {/* Subtle Graphic Watermark */}
          <div className="absolute -right-4 -bottom-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[150px]">local_shipping</span>
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-xs font-semibold text-[#87c695] uppercase tracking-wider block">
                {isHindi ? 'कुल प्रत्यक्ष डिस्पैच मूल्य' : 'Total Harvest Revenue Dispatched'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-['Outfit'] font-bold text-3xl text-white">
                  ₹{totalFarmerRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs bg-[#003b1b] text-[#b1f2be] px-2 py-0.5 rounded-full font-bold border border-[#b1f2be]/20">
                  100% Direct Payout
                </span>
              </div>
            </div>
            <div className="bg-white/10 px-2.5 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-[#87c695] block uppercase font-bold">Middlemen Cut</span>
              <span className="font-bold text-sm text-[#ffdcc3]">₹0.00 Saved</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 relative z-10 text-center">
            <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#87c695] font-semibold uppercase">Total Volume</span>
              <span className="font-['Outfit'] font-bold text-base text-white mt-0.5">
                {totalDispatchedKg.toFixed(0)} kg
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#87c695] font-semibold uppercase">Active Fleet</span>
              <span className="font-['Outfit'] font-bold text-base text-[#ffdcc3] mt-0.5">
                {activeTransitCount} Vehicles
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 flex flex-col items-center">
              <span className="text-[10px] text-[#87c695] font-semibold uppercase">Fulfilled</span>
              <span className="font-['Outfit'] font-bold text-base text-[#b1f2be] mt-0.5">
                {deliveredCount} Delivered
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="px-4 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-[#edeee9] rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-[#191c19] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            {isHindi ? `सभी ऑर्डर (${orders.length})` : `All (${orders.length})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              filterTab === 'active'
                ? 'bg-white text-[#14532d] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            {isHindi ? `मार्ग में (${activeTransitCount})` : `In Transit (${activeTransitCount})`}
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('delivered')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              filterTab === 'delivered'
                ? 'bg-white text-[#191c19] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            {isHindi ? `वितरित (${deliveredCount})` : `Delivered (${deliveredCount})`}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#717970]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'खरीदार, फसल, ऑर्डर आईडी या वाहन नंबर से खोजें...'
                : 'Search by buyer, crop, order ID or vehicle plate...'
            }
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#c0c9be]/40 rounded-xl text-xs text-[#191c19] focus:outline-none focus:ring-1 focus:ring-[#14532d]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#717970] hover:text-[#191c19] text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Dispatched Orders List */}
      <div className="px-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#c0c9be]/30 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#f3f4ef] text-[#717970] flex items-center justify-center">
              <span className="material-symbols-outlined text-[30px]">local_shipping</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#191c19]">
                {isHindi ? 'कोई डिस्पैच ऑर्डर नहीं मिला' : 'No Dispatched Orders Found'}
              </h3>
              <p className="text-xs text-[#717970] mt-1 max-w-xs">
                {isHindi
                  ? 'खोज फिल्टर के अनुसार कोई परिणाम नहीं मिला। फ़िल्टर बदलें।'
                  : 'Try clearing your search query or switching tabs.'}
              </p>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-[#14532d] text-white rounded-xl text-xs font-bold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isDelivered = order.status === 'Delivered';
            const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const cropTypes = Array.from(new Set(order.items.map((it) => it.name.split('(')[0].trim())));

            return (
              <div
                key={order.id}
                className="bg-white border border-[#c0c9be]/35 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3.5"
              >
                {/* Card Top Strip: Order ID, Timestamp & Delivery Status */}
                <div className="flex items-start justify-between gap-2 border-b border-[#edeee9] pb-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-['Outfit'] font-bold text-sm text-[#003b1b] bg-[#b1f2be]/40 border border-[#14532d]/20 px-2 py-0.5 rounded-md">
                        #{order.id}
                      </span>
                      <span className="text-[11px] text-[#717970] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {order.placedAt}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#404941] mt-1">
                      Farm Origin: <strong>{order.originHub || order.farmLocation}</strong>
                    </span>
                  </div>

                  {/* Delivery Status Badge */}
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-xs ${
                        isDelivered
                          ? 'bg-[#e7e9e3] text-[#404941]'
                          : order.status === 'Picked up from Farm'
                          ? 'bg-[#ffdcc3] text-[#663500] border border-[#fe932c]/30'
                          : 'bg-[#14532d] text-white'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDelivered
                            ? 'bg-[#717970]'
                            : order.status === 'Picked up from Farm'
                            ? 'bg-[#fe932c]'
                            : 'bg-[#b1f2be] animate-ping'
                        }`}
                      ></span>
                      <span>{order.status}</span>
                    </span>
                    {!isDelivered && order.distanceRemainingKm !== undefined && (
                      <span className="text-[11px] text-[#14532d] font-bold mt-1">
                        {order.distanceRemainingKm > 0 ? `${order.distanceRemainingKm} km remaining` : 'Arriving now'}
                      </span>
                    )}
                  </div>
                </div>

                {/* 1. Buyer Information Section */}
                <div className="bg-[#f8faf4] border border-[#c0c9be]/25 rounded-xl p-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#14532d]/10 text-[#14532d] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-[#191c19] truncate">
                          {order.buyerName || 'Direct Consumer Buyer'}
                        </h4>
                        <span className="text-[10px] bg-[#e7e9e3] text-[#404941] px-1.5 py-0.2 rounded font-semibold uppercase">
                          Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs text-[#404941] flex items-center gap-1 mt-0.5 truncate">
                        <span className="material-symbols-outlined text-[14px] text-[#717970] flex-shrink-0">
                          location_on
                        </span>
                        <span className="truncate">{order.buyerLocation || order.destinationHub || 'City Delivery Hub'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] text-[#717970] block uppercase font-semibold">Farmer Share</span>
                    <span className="font-['Outfit'] font-bold text-base text-[#003b1b]">
                      ₹{order.farmerShare.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 2. Crop Type & Total Harvest Quantity Section */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#191c19]">
                    <span className="flex items-center gap-1 text-[#003b1b]">
                      <span className="material-symbols-outlined text-[16px]">agriculture</span>
                      Dispatched Crops & Quantities
                    </span>
                    <span className="bg-[#edeee9] text-[#191c19] px-2 py-0.5 rounded-full text-[11px] font-bold">
                      Total Volume: {totalQty} {order.items[0]?.unit || 'kg'}
                    </span>
                  </div>

                  {/* Crop items detail list */}
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f3f4ef] rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-[#c0c9be]/40"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#b1f2be]/40 text-[#003b1b] flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-[18px]">potted_plant</span>
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[#191c19] truncate">{item.name}</span>
                            <span className="text-[11px] text-[#717970]">
                              Grade A Farm Gate • ₹{item.pricePerUnit} / {item.unit}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-sm text-[#003b1b]">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-[11px] text-[#717970] block">
                            ₹{item.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Assigned Vehicle & Driver Details Section */}
                <div className="bg-[#edeee9]/70 border border-[#c0c9be]/40 rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#404941] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#14532d]">
                        local_shipping
                      </span>
                      Assigned Transport & Driver Details
                    </span>

                    {/* Cold chain badge */}
                    {order.vehicleDetails?.temperatureControlled && (
                      <span className="bg-[#b1f2be] text-[#00210d] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">ac_unit</span>
                        14.2°C Cold Chain
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {order.driver?.photo ? (
                        <img
                          src={order.driver.photo}
                          alt={order.driver.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-[#14532d]/20 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#14532d] text-white flex items-center justify-center font-bold flex-shrink-0">
                          {order.driver?.name ? order.driver.name.charAt(0) : '🚚'}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#191c19] truncate">
                            {order.driver?.name || 'Assigned Logistics Driver'}
                          </span>
                          {order.driver?.rating && (
                            <span className="text-[11px] bg-white text-[#904d00] px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5 border border-[#c0c9be]/30">
                              ★ {order.driver.rating}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#404941] truncate font-medium">
                          {order.vehicleDetails?.name || order.driver?.vehicleTypeName || 'Direct Transit Carrier'}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Plate Badge with IND Style */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <div className="bg-white border border-[#c0c9be] rounded px-2 py-0.5 flex items-center gap-1 shadow-xs">
                        <div className="flex flex-col items-center justify-center border-r border-gray-300 pr-1 mr-0.5 leading-none">
                          <span className="text-[6px] font-bold text-blue-700">IND</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-gray-900 tracking-wider">
                          {order.vehicleDetails?.plateNumber || order.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#717970] mt-0.5">
                        Capacity: {order.vehicleDetails?.capacity || 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Driver status / Speed telemetry */}
                  {!isDelivered && order.driver && (
                    <div className="bg-white/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] text-[#404941]">
                      <span className="truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#14532d]">navigation</span>
                        {order.driver.statusMessage || 'Cruising highway corridor to buyer'}
                      </span>
                      {order.driver.liveSpeedKmH !== undefined && order.driver.liveSpeedKmH > 0 && (
                        <span className="font-bold text-[#003b1b] flex-shrink-0 ml-2">
                          {order.driver.liveSpeedKmH} km/h
                        </span>
                      )}
                    </div>
                  )}

                  {/* Driver Contact & Live Tracking Action Row */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCallDriver(order)}
                      className="min-h-[44px] px-2 bg-white border border-[#c0c9be]/60 hover:bg-[#e7e9e3] text-[#191c19] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#003b1b] flex-shrink-0">phone</span>
                      <span className="truncate">Call Carrier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onTrackOrder(order.id)}
                      className="min-h-[44px] px-2 bg-[#14532d] hover:bg-[#003b1b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] flex-shrink-0">location_searching</span>
                      <span className="truncate">Live GPS</span>
                    </button>
                  </div>
                </div>

                {/* Footer Utilities: Gate Pass & Manual Fulfillment Confirm */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedGatePassOrder(order)}
                    className="min-h-[36px] text-[#003b1b] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    <span>Gate Pass & Agmark Seal</span>
                  </button>

                  {!isDelivered && onUpdateOrders && (
                    <button
                      type="button"
                      onClick={() => handleMarkDelivered(order.id)}
                      className="min-h-[36px] text-[#717970] hover:text-[#003b1b] text-[11px] font-semibold flex items-center gap-1 cursor-pointer ml-auto"
                    >
                      <span>Confirm Delivery</span>
                      <span className="material-symbols-outlined text-[13px]">check</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gate Transit Pass Modal */}
      {selectedGatePassOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#c0c9be]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#edeee9] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-[#14532d]">
                  verified
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#191c19]">Farm-Gate Transit Pass</h3>
                  <span className="text-[10px] text-[#717970]">
                    Official Direct Dispatch • Agmark Certified
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGatePassOrder(null)}
                className="w-8 h-8 rounded-full bg-[#f3f4ef] flex items-center justify-center text-[#404941] hover:bg-[#e7e9e3] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Digital Gate QR */}
            <div className="bg-[#f8faf4] border-2 border-dashed border-[#14532d]/40 rounded-xl p-4 flex flex-col items-center text-center gap-2">
              <div className="w-32 h-32 bg-white rounded-lg p-2 border border-[#c0c9be]/40 shadow-inner flex items-center justify-center">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-black/5 rounded">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i * 7 + 3) % 4 === 0 || i % 5 === 0 ? 'bg-[#003b1b]' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-[#003b1b]">
                PASS-{selectedGatePassOrder.id}-AGMARK
              </span>
              <span className="text-[11px] text-[#717970]">
                Scan at Highway Checkpoint or Buyer Gate
              </span>
            </div>

            {/* Pass Metadata details */}
            <div className="space-y-1.5 text-xs text-[#191c19] bg-[#edeee9]/50 rounded-xl p-3">
              <div className="flex justify-between">
                <span className="text-[#717970]">Consignor (Farmer):</span>
                <span className="font-bold">{selectedGatePassOrder.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Consignee (Buyer):</span>
                <span className="font-bold">{selectedGatePassOrder.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Transporter:</span>
                <span className="font-bold">{selectedGatePassOrder.driver?.name} ({selectedGatePassOrder.vehicleDetails?.plateNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#717970]">Total Net Valuation:</span>
                <span className="font-bold text-[#003b1b]">₹{selectedGatePassOrder.farmerShare.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedGatePassOrder(null);
                onShowToast(
                  isHindi ? 'गेट पास डाउनलोड हुआ' : 'Gate Transit Pass Saved',
                  `Pass #${selectedGatePassOrder.id} ready for driver inspection`
                );
              }}
              className="w-full h-11 bg-[#14532d] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#003b1b] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download Digital Gate Pass PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Driver Call Modal */}
      {callingDriverOrder && callingDriverOrder.driver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#c0c9be]/30 flex flex-col gap-4 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full mx-auto overflow-hidden ring-4 ring-[#14532d]/20">
              <img
                src={callingDriverOrder.driver.photo}
                alt={callingDriverOrder.driver.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#14532d] uppercase tracking-wider block">
                Direct Driver Contact
              </span>
              <h3 className="font-bold text-lg text-[#191c19] mt-0.5">
                {callingDriverOrder.driver.name}
              </h3>
              <p className="text-xs text-[#717970] mt-0.5">
                {callingDriverOrder.vehicleDetails?.name} • {callingDriverOrder.vehicleDetails?.plateNumber}
              </p>
            </div>

            <div className="bg-[#f3f4ef] rounded-xl p-3 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#003b1b]">phone</span>
              <span className="font-mono font-bold text-sm text-[#003b1b]">
                {callingDriverOrder.driver.phone}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCallingDriverOrder(null)}
                className="h-11 bg-[#edeee9] text-[#404941] rounded-xl text-xs font-bold hover:bg-[#e7e9e3] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSimulateCall}
                className="h-11 bg-[#14532d] text-white rounded-xl text-xs font-bold hover:bg-[#003b1b] flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Dial Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
