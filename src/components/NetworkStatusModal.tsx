import React from 'react';
import { useNetwork } from '../hooks/useNetwork';

interface NetworkStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdvisor?: () => void;
  onShowToast: (title: string, sub?: string) => void;
}

export const NetworkStatusModal: React.FC<NetworkStatusModalProps> = ({
  isOpen,
  onClose,
  onOpenAdvisor,
  onShowToast
}) => {
  const { status, isOnline, toggleSimulation, queue, isSyncing, flushQueue, clearQueue } = useNetwork();

  if (!isOpen) return null;

  const handleToggle = () => {
    const isNowOffline = toggleSimulation();
    onShowToast(
      isNowOffline ? 'Switched to Offline Mode' : 'Switched to Online Mode',
      isNowOffline
        ? 'Live ordering is disabled. Local cache & Offline RAG active.'
        : 'Cloud Sync reconnected. Flushing queued offline items...'
    );
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      onShowToast('Cannot Sync while Offline', 'Please switch to Online Mode first to flush queue.');
      return;
    }
    const res = await flushQueue();
    onShowToast(
      'Background Sync Complete',
      `Successfully synced ${res.syncedCount} queued actions with central database.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#c0c9be]/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#c0c9be]/30 flex items-center justify-between bg-[#f8faf4]">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isOnline ? 'bg-[#b1f2be] text-[#003b1b]' : 'bg-[#fe932c] text-[#663500]'
            }`}>
              <span className="material-symbols-outlined text-[20px]">
                {isOnline ? 'wifi' : 'wifi_off'}
              </span>
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-base text-[#191c19]">
                Dual Mode & Network Center
              </h3>
              <p className="text-[11px] text-[#717970]">
                Real-time connection telemetry & offline sync engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#717970] hover:bg-[#e7e9e3] hover:text-[#191c19] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Active Mode Card with Switcher */}
          <div className={`p-4 rounded-xl border ${
            isOnline
              ? 'bg-[#b1f2be]/20 border-[#14532d]/30 text-[#00210d]'
              : 'bg-[#ffb95f]/20 border-[#904d00]/30 text-[#663500]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-[#14532d]' : 'bg-[#904d00]'} animate-pulse`} />
                <span className="font-['Outfit'] font-bold text-sm">
                  {isOnline ? 'Online Mode (Cloud Active)' : 'Offline Mode (Local Cache Active)'}
                </span>
              </div>
              <button
                onClick={handleToggle}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isOnline
                    ? 'bg-[#ba1a1a] text-white hover:bg-[#93000a]'
                    : 'bg-[#003b1b] text-white hover:bg-[#14532d]'
                }`}
              >
                {isOnline ? 'Simulate Offline' : 'Switch to Online'}
              </button>
            </div>

            <p className="text-[11px] mt-2 opacity-90 leading-relaxed">
              {isOnline
                ? 'Device has full connectivity. Live transactional orders, real-time UPI escrow, driver tracking telemetry, and Cloud Vector DB are active.'
                : 'Device is operating without internet. Live ordering & transport bookings are disabled. Cached Mandi prices, farming guides, and Local On-Device Vector RAG remain fully accessible.'}
            </p>
          </div>

          {/* Connection Telemetry Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#f8faf4] border border-[#c0c9be]/30">
              <span className="text-[10px] text-[#717970] block">Connection</span>
              <span className="font-bold text-xs text-[#191c19] mt-0.5 block capitalize">
                {isOnline ? status.networkType || 'Wi-Fi / 4G' : 'Disconnected'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f8faf4] border border-[#c0c9be]/30">
              <span className="text-[10px] text-[#717970] block">Downlink</span>
              <span className="font-bold text-xs text-[#191c19] mt-0.5 block">
                {isOnline ? `${status.downlinkSpeedMbps || 15} Mbps` : '0 Mbps'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f8faf4] border border-[#c0c9be]/30">
              <span className="text-[10px] text-[#717970] block">Latency RTT</span>
              <span className="font-bold text-xs text-[#191c19] mt-0.5 block">
                {isOnline ? `${status.rttMs || 35} ms` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Offline Local RAG Fallback Notice */}
          <div className="p-3.5 rounded-xl bg-[#f8faf4] border border-[#c0c9be]/40 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#003b1b] flex-shrink-0 mt-0.5">
              psychology
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#191c19] text-xs">Offline Local RAG Engine</span>
                <span className="text-[10px] bg-[#14532d]/10 text-[#14532d] font-bold px-1.5 py-0.5 rounded-sm">
                  Embedded
                </span>
              </div>
              <p className="text-[11px] text-[#717970] mt-0.5">
                Automatically routes agronomy and transport queries to on-device vector search during offline or spotty network conditions.
              </p>
              {onOpenAdvisor && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdvisor();
                  }}
                  className="mt-2 text-[11px] font-bold text-[#003b1b] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Kisaan AI Sahayak (RAG)</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>

          {/* Background Sync Queue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#191c19] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#003b1b]">sync</span>
                Offline Background Sync Queue ({queue.length})
              </span>
              {queue.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearQueue}
                    className="text-[10px] text-[#ba1a1a] hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing || !isOnline}
                    className="px-2 py-0.5 bg-[#003b1b] text-white rounded text-[10px] font-bold hover:bg-[#14532d] disabled:opacity-50 cursor-pointer"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              )}
            </div>

            {queue.length === 0 ? (
              <div className="p-3 rounded-xl bg-[#f8faf4] text-center text-[#717970] text-[11px] border border-[#c0c9be]/30">
                ✅ No pending actions. All offline drafts & interactions are fully synchronized.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg border border-[#c0c9be]/40 bg-white flex items-center justify-between text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-[#191c19]">{item.description}</span>
                      <span className="text-[10px] text-[#717970]">
                        Queued at {item.timestamp} • Type: {item.type}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                      item.status === 'syncing'
                        ? 'bg-[#ffb95f]/30 text-[#904d00] animate-pulse'
                        : 'bg-[#edeee9] text-[#717970]'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f8faf4] border-t border-[#c0c9be]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#003b1b] hover:bg-[#14532d] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
