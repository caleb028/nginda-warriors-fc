'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { PublicWebsiteSnapshot, buildPublicSnapshot } from '@nginda-warriors/shared';

interface LiveSnapshotContextValue {
  snapshot: PublicWebsiteSnapshot;
  lastUpdated: number;
  refreshNow: () => Promise<void>;
}

const LiveSnapshotContext = createContext<LiveSnapshotContextValue | null>(null);

export function useLiveSnapshot(fallback?: PublicWebsiteSnapshot): PublicWebsiteSnapshot {
  const ctx = useContext(LiveSnapshotContext);
  if (ctx && ctx.snapshot) {
    return ctx.snapshot;
  }
  if (fallback) {
    return fallback;
  }
  throw new Error('useLiveSnapshot must be used within a LiveSnapshotProvider');
}

export function LiveSnapshotProvider({
  initialSnapshot,
  children,
}: {
  initialSnapshot: PublicWebsiteSnapshot;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<PublicWebsiteSnapshot>(initialSnapshot);
  const lastUpdatedRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);

  // 1. Core Sync Function (Fetches fresh data with cache-busting query timestamp)
  const refreshNow = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const res = await fetch(`/api/sync?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const serverTs = Number(data.updatedAt) || 0;
        if (serverTs >= lastUpdatedRef.current || lastUpdatedRef.current === 0) {
          // Guard against cold/stale serverless instances returning fewer players when client already has active squad
          const serverPlayersCount = data.snapshot?.players?.length || 0;
          const currentPlayersCount = snapshot?.players?.length || 0;

          if (serverPlayersCount < currentPlayersCount && currentPlayersCount > 0) {
            // Cold server instance detected: re-seed the server instance from verified local storage
            try {
              const localDb = localStorage.getItem('nginda_live_database');
              if (localDb) {
                fetch('/api/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ database: JSON.parse(localDb) }),
                }).catch(() => null);
              }
            } catch {}
          } else if (data.snapshot) {
            lastUpdatedRef.current = serverTs || Date.now();
            setSnapshot(data.snapshot);
            if (data.database) {
              try {
                localStorage.setItem('nginda_live_database', JSON.stringify(data.database));
                localStorage.setItem('nginda_db_timestamp', String(lastUpdatedRef.current));
              } catch {}
            }
          }
        }
      }
    } catch {
      // Non-blocking network sync
    } finally {
      isSyncingRef.current = false;
    }
  }, [snapshot]);

  // 2. Initial Mount Check from localStorage (if newer than SSR or holds squad profiles)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nginda_live_database');
      const storedTs = localStorage.getItem('nginda_db_timestamp');
      if (stored) {
        const parsedDb = JSON.parse(stored);
        if (parsedDb && typeof parsedDb === 'object') {
          const freshSnap = buildPublicSnapshot(parsedDb);
          const localCount = freshSnap.players?.length || 0;
          const initialCount = initialSnapshot.players?.length || 0;

          if (localCount >= initialCount && localCount > 0) {
            setSnapshot(freshSnap);
            if (storedTs) {
              lastUpdatedRef.current = Number(storedTs);
            }
            if (initialCount === 0) {
              fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ database: parsedDb }),
              }).catch(() => null);
            }
          }
        }
      }
    } catch {}
  }, [initialSnapshot]);

  // 3. 0ms Real-Time Multi-Tab / Native Mobile App Event Listeners
  useEffect(() => {
    // A. BroadcastChannel for 0ms IPC updates
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('nginda_warriors_live_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'DATABASE_UPDATED' || event.data?.type === 'SYNC_DATABASE') {
            if (event.data?.database) {
              try {
                const freshSnap = buildPublicSnapshot(event.data.database);
                setSnapshot(freshSnap);
                lastUpdatedRef.current = Date.now();
                localStorage.setItem('nginda_live_database', JSON.stringify(event.data.database));
                localStorage.setItem('nginda_db_timestamp', String(Date.now()));
              } catch {}
            }
          }
        };
      } catch {}
    }

    // B. Storage Event Listener (fires across tabs on same origin)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nginda_live_database' && e.newValue) {
        try {
          const freshDb = JSON.parse(e.newValue);
          setSnapshot(buildPublicSnapshot(freshDb));
          lastUpdatedRef.current = Date.now();
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // C. Mobile Browser & PWA Lifecycle Listeners (pageshow, visibilitychange, focus)
    const handleAppForeground = () => {
      refreshNow();
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleAppForeground();
      }
    });
    window.addEventListener('focus', handleAppForeground);
    window.addEventListener('pageshow', handleAppForeground);

    // D. Capacitor Native Mobile App Lifecycle (when app resumes from background or lock screen)
    if (typeof window !== 'undefined') {
      try {
        import('@capacitor/app')
          .then(({ App }) => {
            App.addListener('appStateChange', (state) => {
              if (state.isActive) {
                handleAppForeground();
              }
            });
            App.addListener('appRestoredResult', () => {
              handleAppForeground();
            });
          })
          .catch(() => {});
      } catch {}
    }

    // E. High-frequency 1.5-second polling loop
    const pollInterval = setInterval(() => {
      // Only poll when window is visible or active to conserve mobile battery
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        refreshNow();
      }
    }, 1500);

    return () => {
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleAppForeground);
      window.removeEventListener('pageshow', handleAppForeground);
      clearInterval(pollInterval);
    };
  }, [refreshNow]);

  return (
    <LiveSnapshotContext.Provider
      value={{
        snapshot,
        lastUpdated: lastUpdatedRef.current,
        refreshNow,
      }}
    >
      {children}
    </LiveSnapshotContext.Provider>
  );
}
