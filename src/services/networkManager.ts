import { NetworkStatus, QueuedOfflineAction } from '../types';

const SYNC_QUEUE_KEY = 'annapurna_offline_sync_queue';
const FORCED_OFFLINE_KEY = 'annapurna_simulated_offline';

type NetworkListener = (status: NetworkStatus) => void;
type SyncQueueListener = (queue: QueuedOfflineAction[]) => void;

class NetworkManager {
  private listeners: Set<NetworkListener> = new Set();
  private syncListeners: Set<SyncQueueListener> = new Set();
  private isForcedOffline: boolean = false;
  private currentStatus: NetworkStatus;

  constructor() {
    // Restore any simulated offline mode from localStorage
    try {
      this.isForcedOffline = localStorage.getItem(FORCED_OFFLINE_KEY) === 'true';
    } catch {
      this.isForcedOffline = false;
    }

    this.currentStatus = this.computeStatus();

    // Listen to browser network changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);

      const navConn = this.getNetworkConnection();
      if (navConn && typeof navConn.addEventListener === 'function') {
        navConn.addEventListener('change', this.handleConnectionChange);
      }
    }
  }

  private getNetworkConnection(): any {
    if (typeof navigator === 'undefined') return null;
    return (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  }

  private computeStatus(): NetworkStatus {
    const navConn = this.getNetworkConnection();
    const rawOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const isOnline = !this.isForcedOffline && rawOnline;

    return {
      isOnline,
      effectiveType: navConn?.effectiveType || (isOnline ? '4g' : 'offline'),
      networkType: navConn?.type || (isOnline ? 'wifi' : 'none'),
      downlinkSpeedMbps: navConn?.downlink || (isOnline ? 15.4 : 0),
      rttMs: navConn?.rtt || (isOnline ? 42 : 0),
      isSimulated: this.isForcedOffline,
      lastChecked: new Date()
    };
  }

  private notify() {
    this.currentStatus = this.computeStatus();
    this.listeners.forEach((listener) => listener(this.currentStatus));
  }

  private handleOnline = () => {
    this.notify();
    if (!this.isForcedOffline) {
      this.flushQueue();
    }
  };

  private handleOffline = () => {
    this.notify();
  };

  private handleConnectionChange = () => {
    this.notify();
  };

  // Public Methods
  public getStatus(): NetworkStatus {
    return this.currentStatus;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    listener(this.currentStatus);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeSync(listener: SyncQueueListener): () => void {
    this.syncListeners.add(listener);
    listener(this.getQueue());
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  public toggleSimulation(forceValue?: boolean): boolean {
    if (forceValue !== undefined) {
      this.isForcedOffline = forceValue;
    } else {
      this.isForcedOffline = !this.isForcedOffline;
    }

    try {
      localStorage.setItem(FORCED_OFFLINE_KEY, String(this.isForcedOffline));
    } catch {
      // Ignore
    }

    const wasOffline = !this.currentStatus.isOnline;
    this.notify();
    const nowOnline = this.currentStatus.isOnline;

    // If we just reconnected back to Online, automatically flush the sync queue
    if (wasOffline && nowOnline) {
      this.flushQueue();
    }

    return this.isForcedOffline;
  }

  // Sync Queue Management
  public getQueue(): QueuedOfflineAction[] {
    try {
      const data = localStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public queueAction(
    type: QueuedOfflineAction['type'],
    payload: any,
    description: string
  ): QueuedOfflineAction {
    const queue = this.getQueue();
    const newAction: QueuedOfflineAction = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      type,
      payload,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      description
    };

    queue.unshift(newAction);
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch {
      // Ignore
    }

    this.notifySync(queue);
    return newAction;
  }

  public clearQueue(): void {
    try {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } catch {
      // Ignore
    }
    this.notifySync([]);
  }

  public async flushQueue(): Promise<{ syncedCount: number; actions: QueuedOfflineAction[] }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { syncedCount: 0, actions: [] };

    // Update status to syncing
    const updated = queue.map((item) => ({ ...item, status: 'syncing' as const }));
    this.notifySync(updated);

    // Simulate background worker network sync delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mark items as synced
    const synced = queue.map((item) => ({ ...item, status: 'synced' as const }));
    
    // Clear out synced items from queue after slight delay so user can see notification
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
    } catch {
      // Ignore
    }

    this.notifySync([]);
    return { syncedCount: synced.length, actions: synced };
  }

  private notifySync(queue: QueuedOfflineAction[]) {
    this.syncListeners.forEach((listener) => listener(queue));
  }
}

export const networkManager = new NetworkManager();
