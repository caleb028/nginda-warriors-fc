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
  const [snapshot, setSnapshot] = useState<PublicWebsiteSnapshot>(initialSnapshot);
  const lastUpdatedRef = useRef<number>(0);
  const isSyncingRef = useRef<boolean>(false);
  const playerCountRef = useRef<number>(initialSnapshot.players?.length || 0);
  const lastSyncAttemptRef = useRef<number>(0);

  // 1. Core Sync Function (Zero re-allocations, throttled, stable reference, zero memory leaks)
  const refreshNow = useCallback(async (force = false) => {
    if (isSyncingRef.current) return;
    const now = Date.now();
    if (!force && lastUpdatedRef.current > 0 && now - lastSyncAttemptRef.current < 45000) {
      return; // Skip rapid redundant polling to save mobile RAM and CPU
    }
    lastSyncAttemptRef.current = now;
    isSyncingRef.current = true;
    try {
      const sinceParam = lastUpdatedRef.current > 0 ? `&since=${lastUpdatedRef.current}` : '';
      const res = await fetch(`/api/sync?t=${now}${sinceParam}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.changed === false) {
          // Server data is identical to client state; skip all allocations
          return;
        }
        const serverTs = Number(data.updatedAt) || 0;
        const incomingPlayers = data.snapshot?.players || data.database?.players || [];

        // Filter out any tombstoned / permanently deleted players
        const deletedSet = new Set([
          ...(data.database?.deletedPlayerIds || []),
          ...(data.snapshot?.deletedPlayerIds || []),
          ...Array.from(HYPOTHETICAL_PLAYER_IDS),
        ]);
        const playerMap = new Map<string, any>();
        for (const p of incomingPlayers) {
          if (p && p.id && !deletedSet.has(p.id) && !HYPOTHETICAL_PLAYER_IDS.has(p.id)) {
            playerMap.set(p.id, p);
          }
        }
        const mergedPlayers = Array.from(playerMap.values());

        const shouldUpdate =
          serverTs > lastUpdatedRef.current ||
          lastUpdatedRef.current === 0 ||
          mergedPlayers.length !== playerCountRef.current;

        if (shouldUpdate) {
          lastUpdatedRef.current = serverTs || now;
          playerCountRef.current = mergedPlayers.length;

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
      // Non-blocking background sync
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  // 2. Initial Mount Check from localStorage (runs ONCE on mount, zero re-render cycles)
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
            playerCountRef.current = localCount;
            if (storedTs) {
              lastUpdatedRef.current = Number(storedTs);
            }
          }
        }
      }
    } catch {}

    // Initial server verification
    refreshNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Real-Time Multi-Tab / Mobile Lifecycle Event Listeners (runs ONCE on mount)
  useEffect(() => {
    // A. BroadcastChannel for 0ms IPC updates across tabs
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
                playerCountRef.current = freshSnap.players?.length || 0;
                lastUpdatedRef.current = Date.now();
                // Do NOT call localStorage.setItem here: avoids cross-tab ping-pong storage loops
              } catch {}
            }
          }
        };
      } catch {}
    }

    // B. Storage Event Listener (fires across tabs on same origin when admin updates localStorage)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nginda_live_database' && e.newValue) {
        try {
          const freshDb = JSON.parse(e.newValue);
          const freshSnap = buildPublicSnapshot(freshDb);
          setSnapshot(freshSnap);
          playerCountRef.current = freshSnap.players?.length || 0;
          lastUpdatedRef.current = Date.now();
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // C. Single visibilitychange listener to refresh when returning to tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshNow();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // D. Lightweight 60-second background fallback sync loop
    const pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        refreshNow();
      }
    }, 60000);

    return () => {
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
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
