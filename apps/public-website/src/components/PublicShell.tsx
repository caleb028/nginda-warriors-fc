'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClubCrest,
  ClubSettings,
  PUBLIC_TRANSLATIONS,
  SupportedLocale,
} from '@nginda-warriors/shared';
import {
  Calendar,
  Globe,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Newspaper,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { PwaInstallPrompt } from './PwaInstallPrompt';

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (loc: SupportedLocale) => void;
  t: (typeof PUBLIC_TRANSLATIONS)[SupportedLocale];
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: PUBLIC_TRANSLATIONS.en,
});

export function usePublicLocale() {
  return useContext(LocaleContext);
}

export function PublicShell({
  settings,
  children,
}: {
  settings: ClubSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // High-performance passive window scroll listener for header morphing
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic DOM scroll guards (locks background scrolling when drawer or modal is open)
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, searchOpen]);

  const t = PUBLIC_TRANSLATIONS[locale];

  const primaryNav = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/team', label: t.nav.team },
    { href: '/fixtures', label: t.nav.fixtures },
    { href: '/standings', label: t.nav.standings },
    { href: '/news', label: t.nav.news },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/sponsors', label: t.nav.sponsors },
    { href: '/contact', label: t.nav.contact },
  ];

  const secondaryNav = [
    { href: '/support', label: t.nav.supportClub, icon: HeartHandshake },
    { href: '/transparency', label: t.nav.transparency, icon: ShieldCheck },
    { href: '/membership', label: t.nav.membership, icon: Users },
    { href: '/recruitment', label: t.nav.recruitment, icon: UserPlus },
    { href: '/merchandise', label: t.nav.merchandise, icon: ShoppingBag },
    { href: '/events', label: t.nav.events, icon: Calendar },
  ];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      <div
        style={
          {
            '--warrior-green': settings.warriorGreen || '#0A2E1C',
            '--deep-forest-green': settings.deepForestGreen || '#071A10',
            '--crest-yellow': settings.crestYellow || '#FDE100',
            '--golden-accent': settings.goldenAccent || '#FFE600',
          } as React.CSSProperties
        }
        className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden w-full selection:bg-[#FDE100] selection:text-black"
      >
        {/* Main Official Club Header - Dynamic Scroll Morphing Header (Borussia Dortmund Black & Yellow) */}
        <header
          className={`sticky top-0 z-50 text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? 'bg-black/95 backdrop-blur-md shadow-2xl border-b border-[#FDE100]/25 py-2.5 sm:py-3'
              : 'bg-gradient-to-b from-black/95 via-black/60 to-transparent border-b border-transparent py-4 sm:py-5 backdrop-blur-xs'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`flex items-center justify-between transition-all duration-300 ${
                isScrolled ? 'h-14 sm:h-16' : 'h-18 sm:h-20'
              }`}
            >
              {/* DESKTOP HEADER (xl:flex) */}
              <div className="hidden xl:flex items-center justify-between w-full">
                {/* Official Club Logo Only */}
                <Link
                  href="/"
                  className="flex items-center group focus:outline-none focus:ring-2 focus:ring-[#FDE100] rounded-xl py-1 transition-transform"
                  aria-label={settings.clubName}
                >
                  <ClubCrest
                    size={isScrolled ? 56 : 64}
                    customCrestUrl={settings.crestUrl}
                    alt={`${settings.clubName} Official Crest`}
                    className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-md ${
                      isScrolled ? 'h-12 sm:h-14' : 'h-14 sm:h-16'
                    }`}
                  />
                </Link>

                {/* Desktop Primary Navigation */}
                <nav
                  className="flex items-center gap-1"
                  aria-label="Main navigation"
                >
                  {primaryNav.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        className={`px-3 py-2 rounded-lg text-sm font-athletic font-black uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-[#FDE100]/15 text-[#FDE100] border-b-2 border-[#FDE100]'
                            : 'text-slate-200 hover:bg-[#1A1A1A] hover:text-[#FDE100]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Desktop Action Area: Search, Support CTA */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 rounded-lg bg-[#141414] hover:bg-[#202020] text-slate-200 hover:text-[#FDE100] border border-[#262626] hover:border-[#FDE100]/40 transition flex items-center gap-1.5 text-xs font-bold font-athletic tracking-wider uppercase"
                    title="Search club site (Ctrl+K)"
                    aria-label="Search club site"
                  >
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-[#FDE100]" />
                    <span className="hidden md:inline">Search</span>
                  </button>

                  <Link
                    href="/support"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FDE100]/10 hover:scale-105 transition-all active:scale-95"
                  >
                    <HeartHandshake className="w-4 h-4 text-black" />
                    <span>{t.nav.supportClub}</span>
                  </Link>
                </div>
              </div>

              {/* MOBILE HEADER: RB Leipzig Signature Mobile Navigation (IMAGE 2) */}
              <div className="xl:hidden flex items-center justify-between w-full h-14 sm:h-16 relative">
                {/* 1. Left: ☰ Menü Trigger */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center gap-1.5 py-2 px-1 text-white hover:text-[#FDE100] focus:outline-none min-h-[44px] transition active:scale-95 group"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6 text-white group-hover:text-[#FDE100]" />
                  <span className="font-athletic font-black text-sm uppercase tracking-wider text-white group-hover:text-[#FDE100]">
                    Menü
                  </span>
                </button>

                {/* 2. Center: Official Club Crest Centered (RB Leipzig layout) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto">
                  <Link
                    href="/"
                    className="flex items-center justify-center group focus:outline-none"
                    aria-label={settings.clubName}
                  >
                    <ClubCrest
                      size={isScrolled ? 48 : 54}
                      customCrestUrl={settings.crestUrl}
                      alt={`${settings.clubName} Official Crest`}
                      className="w-auto h-11 sm:h-12 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                </div>

                {/* 3. Right: 🎟️ Tickets / Support Action */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-300 hover:text-[#FDE100] transition"
                    title="Search"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <Link
                    href="/support"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-black" />
                    <span>Tickets</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RB LEIPZIG SIGNATURE FULL-SCREEN MOBILE MENU (PURE CSS MOTION) */}
          {mobileMenuOpen && (
            <div
              className="xl:hidden fixed inset-0 z-50 bg-[#000000]/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-8 overflow-y-auto transition-all duration-300 ease-out"
            >
                {/* Top Bar inside Menu */}
                <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[#141414] hover:bg-[#202020] text-slate-200 hover:text-white border border-[#262626] transition active:scale-95"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-white" />
                    <span className="font-athletic font-black text-xs uppercase tracking-wider text-slate-200">
                      Close
                    </span>
                  </button>

                  <ClubCrest
                    size={48}
                    customCrestUrl={settings.crestUrl}
                    alt={`${settings.clubName} Crest`}
                    className="w-auto h-11 object-contain"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#202020] text-slate-200 hover:text-[#FDE100] border border-[#262626] transition"
                    title="Search"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4 text-slate-300" />
                  </button>
                </div>

                {/* Main Navigation Links List with Staggered Motion */}
                <div className="py-6 space-y-1">
                  {primaryNav.map((item, index) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    return (
                      <div
                        key={item.href}
                        className="transition-all duration-300"
                      >
                        <Link
                          href={item.href}
                          prefetch={true}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`group flex items-center justify-between py-3 px-4 rounded-xl text-xl sm:text-2xl font-athletic font-black uppercase tracking-wider transition ${
                            isActive
                              ? 'bg-[#FDE100] text-black shadow-md'
                              : 'text-white hover:bg-[#141414] hover:text-[#FDE100]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-mono font-bold ${isActive ? 'text-black/60' : 'text-slate-500'}`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <span className={`text-sm transition-transform group-hover:translate-x-1 ${isActive ? 'text-black' : 'text-slate-500 group-hover:text-[#FDE100]'}`}>
                            &rarr;
                          </span>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Quick Actions (Tickets, Partner With Us & Admin) */}
                <div className="border-t border-[#262626] pt-5 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/support"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95"
                    >
                      <HeartHandshake className="w-4 h-4 text-black" />
                      <span>{t.nav.supportClub}</span>
                    </Link>
                    <Link
                      href="/sponsors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#333333] bg-[#141414] text-white hover:border-[#FDE100] font-athletic font-bold text-xs uppercase tracking-wider transition"
                    >
                      <span>{t.hero.partnerWithUs}</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center pt-2">
                    <span className="text-[11px] font-athletic uppercase tracking-widest text-slate-500 text-center">
                      Nginda Warriors FC (Est. 2024) • Murang’a County
                    </span>
                  </div>
                </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-24 xl:pb-0">{children}</main>

        {/* Sleek Borussia Dortmund Black & Yellow Footer */}
        <footer className="bg-[#050505] text-slate-300 border-t border-[#222222]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Column 1: Identity & Crest */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-xl bg-[#0F0F0F] border border-[#262626] flex items-center justify-center">
                    <ClubCrest size={60} customCrestUrl={settings.crestUrl} />
                  </div>
                  <div>
                    <h3 className="font-athletic text-2xl font-black uppercase tracking-wider text-white">
                      {settings.clubName}
                    </h3>
                    <p className="text-xs font-athletic font-black uppercase tracking-widest text-[#FDE100]">
                      WARRIOR SPIRIT
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {settings.clubInfo.aboutSummary}
                </p>
                <p className="text-xs font-athletic font-bold uppercase tracking-wider text-[#FDE100]">
                  “{settings.tagline}”
                </p>
              </div>

              {/* Column 2: Football & Club Links */}
              <div>
                <h4 className="font-athletic text-base font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FDE100]"></span>
                  Football & Club
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <Link href="/about" className="hover:text-[#FDE100] transition">
                      About the Club & History
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-[#FDE100] transition">
                      First Team Squad & Technical Bench
                    </Link>
                  </li>
                  <li>
                    <Link href="/fixtures" className="hover:text-[#FDE100] transition">
                      Fixtures, Results & Match Centre
                    </Link>
                  </li>
                  <li>
                    <Link href="/standings" className="hover:text-[#FDE100] transition">
                      Official League Standings
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="hover:text-[#FDE100] transition">
                      Club News & Match Reports
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="hover:text-[#FDE100] transition">
                      Photography & Media Gallery
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Commercial & Community */}
              <div>
                <h4 className="font-athletic text-base font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FDE100]"></span>
                  Commercial & Community
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <Link href="/sponsors" className="hover:text-[#FDE100] transition">
                      Sponsorship Packages & Partnership
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="hover:text-[#FDE100] transition">
                      Support the Club (M-Pesa Campaigns)
                    </Link>
                  </li>
                  <li>
                    <Link href="/transparency" className="hover:text-[#FDE100] transition">
                      Public Financial Transparency
                    </Link>
                  </li>
                  <li>
                    <Link href="/membership" className="hover:text-[#FDE100] transition">
                      Supporter Membership Registration
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruitment" className="hover:text-[#FDE100] transition">
                      Player Recruitment & Trials
                    </Link>
                  </li>
                  <li>
                    <Link href="/merchandise" className="hover:text-[#FDE100] transition">
                      Official Club Merchandise
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-[#FDE100] transition">
                      Club Events & Outreach Calendar
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Official Contact Details */}
              <div>
                <h4 className="font-athletic text-base font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FDE100]"></span>
                  Official Club Contact
                </h4>
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#FDE100] shrink-0 mt-1" />
                    <span className="text-slate-300">{settings.physicalAddress || 'Nginda, Kenya'}</span>
                  </div>
                  {settings.contactPhone ? (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#FDE100] shrink-0" />
                      <span className="text-slate-300">{settings.contactPhone}</span>
                    </div>
                  ) : null}
                  {settings.contactEmail ? (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#FDE100] shrink-0" />
                      <span className="text-slate-300">{settings.contactEmail}</span>
                    </div>
                  ) : null}
                  <div className="pt-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
                    >
                      Send Official Inquiry
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <p>
                  © {new Date().getFullYear()} {settings.clubName} (Est. {settings.establishedYear}). All rights reserved.
                </p>
              </div>
              <p className="text-[#FDE100] font-athletic font-black tracking-wider uppercase">
                One Team. One Community. One Warrior Spirit.
              </p>
            </div>
          </div>
        </footer>

        {/* PWA / App Install Prompt */}
        <PwaInstallPrompt crestUrl={settings.crestUrl} />

        {/* Mobile App Bottom Navigation Bar */}
        <nav
          className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-[#262626] shadow-2xl px-2 py-1 flex items-center justify-around"
          aria-label="Mobile Bottom Navigation"
        >
          <Link
            href="/"
            prefetch={true}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname === '/' ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 ${pathname === '/' ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Home</span>
          </Link>
          <Link
            href="/fixtures"
            prefetch={true}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname.startsWith('/fixtures') ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className={`w-5 h-5 ${pathname.startsWith('/fixtures') ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Matches</span>
          </Link>
          <Link
            href="/team"
            prefetch={true}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname.startsWith('/team') ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className={`w-5 h-5 ${pathname.startsWith('/team') ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Team</span>
          </Link>
          <Link
            href="/news"
            prefetch={true}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname.startsWith('/news') ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className={`w-5 h-5 ${pathname.startsWith('/news') ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>News</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] text-slate-400 hover:text-white transition"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
            <span>More</span>
          </button>
        </nav>

        {/* Global Command Palette / Search Dialog */}
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </LocaleContext.Provider>
  );
}
