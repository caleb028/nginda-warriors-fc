'use client';

import React, { createContext, useContext, useState } from 'react';
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
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';

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
            '--warrior-green': settings.warriorGreen || '#08783E',
            '--deep-forest-green': settings.deepForestGreen || '#063B25',
            '--crest-yellow': settings.crestYellow || '#F5D000',
            '--golden-accent': settings.goldenAccent || '#D5AA00',
          } as React.CSSProperties
        }
        className="min-h-screen flex flex-col bg-white text-slate-900"
      >
        {/* Top Utility & Community Strip - Crisp Clean White/Light Neutral */}
        <div className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#08783E]/10 text-[#08783E] border border-[#08783E]/20 font-athletic font-bold tracking-wider uppercase text-[11px]">
                <Trophy className="w-3 h-3 text-[#D5AA00]" />
                EST. {settings.establishedYear || 2024}
              </span>
              <span className="hidden sm:inline text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                Official Digital Platform
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 ml-auto">
              <div className="hidden lg:flex items-center gap-4">
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center gap-1 transition-colors ${
                        active
                          ? 'text-[#08783E] font-bold'
                          : 'text-slate-600 hover:text-[#08783E]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Bilingual Switcher (English / Kiswahili) */}
              <div
                className="inline-flex items-center rounded-md bg-white p-0.5 border border-slate-200 shadow-xs"
                role="group"
                aria-label="Language switcher"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
                <button
                  type="button"
                  onClick={() => setLocale('en')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    locale === 'en'
                      ? 'bg-[#08783E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('sw')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                    locale === 'sw'
                      ? 'bg-[#08783E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Official Club Header - Pure White Canvas */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-900 shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Official Club Crest */}
              <Link
                href="/"
                className="flex items-center gap-3 group focus:outline-none py-1"
                aria-label={settings.clubName}
              >
                <div className="p-1 rounded-full bg-slate-50 border border-slate-200 group-hover:scale-105 group-hover:border-[#08783E]/40 transition-all shadow-sm">
                  <ClubCrest
                    size={54}
                    customCrestUrl={settings.crestUrl}
                    alt={`${settings.clubName} Official Crest`}
                  />
                </div>
                <span className="sr-only">{settings.clubName}</span>
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
                      className={`px-3 py-2 rounded-lg text-sm font-athletic font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#08783E]/10 text-[#08783E] border-b-2 border-[#08783E]'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#08783E]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Primary Action CTA & Search Button */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5 text-xs font-bold font-athletic tracking-wider uppercase"
                  title="Search club site (Ctrl+K)"
                  aria-label="Search club site"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="hidden md:inline">Search</span>
                </button>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white font-athletic font-black text-sm uppercase tracking-wider shadow-sm transition-transform active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4 text-[#F5D000]" />
                  <span>{t.nav.supportClub}</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden inline-flex items-center justify-center p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl">
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
                      className={`px-3 py-2.5 rounded-lg text-sm font-athletic font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#08783E]/10 text-[#08783E] border-l-2 border-[#08783E]'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[#08783E]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-[11px] uppercase tracking-widest text-slate-500 font-athletic font-bold mb-2">
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
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-slate-700 hover:text-[#08783E] text-xs font-semibold"
                      >
                        <Icon className="w-4 h-4 text-[#08783E]" />
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#08783E] text-white font-athletic font-black text-base uppercase tracking-wider"
                >
                  <HeartHandshake className="w-5 h-5 text-[#F5D000]" />
                  <span>{t.nav.supportClub} (M-Pesa)</span>
                </Link>
                <Link
                  href="/sponsors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-800 font-athletic font-bold text-base uppercase tracking-wider"
                >
                  <span>{t.hero.partnerWithUs}</span>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Clean Crisp Footer - White/Light Neutral dominant with minimal green & yellow accents */}
        <footer className="bg-slate-50 text-slate-700 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Column 1: Identity & Crest */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ClubCrest size={60} customCrestUrl={settings.crestUrl} />
                  <div>
                    <h3 className="font-athletic text-2xl font-black uppercase tracking-wider text-slate-900">
                      {settings.clubName}
                    </h3>
                    <p className="text-xs font-athletic font-bold uppercase tracking-widest text-[#08783E]">
                      EST. {settings.establishedYear} • WARRIOR SPIRIT
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {settings.clubInfo.aboutSummary}
                </p>
                <p className="text-xs font-athletic font-bold uppercase tracking-wider text-[#08783E]">
                  “{settings.tagline}”
                </p>
              </div>

              {/* Column 2: Football & Club Links */}
              <div>
                <h4 className="font-athletic text-base font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#08783E]"></span>
                  Football & Club
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li>
                    <Link href="/about" className="hover:text-[#08783E] transition">
                      About the Club & History (Est. 2024)
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="hover:text-[#08783E] transition">
                      First Team Squad & Technical Bench
                    </Link>
                  </li>
                  <li>
                    <Link href="/fixtures" className="hover:text-[#08783E] transition">
                      Fixtures, Results & Match Centre
                    </Link>
                  </li>
                  <li>
                    <Link href="/standings" className="hover:text-[#08783E] transition">
                      Official League Standings
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="hover:text-[#08783E] transition">
                      Club News & Match Reports
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="hover:text-[#08783E] transition">
                      Photography & Media Gallery
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Commercial & Community */}
              <div>
                <h4 className="font-athletic text-base font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F5D000]"></span>
                  Commercial & Community
                </h4>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li>
                    <Link href="/sponsors" className="hover:text-[#08783E] transition">
                      Sponsorship Packages & Partnership
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="hover:text-[#08783E] transition">
                      Support the Club (M-Pesa Campaigns)
                    </Link>
                  </li>
                  <li>
                    <Link href="/transparency" className="hover:text-[#08783E] transition">
                      Public Financial Transparency
                    </Link>
                  </li>
                  <li>
                    <Link href="/membership" className="hover:text-[#08783E] transition">
                      Supporter Membership Registration
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruitment" className="hover:text-[#08783E] transition">
                      Player Recruitment & Trials
                    </Link>
                  </li>
                  <li>
                    <Link href="/merchandise" className="hover:text-[#08783E] transition">
                      Official Club Merchandise
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="hover:text-[#08783E] transition">
                      Club Events & Outreach Calendar
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: Official Contact Details */}
              <div>
                <h4 className="font-athletic text-base font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#08783E]"></span>
                  Official Club Contact
                </h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#08783E] shrink-0 mt-1" />
                    <span>{settings.physicalAddress || 'Nginda, Kenya'}</span>
                  </div>
                  {settings.contactPhone ? (
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#08783E] shrink-0" />
                      <span>{settings.contactPhone}</span>
                    </div>
                  ) : null}
                  {settings.contactEmail ? (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#08783E] shrink-0" />
                      <span>{settings.contactEmail}</span>
                    </div>
                  ) : null}
                  <div className="pt-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#08783E] hover:bg-[#063B25] text-white font-athletic font-bold text-xs uppercase tracking-wider transition shadow-sm"
                    >
                      Send Official Inquiry
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                © {new Date().getFullYear()} {settings.clubName} (Est. {settings.establishedYear}). All rights reserved.
              </p>
              <p className="text-slate-500">
                One Team. One Community. One Warrior Spirit.
              </p>
            </div>
          </div>
        </footer>

        {/* Global Command Palette / Search Dialog */}
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </LocaleContext.Provider>
  );
}
