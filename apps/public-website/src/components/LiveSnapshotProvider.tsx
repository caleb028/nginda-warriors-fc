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

const HYPOTHETICAL_PLAYER_IDS = new Set([
  'player-collins-kariuki-1',
  'player-kelvin-njoroge-4',
  'player-brian-mwangi-7',
  'player-dennis-kamau-11',
]);

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
        const incomingPlayers = data.snapshot?.players || data.database?.players || [];
        const currentPlayers = snapshot?.players || [];

        // Guard: Never let a cold server container with 0 players wipe a non-empty client roster
        if (incomingPlayers.length === 0 && currentPlayers.length > 0) {
          try {
            const stored = localStorage.getItem('nginda_live_database');
            if (stored) {
              fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ database: JSON.parse(stored) }),
              }).catch(() => null);
            }
          } catch {}
          return;
        }

        // Merge incoming and current players by ID to avoid dropping any sequentially uploaded player
        const deletedSet = new Set([
          ...(data.database?.deletedPlayerIds || []),
          ...(data.snapshot?.deletedPlayerIds || []),
        ]);
        const playerMap = new Map<string, any>();
        for (const p of currentPlayers) {
          if (p && p.id && !deletedSet.has(p.id) && !HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
            playerMap.set(p.id, p);
          }
        }
        for (const p of incomingPlayers) {
          if (p && p.id && !deletedSet.has(p.id) && !HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
            playerMap.set(p.id, p);
          }
        }
        const mergedPlayers = Array.from(playerMap.values());

        const shouldUpdate =
          serverTs > lastUpdatedRef.current ||
          lastUpdatedRef.current === 0 ||
          mergedPlayers.length !== currentPlayers.length;

        if (shouldUpdate) {
          lastUpdatedRef.current = serverTs || Date.now();
          if (data.snapshot) {
            setSnapshot({
              ...data.snapshot,
              players: mergedPlayers,
            });
          }
          if (data.database) {
            const mergedDb = {
              ...data.database,
              players: mergedPlayers,
            };
            try {
              localStorage.setItem('nginda_live_database', JSON.stringify(mergedDb));
              localStorage.setItem('nginda_db_timestamp', String(lastUpdatedRef.current));
            } catch {}
          }
        }
      }
    } catch {
      // Non-blocking network sync
    } finally {
      isSyncingRef.current = false;
    }
  }, [snapshot]);

  // 2. Initial Mount Check from localStorage & immediate background refresh
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

    // Immediate network sync on mount to ensure fresh server data
    refreshNow();
  }, [initialSnapshot, refreshNow]);

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
