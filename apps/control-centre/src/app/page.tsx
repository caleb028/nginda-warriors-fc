'use client';

import React, { useEffect, useState } from 'react';
import {
  AdminSessionPayload,
  ClubCrest,
  NgindaDatabaseSchema,
} from '@nginda-warriors/shared';
import { AuthAndBootstrapGate } from '../components/AuthAndBootstrapGate';
import { FootballModules } from '../components/FootballModules';
import { ContentAndBrandModules } from '../components/ContentAndBrandModules';
import { CommercialAndCommunityModules } from '../components/CommercialAndCommunityModules';
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

  const loadState = async () => {
    try {
      const authRes = await fetch('/api/admin/auth');
      const authData = await authRes.json();
      setBootstrapped(Boolean(authData.bootstrapped));
      setSession(authData.session || null);

      if (authData.session) {
        const actionRes = await fetch('/api/admin/action');
        const actionData = await actionRes.json();
        if (actionData.ok && actionData.database) {
          setDatabase(actionData.database);
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
  }, []);

  const handleMutate = async (action: string, payload: Record<string, unknown>) => {
    try {
      setStatusNotice('Applying changes...');
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || 'Action failed.');
      } else {
        setStatusNotice('Changes synchronized live with database and public website.');
        setTimeout(() => setStatusNotice(''), 3500);
        await loadState();
      }
    } catch {
      alert('Network error communicating with Control Centre API.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <div className="min-h-screen bg-slate-50 flex">
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

          <div className="flex items-center gap-3">
            {/* Quick Action Buttons */}
            <button
              type="button"
              onClick={() => setActiveModule('match-centre')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-[#08783E] font-pedals font-athletic font-black text-xs uppercase tracking-wider transition"
            >
              <Zap className="w-3.5 h-3.5 text-[#F5D000]" />
              <span>⚡ 60s Live Score</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('players')}
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#08783E] text-white hover:bg-[#063B25] font-pedals font-athletic font-bold text-xs uppercase transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Player</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModule('fixtures')}
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 font-pedals font-athletic font-bold text-xs uppercase transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Fixture</span>
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
              href={publicWebsiteUrl || '/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-pedals font-athletic font-bold text-xs uppercase transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#08783E]" />
              <span className="hidden sm:inline">Public Site</span>
            </a>
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
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
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
                <div className="p-2 rounded-full bg-slate-50 border border-slate-200 shadow-xs">
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
      </div>
    </div>
  );
}
