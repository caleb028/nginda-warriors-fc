'use client';

import React, { useEffect, useState } from 'react';
import {
  AdminSessionPayload,
  ClubCrest,
  NgindaDatabaseSchema,
  slugify,
} from '@nginda-warriors/shared';
import { AuthAndBootstrapGate } from '../components/AuthAndBootstrapGate';
import { FootballModules } from '../components/FootballModules';
import { ContentAndBrandModules } from '../components/ContentAndBrandModules';
import { CommercialAndCommunityModules } from '../components/CommercialAndCommunityModules';
import { adminApiUrl } from '../utils/api';
import {
  Activity,
  Award,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Globe,
  HeartHandshake,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShoppingBag,
  Sliders,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

interface SidebarNavGroup {
  group: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'activity', label: 'Activity', icon: Activity },
    ],
  },
  {
    group: 'FOOTBALL',
    items: [
      { id: 'players', label: 'Players', icon: Users },
      { id: 'staff', label: 'Technical Staff', icon: UserCheck },
      { id: 'fixtures', label: 'Fixtures', icon: Calendar },
      { id: 'results', label: 'Results', icon: Trophy },
      { id: 'match-centre', label: 'Match Centre', icon: Zap },
      { id: 'competitions', label: 'Competitions', icon: Award },
      { id: 'standings', label: 'League Standings', icon: Award },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { id: 'homepage', label: 'Homepage Editor', icon: LayoutTemplate },
      { id: 'club-info', label: 'Club Information', icon: Shield },
      { id: 'news', label: 'News', icon: Newspaper },
      { id: 'gallery', label: 'Gallery', icon: ImageIcon },
      { id: 'media', label: 'Media Library', icon: ImageIcon },
      { id: 'events', label: 'Events', icon: Calendar },
    ],
  },
  {
    group: 'COMMERCIAL',
    items: [
      { id: 'sponsors', label: 'Sponsors', icon: Building2 },
      { id: 'sponsor-inquiries', label: 'Sponsor Inquiries', icon: MessageSquare },
      { id: 'sponsorship-packages', label: 'Sponsorship Packages', icon: Package },
      { id: 'fundraising', label: 'Fundraising', icon: HeartHandshake },
      { id: 'donations', label: 'M-Pesa Ledger', icon: Wallet },
      { id: 'expenditures', label: 'Expenditures', icon: FileSpreadsheet },
      { id: 'transparency', label: 'Transparency', icon: FileSpreadsheet },
      { id: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
    ],
  },
  {
    group: 'COMMUNITY',
    items: [
      { id: 'membership', label: 'Supporters', icon: Users },
      { id: 'recruitment', label: 'Trials & Scouting', icon: UserPlus },
      { id: 'contact', label: 'Inbox', icon: Mail },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { id: 'users', label: 'Admin Users', icon: KeyRound },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'backup', label: 'Database Backup', icon: Database },
      { id: 'settings', label: 'Site Settings', icon: Settings },
    ],
  },
];

