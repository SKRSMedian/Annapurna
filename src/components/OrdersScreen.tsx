import React, { useState, useEffect } from 'react';
import { ASSETS, INITIAL_ORDERS } from '../data/mockData';
import { DirectOrder, Language } from '../types';

interface OrdersScreenProps {
  language: Language;
  onTrackOrder: (orderId: string) => void;
  onShowToast: (title: string, sub?: string) => void;
  orders?: DirectOrder[];
  onUpdateOrders?: (orders: DirectOrder[]) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  time: string;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  language,
  onTrackOrder,
  onShowToast,
  orders: propOrders,
  onUpdateOrders
}) => {
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'subs'>('active');
  const [internalOrders, setInternalOrders] = useState<DirectOrder[]>(INITIAL_ORDERS);
  const orders = propOrders || internalOrders;

  const setOrders = (updater: (prev: DirectOrder[]) => DirectOrder[]) => {
    if (onUpdateOrders) {
      onUpdateOrders(updater(orders));
    } else {
      setInternalOrders(updater);
    }
  };

  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);

  // Driver Call Modal State
  const [callingDriverOrder, setCallingDriverOrder] = useState<DirectOrder | null>(null);

  // Driver Chat Modal State
  const [chattingDriverOrder, setChattingDriverOrder] = useState<DirectOrder | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'AP-9042': [
      {
        id: 'm-1',
        sender: 'driver',
        text: 'Namaste ji! I have loaded your Roma Tomatoes in the pre-cooled cargo bed. Passing through Chakan bypass now.',
        time: '11:48 AM'
      },
      {
        id: 'm-2',
        sender: 'user',
        text: 'Great! Please make sure crates stay out of the direct sun.',
        time: '11:52 AM'
      },
      {
        id: 'm-3',
        sender: 'driver',
        text: 'Chamber temperature is actively regulated at 14.2°C. Will deliver directly to Baner.',
        time: '11:53 AM'
      }
    ]
  });

  // Live countdown timer for Order 1 (1h 21m -> decreases in seconds)
  const [order1SecondsLeft, setOrder1SecondsLeft] = useState(81 * 60); // 1 hr 21 mins
  const [order2SecondsLeft, setOrder2SecondsLeft] = useState(14 * 60); // 14 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setOrder1SecondsLeft((prev) => Math.max(0, prev - 1));
      setOrder2SecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  // Interactive quantity adjustment for items in order
  const handleItemQtyChange = (orderId: string, itemIdx: number, delta: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newItems = [...ord.items];
        const item = { ...newItems[itemIdx] };
        const newQty = Math.max(1, item.quantity + delta);
        item.quantity = newQty;
        item.total = item.pricePerUnit * newQty;
        newItems[itemIdx] = item;

        const newTotal = newItems.reduce((acc, it) => acc + it.total, 0);
        const newFarmerShare = Math.round(newTotal * 0.84);
        const newTransitFee = Math.round(newTotal * 0.11);
        const newPlatformFee = newTotal - newFarmerShare - newTransitFee;

        return {
          ...ord,
          items: newItems,
          totalAmount: newTotal,
          farmerShare: newFarmerShare,
          transitFee: newTransitFee,
          platformFee: newPlatformFee
        };
      })
    );
  };

  const handleSaveEdits = (orderId: string) => {
    onShowToast(
      isHindi ? `ऑर्डर #${orderId} में बदलाव सहेजे गए!` : `Edits Saved for #${orderId}!`,
      isHindi
        ? 'नया बिल व किसान हिस्सा री-कैल्क्युलेट कर लिया गया है'
        : 'Updated dispatch weights synced with Gurpreet’s harvest scale'
    );
  };

  const handleConfirmCancel = () => {
    if (!cancelModalOrderId) return;
    const cancelledId = cancelModalOrderId;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === cancelledId
          ? { ...ord, status: 'Cancelled', cancelReason: 'Cancelled by customer before harvest' }
          : ord
      )
    );
    setCancelModalOrderId(null);
    onShowToast(
      'Order Cancelled',
      'Instant 100% refund credited back to your UPI account'
    );
  };

  const handleDownloadInvoice = (orderId: string) => {
    onShowToast(
      'Invoice Generated',
      `Tax Invoice & Farm Mandi Receipt for #${orderId} downloaded`
    );
  };

  const handleSendChatMessage = (orderId: string, customText?: string) => {
    const textToSend = customText || chatInputText.trim();
    if (!textToSend) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), newMsg]
    }));

    if (!customText) setChatInputText('');

    // Driver auto-reply simulation after 1 second
    setTimeout(() => {
      const driverReplies = [
        'Understood! Driving safely and maintaining cold storage temp.',
        'Noted! I will ring the bell as requested when I pull up.',
        'Yes, I have verified the digital seal at the farm gate. Everything is fresh!',
        'Approaching your locality now, will arrive on schedule.'
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'driver',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => ({
        ...prev,
        [orderId]: [...(prev[orderId] || []), replyMsg]
      }));
    }, 1200);
  };

  const getVehicleIcon = (type?: string) => {
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

  const getVehicleTitle = (ord: DirectOrder) => {
    if (ord.vehicleDetails?.name) return ord.vehicleDetails.name;
    switch (ord.transportVehicle) {
      case '2-wheeler':
        return '2-Wheeler Express';
      case '3-wheeler':
        return 'Cargo Auto 3-Wheeler';
      case 'truck':
        return 'Heavy Commercial Truck';
      case 'tempo':
      default:
        return 'Tata Ace EV Refrigerated Tempo';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-32 pt-2 flex flex-col gap-4">
      {/* Header Title */}
      <div className="px-4">
        <h1 className="font-['Outfit'] font-bold text-2xl text-[#191c19]">
          My Orders & Modifications
        </h1>
        <p className="text-xs text-[#404941]">
          Live tracking, harvest quantity adjustments, and transparent invoices
        </p>
      </div>

      {/* 2-Hour Harvest Edit Policy Banner */}
      <div className="px-4">
        <div className="bg-[#b1f2be]/40 border border-[#14532d]/20 rounded-xl p-3.5 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#14532d] text-[22px] flex-shrink-0 mt-0.5">
            timelapse
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#00210d]">
              2-Hour Pre-Harvest Modification Window
            </span>
            <p className="text-[11px] text-[#12512c] mt-0.5 leading-relaxed">
              Our crops are harvested fresh on demand. You can freely change quantities, add items, or modify delivery slots before morning plucking begins.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#edeee9] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-[#191c19] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            Active Orders (2)
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'past'
                ? 'bg-white text-[#191c19] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            Past Harvests (8)
          </button>
          <button
            onClick={() => setActiveTab('subs')}
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === 'subs'
                ? 'bg-white text-[#191c19] shadow-sm font-bold'
                : 'text-[#404941] hover:text-[#191c19]'
            }`}
          >
            Subscriptions
          </button>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="px-4 space-y-4">
        {activeTab === 'active' &&
          orders.map((ord) => {
            const isCancelled = ord.status === 'Cancelled';
            const secondsLeft = ord.id === 'AP-9042' ? order1SecondsLeft : order2SecondsLeft;
            const canEdit = !isCancelled && secondsLeft > 0;

            return (
              <article
                key={ord.id}
                className={`bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all ${
                  isCancelled ? 'border-[#ba1a1a]/30 opacity-75' : 'border-[#c0c9be]/40'
                }`}
              >
                {/* Order Header Bar */}
                <div className="bg-[#f3f4ef] p-3.5 border-b border-[#c0c9be]/30 flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-['Outfit'] font-bold text-sm sm:text-base text-[#191c19]">
                        Order #{ord.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isCancelled
                            ? 'bg-[#ba1a1a] text-white'
                            : ord.id === 'AP-9042'
                            ? 'bg-[#ffdcc3] text-[#2f1500]'
                            : 'bg-[#b1f2be] text-[#00210d]'
                        }`}
                      >
                        {isCancelled ? 'Cancelled' : ord.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#404941] mt-0.5">
                      Placed {ord.placedAt} • Est. Arrival {ord.eta}
                    </span>
                  </div>

                  {canEdit && (
                    <div className="flex items-center gap-1 bg-[#14532d] text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm animate-pulse">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      <span>{formatTime(secondsLeft)} left to edit</span>
                    </div>
                  )}
                </div>

                {/* Farmer Capsule */}
                <div className="px-4 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-[#14532d]"
                      alt={ord.farmerName}
                      src={ASSETS.gurpreetWarmPortrait}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#191c19]">
                        {ord.farmerName}
                      </span>
                      <span className="text-[11px] text-[#717970]">{ord.farmLocation}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onTrackOrder(ord.id)}
                    className="text-xs font-bold text-[#14532d] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">location_searching</span>
                    <span>Track Live</span>
                  </button>
                </div>

                {/* Ordered Items with Steppers */}
                <div className="p-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-[#191c19]">
                    Produce Items ({ord.items.length})
                  </span>

                  <div className="space-y-2.5">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f3f4ef] rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold text-xs sm:text-sm text-[#191c19] truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-[#717970]">
                            ₹{item.pricePerUnit.toFixed(2)} / {item.unit}
                          </span>
                        </div>

                        {/* Interactive Quantity Modifier (if in edit window) */}
                        {canEdit ? (
                          <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-[#c0c9be]/40 shadow-sm">
                            <button
                              onClick={() => handleItemQtyChange(ord.id, idx, -1)}
                              className="w-7 h-7 rounded bg-[#edeee9] text-xs font-bold flex items-center justify-center hover:bg-[#e7e9e3] active:scale-95 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-[#191c19] min-w-[2.5rem] text-center">
                              {item.quantity} {item.unit}
                            </span>
                            <button
                              onClick={() => handleItemQtyChange(ord.id, idx, 1)}
                              className="w-7 h-7 rounded bg-[#edeee9] text-xs font-bold flex items-center justify-center hover:bg-[#e7e9e3] active:scale-95 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#191c19] bg-white px-2 py-1 rounded">
                            {item.quantity} {item.unit}
                          </span>
                        )}

                        <div className="text-right min-w-[4rem]">
                          <span className="font-['Outfit'] font-bold text-sm text-[#191c19]">
                            ₹{item.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🚚 Real-time Assigned Vehicle & Driver Details */}
                  {!isCancelled && (
                    <div className="rounded-xl bg-[#f8faf4] border border-[#c0c9be]/50 p-3 flex flex-col gap-2.5 shadow-xs">
                      {/* Vehicle & Plate Header */}
                      <div className="flex items-center justify-between border-b border-[#c0c9be]/30 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#14532d] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                            <span className="material-symbols-outlined text-[18px]">
                              {getVehicleIcon(ord.transportVehicle || ord.vehicleDetails?.type)}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs font-bold text-[#191c19] truncate">
                                {getVehicleTitle(ord)}
                              </span>
                              {ord.vehicleDetails?.temperatureControlled && (
                                <span className="bg-[#b1f2be]/60 text-[#003b1b] text-[9px] font-bold px-1.5 py-0.2 rounded-full flex-shrink-0">
                                  ❄️ Cold-Chain
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#717970] truncate">
                              Direct Farm-to-Kitchen Transit
                            </span>
                          </div>
                        </div>

                        {/* Number Plate Display */}
                        <div className="flex items-center bg-white border border-[#191c19]/80 rounded px-1.5 py-0.5 shadow-xs flex-shrink-0">
                          <div className="flex flex-col items-center mr-1 pr-1 border-r border-[#191c19]/30 text-[7px] font-black text-[#002244]">
                            <span>IND</span>
                          </div>
                          <span className="font-mono font-bold text-[11px] text-[#191c19] tracking-wider">
                            {ord.vehicleDetails?.plateNumber ||
                              ord.driver?.vehiclePlateNumber ||
                              'MH-14-EA-9912'}
                          </span>
                        </div>
                      </div>

                      {/* Driver Details & Direct Call/Chat Action */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={ord.driver?.photo || ASSETS.balwantSingh}
                              alt={ord.driver?.name || 'Assigned Driver'}
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#14532d]/40"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#14532d] rounded-full border border-white"></span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-xs text-[#191c19] truncate">
                                {ord.driver?.name || 'Sunil Pawar'}
                              </span>
                              <span className="text-[10px] bg-[#ffdcc3] text-[#663500] font-bold px-1 rounded flex-shrink-0">
                                ★ {ord.driver?.rating || 4.9}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#717970] truncate">
                              {ord.driver?.tripsCount || 428} direct farm deliveries
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: Direct Call and Direct Chat */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setCallingDriverOrder(ord)}
                            className="h-8 px-2.5 rounded-lg bg-[#14532d] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-[#003b1b] active:scale-95 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">call</span>
                            <span>Call</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setChattingDriverOrder(ord)}
                            className="h-8 px-2.5 rounded-lg bg-white border border-[#14532d]/40 text-[#14532d] text-[11px] font-bold flex items-center gap-1 shadow-xs hover:bg-[#f3f4ef] active:scale-95 transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">chat</span>
                            <span>Chat</span>
                          </button>
                        </div>
                      </div>

                      {/* Live Telemetry Bar */}
                      <div className="bg-white rounded-lg px-2 py-1.5 border border-[#c0c9be]/30 flex items-center justify-between text-[10px] text-[#404941]">
                        <div className="flex items-center gap-1 truncate">
                          <span className="material-symbols-outlined text-[13px] text-[#14532d]">
                            farsight_digital
                          </span>
                          <span className="truncate">
                            {ord.driver?.statusMessage ||
                              `${ord.distanceRemainingKm || 16} km away • On Highway NH-60`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 font-medium ml-1">
                          {ord.driver?.chamberTempC && (
                            <span className="text-[#14532d] font-bold">
                              ❄️ {ord.driver.chamberTempC}°C
                            </span>
                          )}
                          <span className="text-[#904d00] font-bold">
                            ⚡ {ord.driver?.liveSpeedKmH || 48} km/h
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Transparency Breakdown */}
                  <div className="border-t border-[#c0c9be]/30 pt-3 flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between text-[#404941]">
                      <span>Produce Subtotal:</span>
                      <span>₹{(ord.totalAmount - ord.transitFee - ord.platformFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#14532d] font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">eco</span>
                        Direct Farmer Share:
                      </span>
                      <span>₹{ord.farmerShare.toFixed(2)} (84%)</span>
                    </div>
                    <div className="flex justify-between text-[#404941]">
                      <span>Direct EV Transit:</span>
                      <span>₹{ord.transitFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#404941]">
                      <span>Quality Testing & Platform:</span>
                      <span>₹{ord.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#191c19] font-bold text-sm pt-1 border-t border-[#c0c9be]/30">
                      <span>Total Paid:</span>
                      <span className="font-['Outfit'] text-base text-[#003b1b]">
                        ₹{ord.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 flex flex-col gap-2">
                    {canEdit && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleSaveEdits(ord.id)}
                          className="h-10 rounded-xl bg-[#14532d] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:bg-[#003b1b] active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          Save Edits
                        </button>
                        <button
                          onClick={() => setCancelModalOrderId(ord.id)}
                          className="h-10 rounded-xl bg-[#ba1a1a]/10 text-[#ba1a1a] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#ba1a1a]/20 active:scale-95 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Cancel Order
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onTrackOrder(ord.id)}
                        className="h-10 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#e7e9e3] active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                        Track Van
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(ord.id)}
                        className="h-10 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#e7e9e3] active:scale-95 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Receipt / Tax PDF
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

        {activeTab === 'past' && (
          <div className="bg-white rounded-xl p-6 text-center flex flex-col items-center gap-2 border border-[#c0c9be]/30 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#003b1b]">history</span>
            <h4 className="font-bold text-sm text-[#191c19]">8 Completed Farm Deliveries</h4>
            <p className="text-xs text-[#404941]">
              All past orders were picked fresh and delivered with 100% certified residue-free seal.
            </p>
            <button
              onClick={() => onShowToast('Past Harvest Re-order', 'Added last week’s organic veggies to your current basket')}
              className="mt-2 h-9 px-4 rounded-lg bg-[#14532d] text-white text-xs font-bold cursor-pointer hover:bg-[#003b1b]"
            >
              Repeat Last Week's Basket (₹640)
            </button>
          </div>
        )}

        {activeTab === 'subs' && (
          <div className="bg-white rounded-xl p-6 text-center flex flex-col items-center gap-2 border border-[#c0c9be]/30 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-[#fe932c]">calendar_month</span>
            <h4 className="font-bold text-sm text-[#191c19]">Weekly Farm Box Subscription</h4>
            <p className="text-xs text-[#404941]">
              Receive a fresh curated box of 8 seasonal vegetables plucked every Tuesday morning at 15% subscriber discount.
            </p>
            <button
              onClick={() => onShowToast('Subscription Activated', 'Tuesday Farm Box scheduled for dispatch')}
              className="mt-2 h-9 px-4 rounded-lg bg-[#fe932c] text-[#663500] text-xs font-bold cursor-pointer hover:bg-[#ffdcc3]"
            >
              Start Weekly Subscription
            </button>
          </div>
        )}
      </div>

      {/* Grievance & Zero Risk Guarantee */}
      <div className="px-4">
        <div className="bg-[#f3f4ef] border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm flex items-start gap-3">
          <span className="material-symbols-outlined text-[#14532d] text-[22px] flex-shrink-0 mt-0.5">
            security
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#191c19]">
              Zero Intermediary Grievance Redressal
            </span>
            <p className="text-[11px] text-[#404941] mt-0.5 leading-relaxed">
              If any harvest item arrives bruised or below grade, tap here for an instant replacement directly from tomorrow morning's transit van with zero questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg text-center text-[#191c19]">
              Cancel Order #{cancelModalOrderId}?
            </h3>
            <p className="text-xs text-[#404941] text-center leading-relaxed">
              Since Farmer Gurpreet has not yet plucked this lot, 100% of your payment will be refunded immediately to your UPI bank account with zero cancellation fees.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrderId(null)}
                className="h-10 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] cursor-pointer"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="h-10 rounded-xl bg-[#ba1a1a] text-white text-xs font-bold hover:bg-[#93000a] cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📞 Call Driver Modal */}
      {callingDriverOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#717970] uppercase tracking-wider">
                Direct Driver Contact Line
              </span>
              <button
                type="button"
                onClick={() => setCallingDriverOrder(null)}
                className="w-7 h-7 rounded-full bg-[#edeee9] flex items-center justify-center text-[#191c19] hover:bg-[#e7e9e3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/40">
              <div className="relative">
                <img
                  src={callingDriverOrder.driver?.photo || ASSETS.balwantSingh}
                  alt={callingDriverOrder.driver?.name || 'Driver'}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#14532d]"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#14532d] rounded-full border-2 border-white"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  {callingDriverOrder.driver?.name || 'Sunil Pawar'}
                </span>
                <span className="text-xs text-[#404941]">
                  {getVehicleTitle(callingDriverOrder)}
                </span>
                <span className="font-mono text-xs text-[#14532d] font-bold">
                  {callingDriverOrder.vehicleDetails?.plateNumber ||
                    callingDriverOrder.driver?.vehiclePlateNumber ||
                    'MH-14-EA-9912'}
                </span>
              </div>
            </div>

            <div className="bg-[#edeee9] rounded-xl p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#717970]">Driver Direct Phone</span>
                <span className="text-sm font-mono font-bold text-[#191c19]">
                  {callingDriverOrder.driver?.phone || '+91 98234 77120'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    callingDriverOrder.driver?.phone || '+91 98234 77120'
                  );
                  onShowToast('Phone Copied', 'Driver mobile number copied to clipboard');
                }}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#c0c9be]/50 text-xs font-bold text-[#191c19] flex items-center gap-1 hover:bg-[#f3f4ef] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>

            <p className="text-[11px] text-[#717970] text-center leading-relaxed">
              Transit line connects via hands-free driver cabin headset. Safe driving protocols active.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCallingDriverOrder(null)}
                className="h-10 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] cursor-pointer"
              >
                Dismiss
              </button>
              <a
                href={`tel:${callingDriverOrder.driver?.phone || '+919823477120'}`}
                onClick={() => {
                  onShowToast(
                    'Calling Driver...',
                    `Connecting to ${callingDriverOrder.driver?.name || 'Sunil Pawar'}`
                  );
                  setCallingDriverOrder(null);
                }}
                className="h-10 rounded-xl bg-[#14532d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#003b1b] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 💬 Chat with Driver Drawer / Modal */}
      {chattingDriverOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] h-[550px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 bg-[#14532d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={chattingDriverOrder.driver?.photo || ASSETS.balwantSingh}
                    alt={chattingDriverOrder.driver?.name || 'Driver'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#b1f2be] rounded-full border border-white"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Outfit'] font-bold text-sm text-white truncate">
                      {chattingDriverOrder.driver?.name || 'Sunil Pawar'}
                    </span>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono">
                      {chattingDriverOrder.vehicleDetails?.plateNumber ||
                        chattingDriverOrder.driver?.vehiclePlateNumber ||
                        'MH-14-EA-9912'}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/80 truncate">
                    {getVehicleTitle(chattingDriverOrder)} • {chattingDriverOrder.distanceRemainingKm || 16} km away
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChattingDriverOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Action Chips */}
            <div className="p-2 bg-[#f3f4ef] border-b border-[#c0c9be]/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-[#717970] whitespace-nowrap pl-1">
                Quick:
              </span>
              {[
                'Where are you now?',
                'Please call before arrival',
                'Leave at building security',
                'Keep in cool shade'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(chattingDriverOrder.id, chip)}
                  className="px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold text-[#191c19] border border-[#c0c9be]/40 hover:bg-[#14532d] hover:text-white transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 bg-[#f8faf4]">
              {(chatMessages[chattingDriverOrder.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#14532d] text-white rounded-br-xs'
                        : 'bg-white border border-[#c0c9be]/40 text-[#191c19] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#717970] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-2.5 bg-white border-t border-[#c0c9be]/30 flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage(chattingDriverOrder.id);
                }}
                placeholder={`Message ${chattingDriverOrder.driver?.name || 'Driver'}...`}
                className="flex-1 h-10 px-3 rounded-xl bg-[#f3f4ef] text-xs text-[#191c19] border border-transparent focus:border-[#14532d] focus:bg-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage(chattingDriverOrder.id)}
                className="w-10 h-10 rounded-xl bg-[#14532d] text-white flex items-center justify-center hover:bg-[#003b1b] active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
