'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ClubCrest, ClubSettings, Fixture } from '@nginda-warriors/shared';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Shield, Sparkles, Trophy } from 'lucide-react';

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export function HomepageHeroSlideshow({
  settings,
  slides,
}: {
  settings: ClubSettings;
  slides: ClubSettings['heroSlides'];
}) {
  const activeSlides = slides.length > 0 ? slides.slice(0, 5) : settings.heroSlides.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch Swipe Gesture State for Mobile (RB Leipzig smooth swipe behavior)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> previous slide
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = activeSlides[currentIndex] || {
    id: 'default',
    headline: settings.clubName,
    tagline: settings.tagline || 'One Team. One Community. One Warrior Spirit.',
    description: settings.clubInfo.aboutSummary,
    imageUrl: '',
    primaryCtaLabel: 'Read article',
    primaryCtaHref: '/about',
    secondaryCtaLabel: 'Partner With Us',
    secondaryCtaHref: '/sponsors',
    isVisible: true,
    displayOrder: 1,
  };

  return (
    <section
      className="relative overflow-hidden bg-black text-white border-b border-[#222222]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE VIEWPORT: RB Leipzig & Al-Hilal Signature Full-Bleed Card
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden relative w-full aspect-[4/5] sm:aspect-[16/10] min-h-[540px] max-h-[720px] bg-black flex flex-col justify-end overflow-hidden">
        {/* Full-Vibrancy Image (Al-Hilal style: 100% crisp, zero washed-out veil) */}
        <div
          key={activeSlide.id}
          className="absolute inset-0 z-0 transition-opacity duration-700 ease-out"
        >
            {activeSlide.imageUrl ? (
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.headline || settings.clubName}
                className="w-full h-full object-cover object-top select-none"
              />
            ) : (
              <div className="w-full h-full pitch-grid-bg opacity-40 flex items-center justify-center">
                <ClubCrest size={180} customCrestUrl={settings.crestUrl} />
              </div>
            )}
        </div>

        {/* Al-Hilal Multi-Stage Deep Black Gradient Fade (Smooth transition into pure #000000) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 80%, #000000 100%)',
          }}
          aria-hidden="true"
        />

        {/* Top Vignette for Mobile Bar Contrast */}
        <div
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Mobile Story Content Anchored on Pure Black Canvas (RB Leipzig style) */}
        <div className="relative z-20 px-5 pb-7 pt-12 space-y-3.5">
          {/* Category & Date Kicker */}
          <div className="flex items-center gap-2 font-wide text-[11px] font-bold uppercase tracking-widest text-slate-300">
            <span className="text-[#FDE100]">{activeSlide.tagline || 'Match Reports'}</span>
            <span className="text-slate-500">•</span>
            <span suppressHydrationWarning>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
          </div>

          {/* Heavy Athletic Headline in Al-Hilal Font */}
          <h1 className="font-athletic text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-md">
            {activeSlide.headline || settings.clubName}
          </h1>

          {/* Bottom Action Row: Pill Button + Dot Indicators */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <Link
              href={activeSlide.primaryCtaHref || '/about'}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-xs uppercase tracking-wider shadow-xl transition-all active:scale-95"
            >
              <span>{activeSlide.primaryCtaLabel || 'Read article'}</span>
              <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
            </Link>

            {/* RB Leipzig Pagination Dots (Horizontal dashes with active pill) */}
            {activeSlides.length > 1 && (
              <div className="flex items-center gap-1.5" aria-label="Hero slide indicators">
                {activeSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-7 bg-[#FDE100] shadow-sm'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DESKTOP VIEWPORT: Cinematic Wide Presentation with Al-Hilal Fade
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block relative min-h-[600px] w-full overflow-hidden bg-black">
        {/* Full Vibrancy Background Photograph */}
        <div
          key={activeSlide.id}
          className="absolute inset-0 z-0 transition-opacity duration-700 ease-out"
        >
            {activeSlide.imageUrl ? (
              <img
                src={activeSlide.imageUrl}
                alt={activeSlide.headline || settings.clubName}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full pitch-grid-bg opacity-35" />
            )}
        </div>

        {/* Deep Black Horizontal & Bottom Gradients (Al-Hilal Black Backdrop Fade) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.85) 85%, #000000 100%)',
          }}
          aria-hidden="true"
        />

        {/* Desktop Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 min-h-[600px] flex flex-col justify-center">
          <div className="max-w-3xl space-y-5">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414]/90 border border-[#262626] font-wide text-xs font-bold uppercase tracking-widest text-[#FDE100] shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FDE100]" />
              <span>{activeSlide.tagline || 'Official Club Announcement'}</span>
            </div>

            {/* Massive Al-Hilal Font Headline */}
            <h1 className="font-athletic text-5xl xl:text-6xl font-black uppercase tracking-tight leading-[0.98] text-white">
              {activeSlide.headline || settings.clubName}
            </h1>

            {/* Description */}
            <p className="font-body text-base xl:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {activeSlide.description}
            </p>

            {/* Dual CTA Buttons (RB Leipzig Pill Styling) */}
            <div className="pt-3 flex items-center gap-4">
              <Link
                href={activeSlide.primaryCtaHref || '/about'}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <span>{activeSlide.primaryCtaLabel || 'Read article'}</span>
                <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
              </Link>

              <Link
                href={activeSlide.secondaryCtaHref || '/sponsors'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#141414]/90 hover:bg-[#202020] text-white border border-[#333333] hover:border-[#FDE100] font-athletic font-bold text-sm uppercase tracking-wider backdrop-blur-md transition"
              >
                <Shield className="w-4 h-4 text-[#FDE100]" />
                <span>{activeSlide.secondaryCtaLabel || 'Partner With Us'}</span>
              </Link>
            </div>

            {/* Desktop Slide Indicators & Controls */}
            {activeSlides.length > 1 && (
              <div className="pt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
                  }
                  className="p-2 rounded-full bg-[#141414]/80 hover:bg-[#FDE100] text-slate-300 hover:text-black border border-[#262626] transition active:scale-95"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {activeSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-8 bg-[#FDE100] shadow-[0_0_8px_#FDE100]'
                          : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="p-2 rounded-full bg-[#141414]/80 hover:bg-[#FDE100] text-slate-300 hover:text-black border border-[#262626] transition active:scale-95"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * RbMatchRail
 * RB Leipzig Signature Horizontal Match Ticker & Fixtures Rail
 * Directly mirrors the peeking swipeable match strip on RB Leipzig's mobile site (Image 2)
 */
export function RbMatchRail({
  settings,
  latestResult,
  nextMatch,
  upcomingFixtures = [],
}: {
  settings: ClubSettings;
  latestResult?: Fixture | null;
  nextMatch?: Fixture | null;
  upcomingFixtures?: Fixture[];
}) {
  const formatKickoffDate = (isoString?: string) => {
    if (!isoString) return 'TBD';
    const date = new Date(isoString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const monthName = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayNum = String(date.getDate()).padStart(2, '0');
    return `${dayName}, ${monthName} ${dayNum}`;
  };

  const formatKickoffTime = (isoString?: string) => {
    if (!isoString) return 'TBD';
    return new Date(isoString).toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Nairobi',
    });
  };

  return (
    <section className="bg-[#050505] border-b border-[#222222] py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Horizontal Snap-Scrollable Rail */}
        <div className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 pt-1 -mx-3 px-3 sm:mx-0 sm:px-0">
          {/* 1. PREVIOUS MATCH RESULT CARD (Peeking from Left) */}
          {latestResult ? (
            <div className="shrink-0 snap-center w-[270px] sm:w-[300px] rounded-2xl bg-[#0F0F0F] border border-[#262626] p-4 flex flex-col justify-between hover:border-[#FDE100]/40 transition group shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-wide text-[10px] font-bold uppercase tracking-wider">
                  Full Time • Result
                </span>
                <span className="font-wide text-[10px] text-slate-400 font-bold uppercase">
                  {formatKickoffDate(latestResult.kickoffTimestamp)}
                </span>
              </div>

              {/* Match Teams & Score Line */}
              <div className="py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ClubCrest size={32} customCrestUrl={settings.crestUrl} className="w-8 h-8 object-contain" />
                  <span className="font-athletic text-sm font-bold uppercase text-white truncate max-w-[80px]">
                    {settings.shortName}
                  </span>
                </div>
                <div className="font-athletic text-xl font-black text-[#FDE100] px-2.5 py-0.5 rounded bg-black border border-[#262626]">
                  {latestResult.homeScore} - {latestResult.awayScore}
                </div>
                <div className="flex items-center gap-2 flex-row-reverse text-right">
                  {latestResult.opponentCrestUrl ? (
                    <img
                      src={latestResult.opponentCrestUrl}
                      alt={latestResult.opponentName}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] font-bold text-slate-400">
                      VS
                    </div>
                  )}
                  <span className="font-athletic text-sm font-bold uppercase text-white truncate max-w-[80px]">
                    {latestResult.opponentName}
                  </span>
                </div>
              </div>

              <Link
                href="/fixtures"
                className="mt-2 text-[11px] font-athletic font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#FDE100] flex items-center justify-between transition"
              >
                <span>Match Recap</span>
                <span>&rarr;</span>
              </Link>
            </div>
          ) : null}

          {/* 2. FEATURED / NEXT MATCH CARD (Center Highlight Card — Exactly like RB Leipzig) */}
          {nextMatch ? (
            <div className="shrink-0 snap-center w-[290px] sm:w-[340px] rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#121212] to-[#0A0A0A] border-2 border-[#FDE100] p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              {/* Subtle Pitch Diagonal Stripe Texture */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#FDE100]/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 mb-2 z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FDE100] text-black font-athletic font-black text-[10px] uppercase tracking-wider shadow-sm">
                  NEXT MATCH
                </span>
                <span className="font-wide text-[11px] text-[#FDE100] font-bold uppercase tracking-wider">
                  {nextMatch.isHome ? 'HOME' : 'AWAY'}
                </span>
              </div>

              {/* Crests with Diagonal Slash [Crest] / [Crest] */}
              <div className="py-2.5 flex items-center justify-center gap-4 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-1">
                    {nextMatch.isHome ? (
                      <ClubCrest size={46} customCrestUrl={settings.crestUrl} />
                    ) : nextMatch.opponentCrestUrl ? (
                      <img
                        src={nextMatch.opponentCrestUrl}
                        alt={nextMatch.opponentName}
                        className="w-11 h-11 object-contain drop-shadow"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-black border border-[#333333] flex items-center justify-center text-xs font-bold text-slate-400">
                        OPP
                      </div>
                    )}
                  </div>
                  <span className="font-athletic text-xs font-bold uppercase text-white truncate max-w-[85px]">
                    {nextMatch.isHome ? settings.shortName : nextMatch.opponentName}
                  </span>
                </div>

                <span className="font-athletic text-2xl font-black text-[#FDE100] opacity-80">
                  /
                </span>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-1">
                    {!nextMatch.isHome ? (
                      <ClubCrest size={46} customCrestUrl={settings.crestUrl} />
                    ) : nextMatch.opponentCrestUrl ? (
                      <img
                        src={nextMatch.opponentCrestUrl}
                        alt={nextMatch.opponentName}
                        className="w-11 h-11 object-contain drop-shadow"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-black border border-[#333333] flex items-center justify-center text-xs font-bold text-slate-400">
                        OPP
                      </div>
                    )}
                  </div>
                  <span className="font-athletic text-xs font-bold uppercase text-white truncate max-w-[85px]">
                    {!nextMatch.isHome ? settings.shortName : nextMatch.opponentName}
                  </span>
                </div>
              </div>

              {/* Match Kickoff Date & Time */}
              <div className="text-center my-1 z-10">
                <p className="font-wide text-xs font-extrabold uppercase tracking-widest text-white">
                  {formatKickoffDate(nextMatch.kickoffTimestamp)}
                </p>
                <p className="font-athletic text-sm font-black text-[#FDE100] mt-0.5">
                  {formatKickoffTime(nextMatch.kickoffTimestamp)} EAT
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#262626] flex items-center justify-between z-10">
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {nextMatch.venue || 'Nginda Stadium'}
                </span>
                <Link
                  href="/fixtures"
                  className="px-3 py-1 rounded-full bg-[#FDE100] text-black font-athletic font-black text-[10px] uppercase tracking-wider hover:bg-[#FFE600] transition active:scale-95 shadow-sm"
                >
                  Tickets & Info
                </Link>
              </div>
            </div>
          ) : null}

          {/* 3. FUTURE UPCOMING FIXTURES (Peeking on Right) */}
          {upcomingFixtures.slice(0, 3).map((fix) => (
            <div
              key={fix.id}
              className="shrink-0 snap-center w-[270px] sm:w-[300px] rounded-2xl bg-[#0F0F0F] border border-[#262626] p-4 flex flex-col justify-between hover:border-[#FDE100]/40 transition group shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-wide text-[10px] font-bold uppercase tracking-wider">
                  Upcoming Fixture
                </span>
                <span className="font-wide text-[10px] text-[#FDE100] font-bold uppercase">
                  {formatKickoffDate(fix.kickoffTimestamp)}
                </span>
              </div>

              {/* Teams Line */}
              <div className="py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ClubCrest size={32} customCrestUrl={settings.crestUrl} className="w-8 h-8 object-contain" />
                  <span className="font-athletic text-sm font-bold uppercase text-white truncate max-w-[80px]">
                    {settings.shortName}
                  </span>
                </div>
                <span className="font-athletic text-base font-black text-slate-500">
                  VS
                </span>
                <div className="flex items-center gap-2 flex-row-reverse text-right">
                  {fix.opponentCrestUrl ? (
                    <img
                      src={fix.opponentCrestUrl}
                      alt={fix.opponentName}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] font-bold text-slate-400">
                      VS
                    </div>
                  )}
                  <span className="font-athletic text-sm font-bold uppercase text-white truncate max-w-[80px]">
                    {fix.opponentName}
                  </span>
                </div>
              </div>

              <Link
                href="/fixtures"
                className="mt-2 text-[11px] font-athletic font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#FDE100] flex items-center justify-between transition"
              >
                <span>{formatKickoffTime(fix.kickoffTimestamp)} EAT</span>
                <span>Details &rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MatchKickoffCountdown({ kickoffIso }: { kickoffIso: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const update = () => {
      const diff = new Date(kickoffIso).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isPast: false,
      });
    };
    update();

    let id: ReturnType<typeof setInterval> | null = null;
    const startTimer = () => {
      if (!id) {
        id = setInterval(() => {
          if (typeof document === 'undefined' || document.visibilityState === 'visible') {
            update();
          }
        }, 1000);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        update();
        startTimer();
      } else if (id) {
        clearInterval(id);
        id = null;
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (id) clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [kickoffIso]);

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
        <Clock className="w-4 h-4 text-[#FDE100]" />
        <span>Match Time Reached</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center" aria-label="Match kickoff countdown" suppressHydrationWarning>
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEC', value: timeLeft.seconds },
      ].map((unit) => (
        <div
          key={unit.label}
          className="bg-[#141414] border border-[#262626] rounded-xl px-2.5 py-1.5"
        >
          <span className="block font-athletic text-2xl font-black text-white leading-none">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="block text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
