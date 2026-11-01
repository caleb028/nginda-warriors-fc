'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function LiveSyncListener() {
  const router = useRouter();
  const lastTimestampRef = useRef<number>(Date.now());
  const initialMountRef = useRef<boolean>(true);

  useEffect(() => {
    // 1. Instant multi-tab BroadcastChannel listener (0ms reaction when admin changes anything)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('nginda_warriors_live_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'DATABASE_UPDATED' || event.data?.type === 'SYNC_DATABASE') {
            router.refresh();
          }
        };
      } catch {}
    }

    // 2. Storage event listener (across browser tabs on the same domain)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nginda_live_database' || e.key === 'nginda_db_timestamp') {
        router.refresh();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Focus / Visibility change (refresh when switching from admin tab to website)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        router.refresh();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // 4. Background polling every 3 seconds to catch live updates from any admin device
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/sync', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.updatedAt && data.updatedAt !== lastTimestampRef.current) {
            lastTimestampRef.current = data.updatedAt;
            router.refresh();
          }
        }
      } catch {}
    }, 3000);

    // 5. Initial mount check: if coming with localStorage newer than server snapshot
    if (initialMountRef.current && typeof window !== 'undefined') {
      initialMountRef.current = false;
      const storedTs = localStorage.getItem('nginda_db_timestamp');
      if (storedTs && Number(storedTs) > Date.now() - 60000) {
        router.refresh();
      }
    }

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      clearInterval(pollInterval);
    };
  }, [router]);

  return null;
}
