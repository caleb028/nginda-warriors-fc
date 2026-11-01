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
                className="hidden xl:flex items-center gap-1"
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

              {/* Desktop Action Area: Search, Support CTA (Clean without language pill) */}
              <div className="hidden sm:flex items-center gap-3">
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

              {/* Mobile Action Buttons */}
              <div className="xl:hidden flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-[#141414] text-slate-200 hover:text-[#FDE100] hover:bg-[#202020] border border-[#262626] focus:outline-none min-h-[44px] min-w-[44px]"
                  title="Search club site"
                  aria-label="Search club site"
                >
                  <Search className="w-5 h-5 text-slate-300" />
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-[#141414] text-slate-200 hover:text-[#FDE100] hover:bg-[#202020] border border-[#262626] focus:outline-none min-h-[44px] min-w-[44px]"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden bg-[#0D0D0D] border-t border-[#262626] px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {primaryNav.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-athletic font-black uppercase tracking-wider transition ${
                        isActive
                          ? 'bg-[#FDE100] text-black shadow-md'
                          : 'bg-[#161616] text-slate-200 hover:bg-[#222222] hover:text-[#FDE100]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-[#262626] pt-3">
                <p className="text-[11px] uppercase tracking-widest text-[#FDE100] font-athletic font-black mb-2">
                  Club Community & Engagement
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {secondaryNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141414] text-slate-300 hover:text-[#FDE100] hover:bg-[#1C1C1C] text-xs font-semibold border border-[#262626] transition"
                      >
                        <Icon className="w-4 h-4 text-[#FDE100]" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-base uppercase tracking-wider shadow-md transition active:scale-95"
                >
                  <HeartHandshake className="w-5 h-5 text-black" />
                  <span>{t.nav.supportClub}</span>
                </Link>
                <Link
                  href="/sponsors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-[#333333] bg-[#141414] text-white font-athletic font-bold text-base uppercase tracking-wider hover:border-[#FDE100] transition"
                >
                  <span>{t.hero.partnerWithUs}</span>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pb-16 xl:pb-0">{children}</main>

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
                      EST. {settings.establishedYear} • WARRIOR SPIRIT
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
                      About the Club & History (Est. 2024)
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
              <p>
                © {new Date().getFullYear()} {settings.clubName} (Est. {settings.establishedYear}). All rights reserved.
              </p>
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
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname === '/' ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 ${pathname === '/' ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Home</span>
          </Link>
          <Link
            href="/fixtures"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname.startsWith('/fixtures') ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className={`w-5 h-5 ${pathname.startsWith('/fixtures') ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Matches</span>
          </Link>
          <Link
            href="/team"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-athletic font-bold uppercase tracking-wider min-h-[44px] min-w-[54px] transition ${
              pathname.startsWith('/team') ? 'text-[#FDE100]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className={`w-5 h-5 ${pathname.startsWith('/team') ? 'text-[#FDE100]' : 'text-slate-400'}`} />
            <span>Team</span>
          </Link>
          <Link
            href="/news"
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
