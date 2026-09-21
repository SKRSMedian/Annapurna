import { useState, useEffect } from 'react';
import { networkManager } from '../services/networkManager';
import { NetworkStatus, QueuedOfflineAction } from '../types';

export function useNetwork() {
  const [status, setStatus] = useState<NetworkStatus>(networkManager.getStatus());
  const [queue, setQueue] = useState<QueuedOfflineAction[]>(networkManager.getQueue());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubNet = networkManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    const unsubSync = networkManager.subscribeSync((newQueue) => {
      setQueue(newQueue);
    });

    return () => {
      unsubNet();
      unsubSync();
    };
  }, []);

  const toggleSimulation = (forceValue?: boolean) => {
    return networkManager.toggleSimulation(forceValue);
  };

  const queueAction = (
    type: QueuedOfflineAction['type'],
    payload: any,
    description: string
  ) => {
    return networkManager.queueAction(type, payload, description);
  };

  const flushQueue = async () => {
    setIsSyncing(true);
    try {
      const res = await networkManager.flushQueue();
      return res;
    } finally {
      setIsSyncing(false);
    }
  };

  const clearQueue = () => {
    networkManager.clearQueue();
  };

  return {
    status,
    isOnline: status.isOnline,
    isSimulated: status.isSimulated,
    toggleSimulation,
    queue,
    isSyncing,
    queueAction,
    flushQueue,
    clearQueue
  };
}
