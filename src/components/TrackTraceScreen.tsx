import React, { useState, useEffect } from 'react';
import { ASSETS, INITIAL_ORDERS } from '../data/mockData';
import { DirectOrder, Language } from '../types';

interface TrackTraceScreenProps {
  language: Language;
  onShowToast: (title: string, sub?: string) => void;
  orders?: DirectOrder[];
  activeOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  time: string;
}

export const TrackTraceScreen: React.FC<TrackTraceScreenProps> = ({
  language,
  onShowToast,
  orders: propOrders,
  activeOrderId,
  onSelectOrder
}) => {
  const isHindi = language === 'hi';
  const orders = propOrders && propOrders.length > 0 ? propOrders : INITIAL_ORDERS;

  // Selected Order
  const [selectedId, setSelectedId] = useState<string>(
    activeOrderId || (orders.length > 0 ? orders[0].id : 'AP-9042')
  );

  useEffect(() => {
    if (activeOrderId) {
      setSelectedId(activeOrderId);
    }
  }, [activeOrderId]);

  const currentOrder =
    orders.find((o) => o.id === selectedId) || orders[0] || INITIAL_ORDERS[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live simulation & vehicle tracking state
  // routeProgress: 0% to 100%
  const [routeProgress, setRouteProgress] = useState(58);
  const [isSimulating, setIsSimulating] = useState(true);
  const [telemetryDistanceKm, setTelemetryDistanceKm] = useState(16);
  const [currentSpeedKmH, setCurrentSpeedKmH] = useState(48);
  const [chamberTempC, setChamberTempC] = useState(14.2);

  // Call Driver Modal State
  const [isCallingDriver, setIsCallingDriver] = useState(false);

  // Chat with Driver Modal State
  const [isChattingWithDriver, setIsChattingWithDriver] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Namaste ji! I have verified the harvest crates at the farm gate and loaded them in the temperature-controlled vehicle.',
      time: '11:45 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Are the tomatoes kept at cool temperature?',
      time: '11:50 AM'
    },
    {
      id: 'm3',
      sender: 'driver',
      text: 'Yes ji, vehicle cold chamber is constantly at 14.2°C. Highway transit on NH-60 is smooth.',
      time: '11:52 AM'
    }
  ]);

  // Live vehicle movement simulation tick
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setRouteProgress((prev) => {
        if (prev >= 92) return 92; // Cap near doorstep before manual deliver
        const nextProgress = prev + 0.5;
        // Decrease distance remaining in proportion
        const remainingKm = Math.max(2, Math.round(38 * (1 - nextProgress / 100)));
        setTelemetryDistanceKm(remainingKm);
        return nextProgress;
      });

      // Fluctuate speed realistically
      setCurrentSpeedKmH((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(58, Math.max(42, prev + delta));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      onShowToast(
        isHindi ? 'गुरप्रीत जी का वॉइस संदेश चल रहा है' : 'Playing Harvest Voice Note',
        '"Sat Sri Akal ji, sabji bilkul tazi savere 6 baje todi hai..."'
      );
    }
  };

  const handleGpsPing = () => {
    const updated = Math.max(3, telemetryDistanceKm - 1);
    setTelemetryDistanceKm(updated);
    setRouteProgress((prev) => Math.min(92, prev + 2));
    onShowToast(
      'Live GPS Refreshed',
      `Satellite telemetry locked. Vehicle is ${updated} km away (NH-60 Pune Bypass)`
    );
  };

  const handleShareLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    onShowToast(
      'Traceability Passport Copied',
      `Batch #${currentOrder.id} tamper-proof verification seal link copied`
    );
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSelectOrderTab = (id: string) => {
    setSelectedId(id);
    if (onSelectOrder) onSelectOrder(id);
  };

  const handleSendChatMessage = (customText?: string) => {
    const text = customText || chatInputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInputText('');

    // Driver auto-reply simulation
    setTimeout(() => {
      const replies = [
        'Noted! I will ring the bell as instructed upon arrival.',
        'Produce crates are intact and refrigerated. Approaching your sector shortly.',
        'Zero mandi stops on this direct farm route! Will arrive right on schedule.'
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'driver',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
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

  const getVehicleTitle = () => {
    if (currentOrder.vehicleDetails?.name) return currentOrder.vehicleDetails.name;
    switch (currentOrder.transportVehicle) {
      case '2-wheeler':
        return '2-Wheeler Express Courier';
      case '3-wheeler':
        return 'Cargo Auto 3-Wheeler';
      case 'truck':
        return 'Heavy Commercial Insulated Truck';
      case 'tempo':
      default:
        return 'Tata Ace EV Refrigerated Van';
    }
  };

  // Helper coordinates along SVG path
  // Start (Farm Gate): x=40, y=140
  // Mid 1: x=140, y=70
  // Mid 2: x=240, y=130
  // Mid 3: x=340, y=60
  // End (Baner Home): x=420, y=110
  const getVehicleCoordinates = (pct: number) => {
    const t = Math.max(0, Math.min(100, pct)) / 100;
    // Cubic bezier interpolation approximation
    const p0 = { x: 45, y: 130 };
    const p1 = { x: 160, y: 35 };
    const p2 = { x: 260, y: 165 };
    const p3 = { x: 415, y: 70 };

    const cx = 3 * (p1.x - p0.x);
    const bx = 3 * (p2.x - p1.x) - cx;
    const ax = p3.x - p0.x - cx - bx;

    const cy = 3 * (p1.y - p0.y);
    const by = 3 * (p2.y - p1.y) - cy;
    const ay = p3.y - p0.y - cy - by;

    const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
    const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;

    return { x, y };
  };

  const vehiclePos = getVehicleCoordinates(routeProgress);

  // Summarize items for top title
  const orderTitle = currentOrder.items
    .map((it) => `${it.quantity} ${it.unit} ${it.name}`)
    .join(' + ');

  return (
    <div className="w-full max-w-lg mx-auto pb-32 pt-2 flex flex-col gap-4">
      {/* Multi-Order Switcher Bar (if user has multiple active orders) */}
      {orders.length > 1 && (
        <div className="px-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#edeee9] rounded-xl overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-[#717970] px-2 whitespace-nowrap">
              Orders:
            </span>
            {orders.map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => handleSelectOrderTab(ord.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedId === ord.id
                    ? 'bg-white text-[#14532d] shadow-xs'
                    : 'text-[#404941] hover:text-[#191c19]'
                }`}
              >
                #{ord.id} • {ord.status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Ambient Banner with Live ETA */}
      <div className="px-4">
        <div className="bg-[#f3f4ef] border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1 bg-[#14532d] text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>#{currentOrder.id}</span>
            </div>
            <div className="flex items-center gap-1 text-[#904d00] text-xs font-bold bg-[#ffdcc3] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>Direct Farm-to-Doorstep</span>
            </div>
          </div>

          <h1 className="font-['Outfit'] font-bold text-lg sm:text-xl text-[#191c19] mb-1 line-clamp-2">
            {orderTitle || 'Fresh Harvest Produce Basket'}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[#404941] text-xs mt-2">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>Placed {currentOrder.placedAt || '07:30 AM'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#003b1b] font-bold">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>
                ETA {currentOrder.eta || 'Today 05:30 PM'} ({telemetryDistanceKm} km left)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ Interactive Live Route Tracking & Vehicle Movement Canvas */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/40 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Map Header & Controls */}
          <div className="p-3 bg-[#f8faf4] border-b border-[#c0c9be]/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#14532d] animate-ping"></div>
              <span className="text-xs font-bold text-[#191c19] truncate">
                Live GPS Transit Map (NH-60 Corridor)
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                className={`h-7 px-2 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                  isSimulating
                    ? 'bg-[#14532d] text-white border-[#14532d]'
                    : 'bg-white text-[#404941] border-[#c0c9be]/60'
                }`}
                title={isSimulating ? 'Pause Movement Simulation' : 'Resume Movement Simulation'}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isSimulating ? 'pause' : 'play_arrow'}
                </span>
                <span>{isSimulating ? 'Live Sim' : 'Paused'}</span>
              </button>

              <button
                type="button"
                onClick={handleGpsPing}
                className="h-7 px-2 rounded-lg bg-[#edeee9] text-[#191c19] text-[11px] font-bold flex items-center gap-1 hover:bg-[#e7e9e3] active:scale-95 cursor-pointer"
                title="Ping GPS Satellites"
              >
                <span className="material-symbols-outlined text-[14px]">near_me</span>
                <span>Ping</span>
              </button>
            </div>
          </div>

          {/* Map Graphic Stage (Interactive SVG Canvas) */}
          <div className="relative w-full h-56 bg-[#eef1eb] overflow-hidden select-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 460 200"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background Grid Lines representing terrain grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#dbe1d6"
                    strokeWidth="0.6"
                    strokeDasharray="2,2"
                  />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14532d" />
                  <stop offset="60%" stopColor="#fe932c" />
                  <stop offset="100%" stopColor="#003b1b" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="#f2f5ef" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Natural Topographic Features / River Belt */}
              <path
                d="M 0 170 Q 150 180 280 140 T 460 170"
                fill="none"
                stroke="#cce5e8"
                strokeWidth="14"
                opacity="0.6"
              />
              <text x="170" y="185" fill="#759da3" fontSize="8" fontWeight="600">
                Indrayani River Basin (Direct Rural Corridor)
              </text>

              {/* Secondary Local Roads */}
              <path
                d="M 20 40 Q 120 70 200 40 T 400 30"
                fill="none"
                stroke="#e2e6dd"
                strokeWidth="3"
              />
              <path
                d="M 260 0 L 260 200"
                fill="none"
                stroke="#e2e6dd"
                strokeWidth="2"
                strokeDasharray="4,4"
              />

              {/* Primary Dedicated Highway Route (NH-60) */}
              {/* Outer Casing */}
              <path
                d="M 45 130 C 160 35, 260 165, 415 70"
                fill="none"
                stroke="#ffffff"
                strokeWidth="10"
                strokeLinecap="round"
                filter="url(#shadow)"
              />
              {/* Colored Highway Track */}
              <path
                d="M 45 130 C 160 35, 260 165, 415 70"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Road Center Dotted Striping */}
              <path
                d="M 45 130 C 160 35, 260 165, 415 70"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                strokeLinecap="round"
              />

              {/* Waypoint 1: Origin Farm Gate (Khed Plot #14) */}
              <g transform="translate(45, 130)">
                <circle r="14" fill="#14532d" opacity="0.2" />
                <circle r="9" fill="#14532d" />
                <circle r="4" fill="#ffffff" />
                <text x="-35" y="24" fill="#191c19" fontSize="9" fontWeight="bold">
                  🌾 Khed Farm Gate
                </text>
                <text x="-35" y="34" fill="#717970" fontSize="7">
                  Plucked 06:15 AM
                </text>
              </g>

              {/* Waypoint 2: Intermediate Checkpoint (Chakan Bypass) */}
              <g transform="translate(230, 115)">
                <circle r="4" fill="#904d00" />
                <text x="-25" y="-10" fill="#904d00" fontSize="8" fontWeight="bold">
                  ⚡ Chakan Hub (Bypassed)
                </text>
              </g>

              {/* Waypoint 3: Destination (Consumer Doorstep, Baner) */}
              <g transform="translate(415, 70)">
                <circle r="15" fill="#003b1b" opacity="0.2" />
                <circle r="10" fill="#003b1b" />
                <circle r="4" fill="#ffffff" />
                <text x="-50" y="-18" fill="#191c19" fontSize="9" fontWeight="bold">
                  🏡 Your Doorstep
                </text>
                <text x="-50" y="-8" fill="#717970" fontSize="7">
                  Baner, Pune
                </text>
              </g>

              {/* 🚚 Moving Vehicle Icon on Highway */}
              <g
                transform={`translate(${vehiclePos.x}, ${vehiclePos.y})`}
                filter="url(#shadow)"
                className="transition-transform duration-700 ease-out"
              >
                {/* Radar beacon pulsing circle */}
                <circle r="18" fill="#fe932c" opacity="0.3" className="animate-ping" />
                <circle r="14" fill="#fe932c" stroke="#ffffff" strokeWidth="2" />
                {/* Text icon placeholder inside marker */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  ⚡
                </text>

                {/* Floating Tooltip above vehicle */}
                <g transform="translate(0, -22)">
                  <rect
                    x="-42"
                    y="-14"
                    width="84"
                    height="16"
                    rx="4"
                    fill="#191c19"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                  >
                    {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'} • {currentSpeedKmH}km/h
                  </text>
                </g>
              </g>
            </svg>

            {/* Floating Live Telemetry HUD Strip */}
            <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-[#c0c9be]/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#fe932c] text-[#663500] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    {getVehicleIcon(currentOrder.transportVehicle || currentOrder.vehicleDetails?.type)}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#191c19] truncate">
                      {currentOrder.driver?.name || 'Sunil Pawar'}
                    </span>
                    <span className="font-mono text-[10px] bg-[#edeee9] text-[#191c19] font-bold px-1 rounded">
                      {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#717970] truncate">
                    {telemetryDistanceKm} km to delivery • NH-60 Pune Bypass
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <span className="block text-xs font-bold text-[#14532d]">
                    ❄️ {chamberTempC}°C
                  </span>
                  <span className="block text-[10px] font-semibold text-[#904d00]">
                    ⚡ {currentSpeedKmH} km/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚚 Assigned Vehicle & Driver Details Capsule with Direct Call/Chat */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/40 rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c0c9be]/30 pb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#14532d] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">
                  {getVehicleIcon(currentOrder.transportVehicle || currentOrder.vehicleDetails?.type)}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-['Outfit'] font-bold text-sm text-[#191c19] truncate">
                    {getVehicleTitle()}
                  </span>
                  {currentOrder.vehicleDetails?.temperatureControlled && (
                    <span className="bg-[#b1f2be]/60 text-[#003b1b] text-[10px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                      ❄️ Active Cold-Chain
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#717970] truncate">
                  Zero Mandi Middlemen • Direct Farm Custody
                </span>
              </div>
            </div>

            {/* Registration Number Plate */}
            <div className="flex items-center bg-white border border-[#191c19] rounded px-2 py-0.5 shadow-2xs flex-shrink-0">
              <div className="flex flex-col items-center mr-1 pr-1 border-r border-[#191c19]/30 text-[7px] font-black text-[#002244]">
                <span>IND</span>
              </div>
              <span className="font-mono font-bold text-xs text-[#191c19] tracking-wider">
                {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
              </span>
            </div>
          </div>

          {/* Driver Profile & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={currentOrder.driver?.photo || ASSETS.balwantSingh}
                  alt={currentOrder.driver?.name || 'Assigned Driver'}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#14532d]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#14532d] rounded-full border-2 border-white"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-[#191c19] truncate">
                    {currentOrder.driver?.name || 'Sunil Pawar'}
                  </span>
                  <span className="text-[10px] bg-[#ffdcc3] text-[#663500] font-bold px-1.5 py-0.2 rounded">
                    ★ {currentOrder.driver?.rating || 4.9}
                  </span>
                </div>
                <span className="text-xs text-[#717970] truncate">
                  {currentOrder.driver?.tripsCount || 428} direct farm trips • Certified Driver
                </span>
              </div>
            </div>

            {/* Action Buttons: Direct Call & Direct Chat */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 w-full sm:w-auto flex-shrink-0 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => setIsCallingDriver(true)}
                className="min-h-[44px] px-3.5 rounded-xl bg-[#14532d] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#003b1b] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">call</span>
                <span>Call Driver</span>
              </button>
              <button
                type="button"
                onClick={() => setIsChattingWithDriver(true)}
                className="min-h-[44px] px-3.5 rounded-xl bg-white border border-[#14532d]/40 text-[#14532d] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#f3f4ef] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Clear 5 Milestones Alongside Estimated Time of Arrival (ETA) */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Outfit'] font-bold text-lg text-[#191c19]">
                Live Logistics Milestones
              </h2>
              <p className="text-xs text-[#717970]">Real-time cold-chain & harvest custody status</p>
            </div>
            <div className="text-right">
              <span className="bg-[#b1f2be]/60 text-[#003b1b] text-xs font-bold px-2.5 py-1 rounded-full">
                3 / 5 In Progress
              </span>
              <span className="block text-[10px] text-[#717970] mt-0.5">
                ETA: {currentOrder.eta || 'Today 05:30 PM'}
              </span>
            </div>
          </div>

          <div className="relative pl-7 flex flex-col gap-4">
            {/* Vertical Rail */}
            <div className="absolute left-3 top-3 bottom-5 w-0.5 bg-[#e7e9e3] pointer-events-none"></div>

            {/* Milestone 1: Driver Assigned */}
            <div className="relative">
              <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#14532d] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="bg-[#f3f4ef] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-[#191c19]">
                    1. Driver Assigned
                  </span>
                  <span className="text-xs text-[#14532d] font-semibold flex-shrink-0">05:45 AM</span>
                </div>
                <p className="text-xs text-[#404941] leading-relaxed">
                  Driver {currentOrder.driver?.name || 'Sunil Pawar'} assigned with verified vehicle{' '}
                  <span className="font-mono font-bold text-[#14532d]">
                    {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
                  </span>
                  . Vehicle sanitization and pre-cooling completed.
                </p>
              </div>
            </div>

            {/* Milestone 2: Picked up from Farm */}
            <div className="relative">
              <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#14532d] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="bg-[#f3f4ef] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-[#191c19]">
                    2. Picked up from Farm
                  </span>
                  <span className="text-xs text-[#14532d] font-semibold flex-shrink-0">06:30 AM</span>
                </div>
                <p className="text-xs text-[#404941] mb-2 leading-relaxed">
                  Freshly plucked by Farmer Gurpreet Singh at morning dew. Weighed on certified digital scale at farm gate. Batch lot #{currentOrder.id}-A.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] bg-[#e7e9e3] text-[#191c19] px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    Plot #14, Khed Farm
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] bg-[#e7e9e3] text-[#191c19] px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-[12px]">verified</span>
                    Agmark Grade A Certified
                  </span>
                </div>
              </div>
            </div>

            {/* Milestone 3: In Transit */}
            <div className="relative">
              <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#fe932c] text-[#663500] flex items-center justify-center ring-4 ring-[#ffdcc3] animate-pulse shadow-sm">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              </div>
              <div className="bg-[#f3f4ef] rounded-xl p-3 border-l-3 border-[#fe932c]">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#191c19]">
                      3. In Transit
                    </span>
                    <span className="bg-[#ffdcc3] text-[#2f1500] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#904d00] flex-shrink-0">11:45 AM</span>
                </div>
                <p className="text-xs text-[#404941] mb-2 leading-relaxed">
                  Direct transit on NH-60 highway, bypassing intermediate mandi auctions and warehousing delays. Cold chamber actively locked.
                </p>
                <div className="p-2.5 bg-white rounded-lg flex items-center justify-between border border-[#c0c9be]/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#14532d] text-[18px]">thermostat</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#717970]">Cold Chamber</span>
                      <span className="text-xs font-bold text-[#191c19]">{chamberTempC}°C (Optimal)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#904d00] text-[18px]">speed</span>
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-[#717970]">Transit Speed</span>
                      <span className="text-xs font-bold text-[#191c19]">{currentSpeedKmH} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone 4: Out for Delivery */}
            <div className="relative opacity-80">
              <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#edeee9] text-[#717970] flex items-center justify-center border border-[#c0c9be]/50">
                <span className="material-symbols-outlined text-[14px]">near_me</span>
              </div>
              <div className="bg-[#f3f4ef] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-[#191c19]">
                    4. Out for Delivery
                  </span>
                  <span className="text-xs text-[#717970] flex-shrink-0">Est. 04:45 PM</span>
                </div>
                <p className="text-xs text-[#404941] leading-relaxed">
                  Vehicle arriving in Baner residential zone. Driver will ring your gate contact number before unloading.
                </p>
              </div>
            </div>

            {/* Milestone 5: Delivered */}
            <div className="relative opacity-70">
              <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-[#edeee9] text-[#717970] flex items-center justify-center border border-[#c0c9be]/50">
                <span className="material-symbols-outlined text-[14px]">home</span>
              </div>
              <div className="bg-[#f3f4ef] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs sm:text-sm text-[#191c19]">
                    5. Delivered to Doorstep
                  </span>
                  <span className="text-xs text-[#717970] flex-shrink-0">Est. 05:30 PM</span>
                </div>
                <p className="text-xs text-[#404941] leading-relaxed">
                  Zero intermediary tampering seal verified. Fresh farm-gate quality guaranteed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Voice & Origin Capsule */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-[#b1f2be] flex-shrink-0"
              alt="Farmer Gurpreet Singh"
              src={ASSETS.gurpreetWarmPortrait}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#191c19] truncate">Gurpreet Singh</span>
                <span
                  className="material-symbols-outlined text-[18px] text-[#14532d]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <span className="text-xs text-[#404941] truncate">
                Field Plot #14, Khed Block, Pune District
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 bg-[#edeee9] px-2 py-0.5 rounded-full text-[11px] font-semibold text-[#191c19]">
                  <span className="material-symbols-outlined text-[13px] text-[#fe932c]">eco</span>
                  ZBNF Natural Certified
                </span>
              </div>
            </div>
          </div>

          {/* Audio Note Play Button */}
          <div className="bg-[#f3f4ef] rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Play Farmer Audio Note"
                onClick={toggleAudio}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform cursor-pointer ${
                  isPlayingAudio ? 'bg-[#fe932c] text-[#663500]' : 'bg-[#003b1b] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlayingAudio ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#191c19]">Gurpreet's Harvest Memo</span>
                <span className="text-[11px] text-[#404941]">
                  {isPlayingAudio ? 'Playing voice note (0:12)...' : '0:24 • Punjabi / Hindi voice note'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`w-1 bg-[#14532d] rounded-full transition-all ${
                  isPlayingAudio ? 'h-5 animate-pulse' : 'h-3'
                }`}
              ></div>
              <div
                className={`w-1 bg-[#14532d] rounded-full transition-all ${
                  isPlayingAudio ? 'h-7 animate-pulse' : 'h-5'
                }`}
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className={`w-1 bg-[#14532d] rounded-full transition-all ${
                  isPlayingAudio ? 'h-4 animate-pulse' : 'h-2'
                }`}
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Middlemen Elimination Card: Transparent 100% Cost Flow */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-['Outfit'] font-bold text-base text-[#191c19]">
              Complete Cost Flow Transparency
            </span>
            <span className="material-symbols-outlined text-[#14532d] text-[24px]">savings</span>
          </div>
          <p className="text-xs text-[#404941]">
            Direct farm-to-consumer model eliminates wholesale cartel commissions completely.
          </p>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#edeee9] my-1">
            <div className="bg-[#14532d] h-full" style={{ width: '84%' }} title="Farmer Share (84%)"></div>
            <div className="bg-[#fe932c] h-full" style={{ width: '11%' }} title="Direct Transit (11%)"></div>
            <div className="bg-[#ffb95f] h-full" style={{ width: '5%' }} title="Testing & Tech (5%)"></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-[#f3f4ef] rounded-lg p-2">
              <span className="block text-[10px] text-[#717970]">Farmer Direct</span>
              <span className="font-bold text-[#14532d]">₹{currentOrder.farmerShare.toFixed(2)} (84%)</span>
            </div>
            <div className="bg-[#f3f4ef] rounded-lg p-2">
              <span className="block text-[10px] text-[#717970]">EV Logistics</span>
              <span className="font-bold text-[#191c19]">₹{currentOrder.transitFee.toFixed(2)}</span>
            </div>
            <div className="bg-[#b1f2be]/40 rounded-lg p-2">
              <span className="block text-[10px] text-[#14532d]">Mandi Cut</span>
              <span className="font-bold text-[#14532d]">₹0 (0%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Traceability & Digital Passport */}
      <div className="px-4">
        <div className="bg-white border border-[#c0c9be]/30 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col xs:flex-row items-center gap-4">
            <div className="relative p-3 bg-white rounded-xl shadow-xs border border-[#c0c9be]/30 flex-shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 text-[#003b1b]" fill="currentColor" viewBox="0 0 100 100">
                <rect fill="currentColor" fillOpacity="0.1" height="26" rx="4" width="26" x="5" y="5"></rect>
                <rect fill="none" height="22" rx="2" stroke="currentColor" strokeWidth="4" width="22" x="7" y="7"></rect>
                <rect fill="currentColor" height="10" rx="1" width="10" x="13" y="13"></rect>
                <rect fill="currentColor" fillOpacity="0.1" height="26" rx="4" width="26" x="69" y="5"></rect>
                <rect fill="none" height="22" rx="2" stroke="currentColor" strokeWidth="4" width="22" x="71" y="7"></rect>
                <rect fill="currentColor" height="10" rx="1" width="10" x="77" y="13"></rect>
                <rect fill="currentColor" fillOpacity="0.1" height="26" rx="4" width="26" x="5" y="69"></rect>
                <rect fill="none" height="22" rx="2" stroke="currentColor" strokeWidth="4" width="22" x="7" y="71"></rect>
                <rect fill="currentColor" height="10" rx="1" width="10" x="13" y="77"></rect>
                <rect height="5" rx="1" width="5" x="36" y="8"></rect>
                <rect height="5" rx="1" width="5" x="46" y="8"></rect>
                <rect height="5" rx="1" width="5" x="56" y="8"></rect>
                <rect height="5" rx="1" width="5" x="36" y="18"></rect>
                <rect height="5" rx="1" width="5" x="50" y="24"></rect>
                <rect height="5" rx="1" width="5" x="8" y="36"></rect>
                <rect height="5" rx="1" width="5" x="18" y="44"></rect>
                <rect fill="#fe932c" height="7" rx="1.5" width="7" x="36" y="36"></rect>
                <rect height="5" rx="1" width="5" x="48" y="36"></rect>
                <rect height="5" rx="1" width="5" x="58" y="36"></rect>
                <rect height="5" rx="1" width="5" x="70" y="36"></rect>
                <rect fill="#14532d" height="7" rx="1.5" width="7" x="46" y="52"></rect>
                <rect height="5" rx="1" width="5" x="58" y="46"></rect>
                <rect height="5" rx="1" width="5" x="70" y="48"></rect>
              </svg>
            </div>
            <div className="flex flex-col text-center xs:text-left min-w-0">
              <div className="inline-flex items-center justify-center xs:justify-start gap-1 text-[#14532d] text-xs font-bold mb-1">
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>Batch Passport #{currentOrder.id}</span>
              </div>
              <span className="font-['Outfit'] font-bold text-base text-[#191c19] mb-1">
                Harvest Agmark Digital Passport
              </span>
              <p className="text-xs text-[#404941] mb-2">
                Scan or share this cryptographic batch record to verify pesticide residue tests and morning drone inspection.
              </p>
              <button
                type="button"
                onClick={handleShareLink}
                className="h-9 px-3 rounded-lg bg-[#edeee9] text-[#191c19] text-xs font-bold flex items-center justify-center gap-1.5 self-stretch xs:self-start hover:bg-[#e7e9e3] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>{copiedLink ? 'Copied to Clipboard!' : 'Share Verification Seal'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📞 Call Driver Modal */}
      {isCallingDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#717970] uppercase tracking-wider">
                Direct Driver Contact
              </span>
              <button
                type="button"
                onClick={() => setIsCallingDriver(false)}
                className="w-7 h-7 rounded-full bg-[#edeee9] flex items-center justify-center text-[#191c19] hover:bg-[#e7e9e3] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8faf4] rounded-xl border border-[#c0c9be]/40">
              <img
                src={currentOrder.driver?.photo || ASSETS.balwantSingh}
                alt={currentOrder.driver?.name || 'Driver'}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#14532d]"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-['Outfit'] font-bold text-base text-[#191c19]">
                  {currentOrder.driver?.name || 'Sunil Pawar'}
                </span>
                <span className="text-xs text-[#404941]">{getVehicleTitle()}</span>
                <span className="font-mono text-xs text-[#14532d] font-bold">
                  {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
                </span>
              </div>
            </div>

            <div className="bg-[#edeee9] rounded-xl p-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#717970]">Driver Direct Phone</span>
                <span className="text-sm font-mono font-bold text-[#191c19]">
                  {currentOrder.driver?.phone || '+91 98234 77120'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    currentOrder.driver?.phone || '+91 98234 77120'
                  );
                  onShowToast('Phone Copied', 'Driver mobile number copied');
                }}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#c0c9be]/50 text-xs font-bold text-[#191c19] flex items-center gap-1 hover:bg-[#f3f4ef] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">content_copy</span>
                <span>Copy</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCallingDriver(false)}
                className="h-10 rounded-xl bg-[#edeee9] text-[#191c19] text-xs font-bold hover:bg-[#e7e9e3] cursor-pointer"
              >
                Dismiss
              </button>
              <a
                href={`tel:${currentOrder.driver?.phone || '+919823477120'}`}
                onClick={() => {
                  onShowToast('Calling...', `Connecting to ${currentOrder.driver?.name || 'Driver'}`);
                  setIsCallingDriver(false);
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
      {isChattingWithDriver && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] h-[540px] overflow-hidden">
            <div className="p-3.5 bg-[#14532d] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={currentOrder.driver?.photo || ASSETS.balwantSingh}
                    alt={currentOrder.driver?.name || 'Driver'}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#b1f2be] rounded-full border border-white"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Outfit'] font-bold text-sm text-white truncate">
                      {currentOrder.driver?.name || 'Sunil Pawar'}
                    </span>
                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono">
                      {currentOrder.driver?.vehiclePlateNumber || 'MH-14-EA-9912'}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/80 truncate">
                    {getVehicleTitle()} • {telemetryDistanceKm} km away
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChattingWithDriver(false)}
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
                'Keep produce in cool shade'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChatMessage(chip)}
                  className="px-2.5 py-1 rounded-full bg-white text-[11px] font-semibold text-[#191c19] border border-[#c0c9be]/40 hover:bg-[#14532d] hover:text-white transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5 bg-[#f8faf4]">
              {chatMessages.map((msg) => (
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

            {/* Message Input */}
            <div className="p-2.5 bg-white border-t border-[#c0c9be]/30 flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendChatMessage();
                }}
                placeholder={`Message ${currentOrder.driver?.name || 'Driver'}...`}
                className="flex-1 h-10 px-3 rounded-xl bg-[#f3f4ef] text-xs text-[#191c19] border border-transparent focus:border-[#14532d] focus:bg-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage()}
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
