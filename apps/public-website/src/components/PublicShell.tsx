'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ClubCrest,
  ClubSettings,
  PUBLIC_TRANSLATIONS,
  SupportedLocale,
} from '@nginda-warriors/shared';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
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
import { ScrollDynamicsHUD } from './ScrollDynamicsHUD';

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
  const router = useRouter();
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const desktopMoreRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);

  // Automatically close mobile menu, desktop dropdown, and search modal whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setDesktopMoreOpen(false);
  }, [pathname]);

  // Click outside listener for desktop More dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopMoreRef.current && !desktopMoreRef.current.contains(e.target as Node)) {
        setDesktopMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reliable mobile navigation click handler:
  // Allows Next.js <Link> native routing to run without e.preventDefault() cancelling the browser action.
  // Slight 120ms timeout ensures Chrome Android dispatches touch/click before unmounting the DOM node.
  const handleMenuLinkClick = (href: string) => {
    if (pathname === href) {
      setMobileMenuOpen(false);
      return;
    }
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 120);
  };

  // Zero-overhead threshold-only scroll listener: ONLY triggers state change when crossing 40px
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const nextScrolled = currentScrollY > 40;
          if (nextScrolled !== isScrolledRef.current) {
            isScrolledRef.current = nextScrolled;
            setIsScrolled(nextScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        {/* Isolated Zero-Overhead Scroll Dynamics & Navigation HUD */}
        <ScrollDynamicsHUD />

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
                        className={`relative px-3 py-2 rounded-lg text-sm font-athletic font-black uppercase tracking-wider transition-all duration-200 group ${
                          isActive
                            ? 'text-[#FDE100]'
                            : 'text-slate-200 hover:text-[#FDE100] hover:bg-[#1A1A1A]/70'
                        }`}
                      >
                        <span className="relative z-10 inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
                          {item.label}
                        </span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute bottom-0.5 left-2 right-2 h-[2px] bg-[#FDE100] shadow-[0_0_8px_#FDE100] rounded-full animate-fadeIn"
                          />
                        )}
                      </Link>
                    );
                  })}

                  {/* Desktop Secondary "More" Dropdown */}
                  <div className="relative" ref={desktopMoreRef}>
                    <button
                      type="button"
                      onClick={() => setDesktopMoreOpen((prev) => !prev)}
                      className={`relative px-3 py-2 rounded-lg text-sm font-athletic font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 group ${
                        secondaryNav.some((s) => pathname.startsWith(s.href))
                          ? 'text-[#FDE100]'
                          : 'text-slate-200 hover:text-[#FDE100] hover:bg-[#1A1A1A]/70'
                      }`}
                      aria-expanded={desktopMoreOpen}
                      aria-label="More navigation items"
                    >
                      <span>More</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          desktopMoreOpen ? 'rotate-180 text-[#FDE100]' : 'text-slate-400 group-hover:text-[#FDE100]'
                        }`}
                      />
                    </button>
                    {desktopMoreOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-black/95 border border-[#262626] shadow-2xl backdrop-blur-md z-50 animate-fadeIn">
                        {secondaryNav.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname.startsWith(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              prefetch={true}
                              onClick={() => setDesktopMoreOpen(false)}
                              className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-athletic font-bold uppercase tracking-wider transition ${
                                isActive
                                  ? 'bg-[#FDE100] text-black font-black'
                                  : 'text-slate-200 hover:bg-[#141414] hover:text-[#FDE100]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
          {[
            { href: '/', label: 'Home', icon: Home, exact: true },
            { href: '/fixtures', label: 'Matches', icon: Calendar },
            { href: '/team', label: 'Team', icon: Users },
            { href: '/news', label: 'News', icon: Newspaper },
          ].map((tab) => {
            const isActive = tab.exact
              ? pathname === '/'
              : pathname.startsWith(tab.href);
            const IconComponent = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition-all duration-200 active:scale-90 ${
                  isActive ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 w-8 h-[2px] bg-[#FDE100] shadow-[0_0_8px_#FDE100] rounded-full animate-fadeIn"
                  />
                )}
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'text-[#FDE100] scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="mt-0.5">{tab.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] text-slate-400 hover:text-white transition-all duration-200 active:scale-90"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-400" />
            <span className="mt-0.5">More</span>
          </button>
        </nav>

        {/* FULL-SCREEN ATHLETIC MOBILE NAVIGATION DRAWER (Positioned at root z-[100] with full sections restored) */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="xl:hidden fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col p-4 sm:p-6 overflow-y-auto overscroll-contain animate-fadeIn text-white"
          >
            {/* Top Bar inside Menu */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[#141414] hover:bg-[#202020] text-slate-200 hover:text-white border border-[#262626] transition active:scale-95 min-h-[44px]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-white" />
                <span className="font-athletic font-black text-xs uppercase tracking-wider text-slate-200">
                  Close
                </span>
              </button>

              <Link
                href="/"
                prefetch={true}
                onClick={() => handleMenuLinkClick('/')}
                className="flex items-center justify-center focus:outline-none"
                aria-label={settings.clubName}
              >
                <ClubCrest
                  size={50}
                  customCrestUrl={settings.crestUrl}
                  alt={`${settings.clubName} Crest`}
                  className="w-auto h-11 object-contain drop-shadow-md"
                />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#202020] text-slate-200 hover:text-[#FDE100] border border-[#262626] transition active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 py-4 space-y-6">
              {/* Category 1: Official Club Navigation (01 - 09) */}
              <div>
                <div className="flex items-center gap-2 px-2 py-1 mb-2 text-[10px] font-athletic font-black uppercase tracking-widest text-[#FDE100]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDE100]" />
                  <span>Main Club Sections</span>
                </div>
                <nav className="space-y-1" aria-label="Main Club Navigation">
                  {primaryNav.map((item, index) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => handleMenuLinkClick(item.href)}
                        className={`group flex items-center justify-between py-3 px-4 rounded-xl text-lg sm:text-xl font-athletic font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] min-h-[48px] ${
                          isActive
                            ? 'bg-[#FDE100] text-black shadow-lg shadow-[#FDE100]/20'
                            : 'text-white hover:bg-[#141414] hover:text-[#FDE100] active:bg-[#1C1C1C]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive ? 'text-black/60' : 'text-slate-500'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                            isActive ? 'text-black' : 'text-slate-500 group-hover:text-[#FDE100]'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Category 2: Fan Zone & Club Portals (10 - 15) */}
              <div>
                <div className="flex items-center gap-2 px-2 py-1 mb-2 text-[10px] font-athletic font-black uppercase tracking-widest text-[#FDE100]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FDE100]" />
                  <span>Fan Zone & Portals</span>
                </div>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5" aria-label="Club Portals Navigation">
                  {secondaryNav.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => handleMenuLinkClick(item.href)}
                        className={`group flex items-center justify-between py-3 px-4 rounded-xl text-base font-athletic font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] min-h-[48px] ${
                          isActive
                            ? 'bg-[#FDE100] text-black font-black shadow-md shadow-[#FDE100]/20'
                            : 'bg-[#0E0E0E] text-slate-200 border border-[#222222] hover:bg-[#161616] hover:text-[#FDE100] hover:border-[#FDE100]/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-mono font-bold ${
                              isActive ? 'text-black/60' : 'text-[#FDE100]'
                            }`}
                          >
                            {String(primaryNav.length + index + 1).padStart(2, '0')}
                          </span>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#FDE100]'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                            isActive ? 'text-black' : 'text-slate-500 group-hover:text-[#FDE100]'
                          }`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Language Selector in Drawer */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#101010] border border-[#222222] rounded-xl">
                <span className="flex items-center gap-2 text-xs font-athletic font-bold uppercase tracking-wider text-slate-300">
                  <Globe className="w-4 h-4 text-[#FDE100]" />
                  <span>Language / Lugha</span>
                </span>
                <div className="flex items-center gap-1 bg-[#1A1A1A] p-0.5 rounded-lg border border-[#333333]">
                  <button
                    type="button"
                    onClick={() => setLocale('en')}
                    className={`px-3 py-1 rounded-md text-xs font-athletic font-bold uppercase tracking-wider transition ${
                      locale === 'en'
                        ? 'bg-[#FDE100] text-black font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale('sw')}
                    className={`px-3 py-1 rounded-md text-xs font-athletic font-bold uppercase tracking-wider transition ${
                      locale === 'sw'
                        ? 'bg-[#FDE100] text-black font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SW
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Quick Actions (Support, Partner, Control Centre) */}
            <div className="border-t border-[#262626] pt-4 space-y-3 shrink-0 pb-6 sm:pb-4">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/support"
                  prefetch={true}
                  onClick={() => handleMenuLinkClick('/support')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4 text-black" />
                  <span>{t.nav.supportClub}</span>
                </Link>
                <Link
                  href="/sponsors"
                  prefetch={true}
                  onClick={() => handleMenuLinkClick('/sponsors')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-[#333333] bg-[#141414] text-white hover:border-[#FDE100] font-athletic font-bold text-xs uppercase tracking-wider transition active:scale-95"
                >
                  <span>{t.hero.partnerWithUs}</span>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] font-athletic uppercase tracking-widest text-slate-500">
                  Nginda Warriors FC • Murang’a County
                </span>
                <a
                  href="/manage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141414] hover:bg-[#202020] text-[#FDE100] border border-[#262626] hover:border-[#FDE100] font-athletic font-bold text-[11px] uppercase tracking-wider transition active:scale-95"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FDE100]" />
                  <span>Control Centre</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Global Command Palette / Search Dialog */}
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </LocaleContext.Provider>
  );
}