export default function ControlCentreApp() {
  const [bootstrapped, setBootstrapped] = useState<boolean | null>(null);
  const [session, setSession] = useState<AdminSessionPayload | null>(null);
  const [database, setDatabase] = useState<NgindaDatabaseSchema | null>(null);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string>('');
  const [publicWebsiteUrl, setPublicWebsiteUrl] = useState<string>('/');

  // Automatic DOM scroll guards for mobile admin sidebar drawer
  useEffect(() => {
    if (sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nginda_control_session_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const loadState = async () => {
    // 1. Immediate optimistic hydration from client localStorage (0ms wait)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nginda_live_database');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setDatabase(parsed);
          }
        }
      } catch {}
    }

    try {
      const authRes = await fetch(adminApiUrl('/api/admin/auth'), {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const authData = await authRes.json();
      setBootstrapped(Boolean(authData.bootstrapped));
      setSession(authData.session || null);

      if (authData.session) {
        const actionRes = await fetch(adminApiUrl('/api/admin/action'), {
          headers: getAuthHeaders(),
          credentials: 'include',
        });
        const actionData = await actionRes.json();
        if (actionData.ok && actionData.database) {
          const serverDb = actionData.database;

          // If serverDb has 0 players, query /api/sync as secondary authoritative source
          if (!serverDb.players || serverDb.players.length === 0) {
            try {
              const pubRes = await fetch('/api/sync?t=' + Date.now());
              if (pubRes.ok) {
                const pubData = await pubRes.json();
                const pubPlayers = pubData.snapshot?.players || pubData.database?.players;
                if (Array.isArray(pubPlayers) && pubPlayers.length > 0) {
                  const deletedSet = new Set(serverDb.deletedPlayerIds || []);
                  serverDb.players = pubPlayers.filter((p: any) => !deletedSet.has(p.id));
                }
              }
            } catch {}
          }

          let activeDb = serverDb;

          // Guard against stale caches while strictly honoring permanent player deletions
          if (typeof window !== 'undefined') {
            try {
              const localRaw = localStorage.getItem('nginda_live_database');
              const localTs = Number(localStorage.getItem('nginda_db_timestamp') || '0');
              const serverTs = serverDb.clubSettings?.updatedAt
                ? new Date(serverDb.clubSettings.updatedAt).getTime()
                : 0;

              if (localRaw) {
                const localParsed = JSON.parse(localRaw);
                const mergedDeleted = Array.from(
                  new Set([
                    ...(serverDb.deletedPlayerIds || []),
                    ...(localParsed?.deletedPlayerIds || []),
                  ])
                );
                const deletedSet = new Set(mergedDeleted);

                if (Array.isArray(localParsed?.players)) {
                  localParsed.players = localParsed.players.filter((p: any) => !deletedSet.has(p.id));
                  localParsed.deletedPlayerIds = mergedDeleted;
                }
                if (Array.isArray(serverDb?.players)) {
                  serverDb.players = serverDb.players.filter((p: any) => !deletedSet.has(p.id));
                  serverDb.deletedPlayerIds = mergedDeleted;
                }

                const localPlayerCount = Array.isArray(localParsed?.players) ? localParsed.players.length : 0;
                const serverPlayerCount = Array.isArray(serverDb?.players) ? serverDb.players.length : 0;

                // Never overwrite non-empty local roster with a cold server instance holding 0 players
                if (localPlayerCount > serverPlayerCount && (localTs > serverTs + 1500 || serverPlayerCount === 0)) {
                  activeDb = localParsed;
                  fetch(adminApiUrl('/api/admin/action'), {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    credentials: 'include',
                    body: JSON.stringify({ action: 'sync_full_database', payload: { database: localParsed } }),
                  }).catch(() => null);

                  fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ database: localParsed }),
                  }).catch(() => null);

                  fetch('/manage/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ database: localParsed }),
                  }).catch(() => null);
                } else {
                  activeDb = serverDb;
                }
              }
            } catch {}
          }

          setDatabase(activeDb);
          if (typeof window !== 'undefined') {
            localStorage.setItem('nginda_live_database', JSON.stringify(activeDb));
            localStorage.setItem('nginda_db_timestamp', String(Date.now()));
          }
        }
        if (actionData.publicWebsiteUrl) {
          setPublicWebsiteUrl(actionData.publicWebsiteUrl);
        }
      }
    } catch {
      // offline / starting
    }
  };

  useEffect(() => {
    loadState();

    // Listen for multi-tab updates within Admin
    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel('nginda_warriors_live_sync');
        bc.onmessage = (event) => {
          if (event.data?.type === 'DATABASE_UPDATED' && event.data?.database) {
            setDatabase(event.data.database);
          }
        };
      } catch {}
    }

    return () => {
      if (bc) {
        try {
          bc.close();
        } catch {}
      }
    };
  }, []);

  const handleMutate = async (action: string, payload: Record<string, unknown>) => {
    // Automatically guarantee clientPlayers and deletedPlayerIds for save_player
    if (action === 'save_player') {
      payload = {
        ...payload,
        clientPlayers: Array.isArray(payload.clientPlayers)
          ? payload.clientPlayers
          : (database?.players || []),
        deletedPlayerIds: Array.isArray(payload.deletedPlayerIds)
          ? payload.deletedPlayerIds
          : (database?.deletedPlayerIds || []),
      };
    }

    const previousDb = database;
    let optimisticDb: NgindaDatabaseSchema | null = null;

    // 0ms OPTIMISTIC UI REMOVAL: deleted items vanish from the screen instantly
    if (database) {
      const nextDb: NgindaDatabaseSchema = JSON.parse(JSON.stringify(database));
      let isOptimistic = false;

      if (action === 'delete_player') {
        const id = String(payload.id || payload.playerId || '');
        nextDb.players = (nextDb.players || []).filter((p) => p.id !== id);
        nextDb.deletedPlayerIds = Array.from(new Set([...(nextDb.deletedPlayerIds || []), id]));
        isOptimistic = true;
      } else if (action === 'clear_all_players') {
        const deletedIds = (nextDb.players || []).map((p) => p.id);
        nextDb.deletedPlayerIds = Array.from(new Set([...(nextDb.deletedPlayerIds || []), ...deletedIds]));
        nextDb.players = [];
        isOptimistic = true;
      } else if (action === 'delete_staff') {
        nextDb.staff = nextDb.staff.filter((s) => s.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_fixture') {
        nextDb.fixtures = nextDb.fixtures.filter((f) => f.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_competition') {
        nextDb.competitions = nextDb.competitions.filter((c) => c.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_standing_row') {
        nextDb.standings = nextDb.standings.filter((r) => r.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'clear_all_standings') {
        nextDb.standings = [];
        isOptimistic = true;
      } else if (action === 'delete_article') {
        nextDb.articles = nextDb.articles.filter((a) => a.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_media_asset') {
        nextDb.mediaAssets = nextDb.mediaAssets.filter((m) => m.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_event') {
        nextDb.events = nextDb.events.filter((e) => e.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_sponsor') {
        nextDb.sponsors = nextDb.sponsors.filter((s) => s.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_sponsorship_package') {
        nextDb.sponsorshipPackages = nextDb.sponsorshipPackages.filter((p) => p.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_campaign') {
        nextDb.fundraisingCampaigns = nextDb.fundraisingCampaigns.filter((c) => c.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_expenditure') {
        nextDb.expenditureRecords = nextDb.expenditureRecords.filter((e) => e.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_product') {
        nextDb.products = nextDb.products.filter((p) => p.id !== payload.id);
        isOptimistic = true;
      } else if (action === 'delete_admin_user') {
        const uid = payload.userId || payload.id;
        nextDb.users = nextDb.users.filter((u) => u.id !== uid);
        isOptimistic = true;
      } else if (action === 'clear_fixture_result') {
        nextDb.fixtures = nextDb.fixtures.map((f) => {
          if (f.id === payload.fixtureId) {
            return {
              ...f,
              homeScore: null,
              awayScore: null,
              matchStatus: 'scheduled' as const,
              events: [],
            };
          }
          return f;
        });
        isOptimistic = true;
      } else if (action === 'save_player') {
        if (payload.id) {
          const pIdx = nextDb.players.findIndex((p) => p.id === payload.id);
          if (pIdx >= 0) {
            nextDb.players[pIdx] = { ...nextDb.players[pIdx], ...(payload as any) };
            isOptimistic = true;
          }
        } else if (payload.fullName) {
          const tempId = `player-${Date.now()}`;
          const slug = `${slugify(String(payload.fullName))}-${payload.jerseyNumber}`;
          nextDb.players.push({
            id: tempId,
            slug,
            fullName: String(payload.fullName).trim(),
            jerseyNumber: Number(payload.jerseyNumber || 99),
            positionGroup: (payload.positionGroup as any) || 'Midfielders',
            specificRole: String(payload.specificRole || 'Player'),
            photoUrl: String(payload.photoUrl || ''),
            biography: String(payload.biography || 'Official squad player for Nginda Warriors FC.'),
            preferredFoot: (payload.preferredFoot as any) || 'Right',
            isUnderageProtected: Boolean(payload.isUnderageProtected),
            appearances: Number(payload.appearances || 0),
            starts: Number(payload.starts || 0),
            goals: Number(payload.goals || 0),
            assists: Number(payload.assists || 0),
            yellowCards: Number(payload.yellowCards || 0),
            redCards: Number(payload.redCards || 0),
            cleanSheets: Number(payload.cleanSheets || 0),
            seasonStats: [],
            isFeatured: Boolean(payload.isFeatured),
            squadStatus: (payload.squadStatus as any) || 'active',
            publicationStatus: (payload.publicationStatus as any) || 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'save_staff') {
        if (payload.id) {
          const sIdx = nextDb.staff.findIndex((s) => s.id === payload.id);
          if (sIdx >= 0) {
            nextDb.staff[sIdx] = { ...nextDb.staff[sIdx], ...(payload as any) };
            isOptimistic = true;
          }
        } else if (payload.fullName) {
          const tempId = `staff-${Date.now()}`;
          nextDb.staff.push({
            id: tempId,
            fullName: String(payload.fullName).trim(),
            roleTitle: String(payload.roleTitle || 'Coach').trim(),
            category: (payload.category as any) || 'Technical Bench',
            photoUrl: String(payload.photoUrl || ''),
            biography: String(payload.biography || ''),
            publicEmail: String(payload.publicEmail || ''),
            publicPhone: String(payload.publicPhone || ''),
            displayOrder: Number(payload.displayOrder || nextDb.staff.length + 1),
            publicationStatus: (payload.publicationStatus as any) || 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'save_fixture') {
        if (payload.id) {
          const fIdx = nextDb.fixtures.findIndex((f) => f.id === payload.id);
          if (fIdx >= 0) {
            nextDb.fixtures[fIdx] = {
              ...nextDb.fixtures[fIdx],
              ...(payload as any),
              updatedAt: new Date().toISOString(),
            };
            isOptimistic = true;
          }
        } else if (payload.opponentName) {
          const tempId = `fixture-${Date.now()}`;
          nextDb.fixtures.unshift({
            id: tempId,
            competitionName: String(payload.competitionName || 'Murang’a County League').trim(),
            seasonName: String(payload.seasonName || '2026/2027 Season').trim(),
            opponentName: String(payload.opponentName).trim(),
            opponentCrestUrl: String(payload.opponentCrestUrl || ''),
            venue: String(payload.venue || 'Nginda Stadium').trim(),
            isHome: payload.isHome !== false,
            kickoffAt: payload.kickoffAt || new Date(Date.now() + 86400000 * 7).toISOString(),
            timezone: 'Africa/Nairobi',
            matchStatus: (payload.matchStatus as any) || 'scheduled',
            homeScore: typeof payload.homeScore === 'number' ? payload.homeScore : null,
            awayScore: typeof payload.awayScore === 'number' ? payload.awayScore : null,
            motmVotingOpen: Boolean(payload.motmVotingOpen),
            publicationStatus: (payload.publicationStatus as any) || 'published',
            events: Array.isArray(payload.events) ? payload.events : [],
            lineups: Array.isArray(payload.lineups) ? payload.lineups : [],
            report: payload.report || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'update_match_score') {
        const fIdx = nextDb.fixtures.findIndex((f) => f.id === payload.fixtureId);
        if (fIdx >= 0) {
          nextDb.fixtures[fIdx] = {
            ...nextDb.fixtures[fIdx],
            homeScore: typeof payload.homeScore === 'number' ? payload.homeScore : nextDb.fixtures[fIdx].homeScore,
            awayScore: typeof payload.awayScore === 'number' ? payload.awayScore : nextDb.fixtures[fIdx].awayScore,
            matchStatus: payload.matchStatus || nextDb.fixtures[fIdx].matchStatus,
            events: Array.isArray(payload.events) ? payload.events : nextDb.fixtures[fIdx].events,
            updatedAt: new Date().toISOString(),
          };
          isOptimistic = true;
        }
      } else if (action === 'save_article') {
        if (payload.id) {
          const aIdx = nextDb.articles.findIndex((a) => a.id === payload.id);
          if (aIdx >= 0) {
            nextDb.articles[aIdx] = {
              ...nextDb.articles[aIdx],
              ...(payload as any),
              updatedAt: new Date().toISOString(),
            };
            isOptimistic = true;
          }
        } else if (payload.headline) {
          const tempId = `article-${Date.now()}`;
          nextDb.articles.unshift({
            id: tempId,
            slug: slugify(String(payload.headline)),
            headline: String(payload.headline).trim(),
            categoryName: (payload.categoryName as any) || 'Club announcements',
            excerpt: String(payload.excerpt || '').trim(),
            body: String(payload.body || '').trim(),
            featuredImageUrl: String(payload.featuredImageUrl || ''),
            authorName: String(payload.authorName || 'Nginda Warriors FC Media').trim(),
            publishedAt: new Date().toISOString(),
            publicationStatus: (payload.publicationStatus as any) || 'published',
            tags: Array.isArray(payload.tags) ? payload.tags : [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'save_sponsor') {
        if (payload.id) {
          const spIdx = nextDb.sponsors.findIndex((s) => s.id === payload.id);
          if (spIdx >= 0) {
            nextDb.sponsors[spIdx] = {
              ...nextDb.sponsors[spIdx],
              ...(payload as any),
              updatedAt: new Date().toISOString(),
            };
            isOptimistic = true;
          }
        } else if (payload.businessName) {
          const tempId = `sponsor-${Date.now()}`;
          nextDb.sponsors.push({
            id: tempId,
            businessName: String(payload.businessName).trim(),
            tierCode: (payload.tierCode as any) || 'official_partner',
            tierName: String(payload.tierName || 'Official Partner').trim(),
            logoUrl: String(payload.logoUrl || ''),
            websiteUrl: String(payload.websiteUrl || ''),
            isApproved: payload.isApproved !== false,
            displayOrder: Number(payload.displayOrder || nextDb.sponsors.length + 1),
            publicationStatus: (payload.publicationStatus as any) || 'published',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'save_standing_row') {
        if (payload.id) {
          const rIdx = nextDb.standings.findIndex((r) => r.id === payload.id);
          if (rIdx >= 0) {
            nextDb.standings[rIdx] = {
              ...nextDb.standings[rIdx],
              ...(payload as any),
              updatedAt: new Date().toISOString(),
            };
            isOptimistic = true;
          }
        } else if (payload.clubName) {
          const tempId = `standing-${Date.now()}`;
          nextDb.standings.push({
            id: tempId,
            competitionName: String(payload.competitionName || 'Murang’a County League').trim(),
            seasonName: String(payload.seasonName || '2026/2027 Season').trim(),
            position: Number(payload.position || nextDb.standings.length + 1),
            clubName: String(payload.clubName).trim(),
            clubCrestUrl: String(payload.clubCrestUrl || ''),
            isNgindaWarriors: Boolean(payload.isNgindaWarriors),
            played: Number(payload.played || 0),
            won: Number(payload.won || 0),
            drawn: Number(payload.drawn || 0),
            lost: Number(payload.lost || 0),
            goalsFor: Number(payload.goalsFor || 0),
            goalsAgainst: Number(payload.goalsAgainst || 0),
            goalDifference: Number(payload.goalDifference || 0),
            points: Number(payload.points || 0),
            form: Array.isArray(payload.form) ? payload.form : [],
            publicationStatus: (payload.publicationStatus as any) || 'published',
            updatedAt: new Date().toISOString(),
          });
          isOptimistic = true;
        }
      } else if (action === 'save_club_settings' && payload.heroSlides) {
        nextDb.clubSettings = {
          ...nextDb.clubSettings,
          heroSlides: payload.heroSlides as any,
        };
        isOptimistic = true;
      }

      if (isOptimistic) {
        optimisticDb = nextDb;
        // Apply instantly to local UI state (0ms delay)
        setDatabase(nextDb);

        // Immediately update localStorage and broadcast to other open tabs
        if (typeof window !== 'undefined') {
          localStorage.setItem('nginda_live_database', JSON.stringify(nextDb));
          localStorage.setItem('nginda_db_timestamp', String(Date.now()));
          if ('BroadcastChannel' in window) {
            try {
              const bc = new BroadcastChannel('nginda_warriors_live_sync');
              bc.postMessage({ type: 'DATABASE_UPDATED', database: nextDb });
              setTimeout(() => {
                try {
                  bc.close();
                } catch {}
              }, 1500);
            } catch {}
          }
        }
      }
    }

    try {
      setStatusNotice(
        action.startsWith('delete_') || action.includes('clear')
          ? 'Content removed.'
          : 'Applying changes...'
      );
      const res = await fetch(adminApiUrl('/api/admin/action'), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (previousDb) {
          setDatabase(previousDb); // Rollback on error
        }
        if (data.error && data.error.includes('UNAUTHORIZED')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('nginda_control_session_token');
          }
          setSession(null);
        }
        alert(data.error || 'Action failed.');
      } else {
        let confirmedDb = data.database || optimisticDb;
        if (action === 'save_player' && confirmedDb) {
          const deletedSet = new Set([
            ...(previousDb?.deletedPlayerIds || []),
            ...(confirmedDb.deletedPlayerIds || []),
          ]);
          const playerMap = new Map<string, any>();
          // Preserve all known non-deleted players
          for (const p of (optimisticDb?.players || previousDb?.players || [])) {
            if (p && p.id && !deletedSet.has(p.id) && !p.id.startsWith('player-')) {
              playerMap.set(p.id, p);
            }
          }
          for (const p of (confirmedDb.players || [])) {
            if (p && p.id && !deletedSet.has(p.id) && !p.id.startsWith('player-')) {
              playerMap.set(p.id, p);
            }
          }
          if (data.player && data.player.id) {
            playerMap.set(data.player.id, data.player);
          }
          confirmedDb = {
            ...confirmedDb,
            players: Array.from(playerMap.values()),
          };
        }
        if (confirmedDb) {
          setDatabase(confirmedDb);
        }

        setStatusNotice(
          action.startsWith('delete_') || action.includes('clear')
            ? 'Content deleted and removed live.'
            : 'Changes synchronized live with database and public website.'
        );
        setTimeout(() => setStatusNotice(''), 3000);

        if (typeof window !== 'undefined' && confirmedDb) {
          const origin = window.location.origin;
          const payloadStr = JSON.stringify({ database: confirmedDb });

          // 1. Direct fetch to public-website and control-centre sync endpoints
          fetch(`${origin}/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadStr,
          }).catch(() => null);

          fetch(`${origin}/manage/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadStr,
          }).catch(() => null);

          // 2. Direct fetch to public-website revalidate
          const revalPaths = action.includes('player') ? ['/', '/team'] : ['/'];
          revalPaths.forEach((p) => {
            fetch(`${origin}/api/revalidate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: p }),
            }).catch(() => null);
          });

          // 3. Fallback relative fetches
          fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadStr,
          }).catch(() => null);

          fetch('/manage/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payloadStr,
          }).catch(() => null);

          // 4. Update localStorage for instant multi-tab sync
          localStorage.setItem('nginda_live_database', JSON.stringify(confirmedDb));
          localStorage.setItem('nginda_db_timestamp', String(Date.now()));

          // 5. Broadcast to any open public website tabs
          if ('BroadcastChannel' in window) {
            try {
              const bc = new BroadcastChannel('nginda_warriors_live_sync');
              bc.postMessage({ type: 'DATABASE_UPDATED', database: confirmedDb });
              // Keep channel open briefly before disposal to ensure browser IPC dispatch
              setTimeout(() => {
                try {
                  bc.close();
                } catch {}
              }, 1500);
            } catch {}
          }
        }

        if (!data.database) {
          await loadState();
        }
      }
    } catch {
      if (previousDb) {
        setDatabase(previousDb);
      }
      alert('Network error communicating with Control Centre API.');
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nginda_control_session_token');
    }
    await fetch(adminApiUrl('/api/admin/auth'), {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ action: 'logout' }),
    });
    setSession(null);
    loadState();
  };

  if (bootstrapped === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-900 font-pedals font-athletic text-2xl uppercase tracking-wider">
        Loading Nginda Warriors Control Centre...
      </div>
    );
  }

  if (!bootstrapped || !session || !database) {
    return (
      <AuthAndBootstrapGate
        bootstrapped={Boolean(bootstrapped)}
        crestUrl={database?.clubSettings?.crestUrl}
        onAuthenticated={loadState}
      />
    );
  }

  const { clubSettings } = database;
  const unreadNotifications = database.notifications.filter((n) => !n.isRead).length;

  // Active KPI Counts
  const totalPlayers = database.players.length;
  const upcomingCount = database.fixtures.filter((f) => f.matchStatus === 'scheduled').length;
  const completedCount = database.fixtures.filter((f) => f.matchStatus === 'fulltime').length;
  const publishedNewsCount = database.articles.filter((a) => a.publicationStatus === 'published').length;
  const inquiriesCount = database.sponsorInquiries.length;
  const activeSponsorsCount = database.sponsors.filter((s) => s.isApproved).length;
  const membersCount = database.fanMemberships.length;
  const recruitmentCount = database.recruitmentApplications.length;
  const activeCampaignsCount = database.fundraisingCampaigns.filter((c) => c.publicationStatus === 'published').length;
  const confirmedContributionsKes = database.donations
    .filter((d) => d.status === 'confirmed')
    .reduce((sum, d) => sum + Number(d.amountKes || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden w-full max-w-full">
      {/* 1. CLEAN WHITE SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Sidebar Crest & Header */}
          <div className="p-5 border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClubCrest size={46} customCrestUrl={clubSettings.crestUrl} />
              <div>
                <h1 className="font-pedals font-athletic text-lg font-black uppercase text-slate-900 leading-tight">
                  CONTROL CENTRE
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#08783E]">
                  NGINDA WARRIORS FC
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Nav Groups */}
          <nav className="p-4 space-y-6">
            {SIDEBAR_GROUPS.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {grp.group}
                </span>
                <div className="space-y-0.5 pt-1">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveModule(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                          isActive
                            ? 'bg-[#08783E]/10 text-[#08783E] font-black border-r-2 border-[#08783E]'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#08783E]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.id === 'notifications' && unreadNotifications > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                            {unreadNotifications}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Badge */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden pr-2">
              <p className="font-pedals font-athletic text-sm font-bold uppercase text-slate-900 truncate">
                {session.fullName}
              </p>
              <span className="text-[10px] font-extrabold uppercase text-[#08783E]">
                {session.roleCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
              {activeModule.replace(/-/g, ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action Buttons */}
            <button
              type="button"
              onClick={() => setActiveModule('match-centre')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-[#08783E] font-pedals font-athletic font-black text-[11px] sm:text-xs uppercase tracking-wider transition min-h-[38px]"
            >
              <Zap className="w-3.5 h-3.5 text-[#F5D000]" />
              <span className="inline">⚡ 60s Score</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('players')}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#08783E] text-white hover:bg-[#063B25] font-pedals font-athletic font-bold text-xs uppercase transition min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Player</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('news')}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-pedals font-athletic font-bold text-xs uppercase transition min-h-[38px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Article</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setActiveModule('notifications')}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600" />
              )}
            </button>

            {/* View Public Website */}
            <a
              href={
                typeof window !== 'undefined' && window.location.origin
                  ? `${window.location.origin}/`
                  : publicWebsiteUrl && publicWebsiteUrl !== '/'
                  ? publicWebsiteUrl
                  : 'https://nginda-warriors-fc-c549.vercel.app/'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-pedals font-athletic font-bold text-xs uppercase transition border border-slate-200 hover:border-slate-300"
              title="Open Official Public Website"
            >
              <Globe className="w-3.5 h-3.5 text-[#08783E]" />
              <span className="hidden sm:inline">Public Site</span>
            </a>

            {/* Quick Sign Out Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
              title="Sign Out of Control Centre"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Live Synchronized Alert Notification */}
        {statusNotice && (
          <div className="bg-[#08783E]/10 border-b border-[#08783E]/30 px-4 py-2.5 text-xs text-[#08783E] font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#08783E]" />
              <span>{statusNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotice('')}
              className="text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Workspace Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 pb-20 lg:pb-8">
          {activeModule === 'dashboard' ? (
            /* OVERVIEW DASHBOARD */
            <div className="space-y-8">
              {/* Header Hero Banner - Crisp White */}
              <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-[#08783E] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-wider">
                    OPERATIONAL DASHBOARD • EST. {clubSettings.establishedYear}
                  </span>
                  <h2 className="font-pedals font-athletic text-4xl sm:text-5xl font-black uppercase text-slate-950 mt-2">
                    WELCOME, {session.fullName}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    System Owner & Super Administrator • Full authorized control of Nginda Warriors FC modules.
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-xs flex items-center justify-center">
                  <ClubCrest size={72} customCrestUrl={clubSettings.crestUrl} />
                </div>
              </div>

              {/* 10 Operational KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Players', value: totalPlayers, id: 'players', icon: Users },
                  { label: 'Upcoming Fixtures', value: upcomingCount, id: 'fixtures', icon: Calendar },
                  { label: 'Completed Matches', value: completedCount, id: 'results', icon: Trophy },
                  { label: 'Published News', value: publishedNewsCount, id: 'news', icon: Newspaper },
                  { label: 'Sponsor Inquiries', value: inquiriesCount, id: 'sponsor-inquiries', icon: MessageSquare },
                  { label: 'Active Sponsors', value: activeSponsorsCount, id: 'sponsors', icon: Building2 },
                  { label: 'Fan Members', value: membersCount, id: 'membership', icon: Users },
                  { label: 'Recruitment Apps', value: recruitmentCount, id: 'recruitment', icon: UserPlus },
                  { label: 'Active Campaigns', value: activeCampaignsCount, id: 'fundraising', icon: HeartHandshake },
                  {
                    label: 'Confirmed KES',
                    value: `KES ${confirmedContributionsKes.toLocaleString()}`,
                    id: 'donations',
                    icon: Wallet,
                  },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <button
                      key={kpi.label}
                      type="button"
                      onClick={() => setActiveModule(kpi.id)}
                      className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#08783E]/40 text-left shadow-xs transition hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[#08783E] mb-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">View →</span>
                      </div>
                      <span className="block font-pedals font-athletic text-2xl sm:text-3xl font-black text-slate-950">
                        {kpi.value}
                      </span>
                      <span className="block text-[11px] font-bold uppercase text-slate-500 mt-1">
                        {kpi.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Onboarding Prompts */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-pedals font-athletic text-2xl font-black uppercase text-slate-900">
                  Quick Onboarding & Setup Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                      1. Squad Profiles ({totalPlayers} Added)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Add and publish first-team players with jersey numbers and statistics.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModule('players')}
                      className="text-xs font-bold uppercase text-[#08783E] hover:underline"
                    >
                      + Add Squad Players →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                      2. Match Fixture & Live Score ({upcomingCount} Scheduled)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Create fixtures and use the 60-second score updater on matchday.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModule('fixtures')}
                      className="text-xs font-bold uppercase text-[#08783E] hover:underline"
                    >
                      + Create Next Fixture →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-pedals font-athletic text-xl font-bold uppercase text-slate-900">
                      3. Brand Settings & Hero Slides
                    </h4>
                    <p className="text-xs text-slate-600">
                      Upload club photography, tweak brand color tokens, and customize sections.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveModule('homepage')}
                      className="text-xs font-bold uppercase text-[#08783E] hover:underline"
                    >
                      Open Homepage Editor →
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Audit Activity Stream */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-pedals font-athletic text-lg font-bold uppercase text-slate-900">
                    Recent Administrative Activity
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveModule('activity')}
                    className="text-xs font-bold text-[#08783E] hover:underline"
                  >
                    View All ({database.auditLogs.length})
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {database.auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#08783E] uppercase mr-2">
                          {log.action}
                        </span>
                        <span className="text-slate-800 font-semibold">{log.summary}</span>
                      </div>
                      <span className="text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString('en-KE')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : [
              'players',
              'staff',
              'fixtures',
              'results',
              'match-centre',
              'competitions',
              'standings',
            ].includes(activeModule) ? (
            <FootballModules
              activeModule={activeModule}
              db={database}
              onMutate={handleMutate}
            />
          ) : [
              'homepage',
              'club-info',
              'news',
              'gallery',
              'media',
              'events',
              'settings',
            ].includes(activeModule) ? (
            <ContentAndBrandModules
              activeModule={activeModule}
              db={database}
              onMutate={handleMutate}
            />
          ) : (
            <CommercialAndCommunityModules
              activeModule={activeModule}
              db={database}
              onMutate={handleMutate}
            />
          )}
        </main>

        {/* Mobile Admin Quick Match-Day Action Strip */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl px-3 py-1.5 flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveModule('match-centre')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase min-h-[44px] min-w-[50px] transition ${
              activeModule === 'match-centre' ? 'text-[#08783E] font-black' : 'text-slate-600'
            }`}
          >
            <Zap className="w-5 h-5 text-[#F5D000] fill-[#F5D000]" />
            <span>⚡ Score</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('players')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase min-h-[44px] min-w-[50px] transition ${
              activeModule === 'players' ? 'text-[#08783E] font-black' : 'text-slate-600'
            }`}
          >
            <Users className="w-5 h-5 text-[#08783E]" />
            <span>Players</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModule('news')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase min-h-[44px] min-w-[50px] transition ${
              activeModule === 'news' ? 'text-[#08783E] font-black' : 'text-slate-600'
            }`}
          >
            <Newspaper className="w-5 h-5 text-slate-700" />
            <span>News</span>
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase min-h-[44px] min-w-[50px] text-slate-600"
          >
            <Menu className="w-5 h-5 text-slate-600" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
