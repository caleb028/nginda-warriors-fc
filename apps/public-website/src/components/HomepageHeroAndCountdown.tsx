'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClubCrest, ClubSettings } from '@nginda-warriors/shared';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Shield, Sparkles } from 'lucide-react';

export function HomepageHeroSlideshow({
  settings,
  slides,
}: {
  settings: ClubSettings;
  slides: ClubSettings['heroSlides'];
}) {
  const activeSlides = slides.length > 0 ? slides.slice(0, 5) : settings.heroSlides.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const activeSlide = activeSlides[currentIndex] || {
    id: 'default',
    headline: settings.clubName,
    tagline: settings.tagline || 'One Team. One Community. One Warrior Spirit.',
    description: settings.clubInfo.aboutSummary,
    imageUrl: '',
    primaryCtaLabel: 'Explore Our Club',
    primaryCtaHref: '/about',
    secondaryCtaLabel: 'Partner With Us',
    secondaryCtaHref: '/sponsors',
    isVisible: true,
    displayOrder: 1,
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-200">
      {/* Team Photograph Background (When Uploaded) */}
      {activeSlide.imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-20"
          style={{ backgroundImage: `url(${activeSlide.imageUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 pitch-grid-bg opacity-40" aria-hidden="true" />
      )}

      {/* Light Gradient Overlay for Maximum Readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-slate-50/90"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08783E]/10 border border-[#08783E]/20 text-[#08783E] text-xs font-athletic font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D5AA00]" />
              <span>OFFICIAL CLUB PLATFORM • EST. {settings.establishedYear}</span>
            </div>

            <h1 className="font-pedals font-athletic text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-slate-950">
              {activeSlide.headline || settings.clubName}
            </h1>

            <p className="font-athletic text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#08783E]">
              “{activeSlide.tagline || 'One Team. One Community. One Warrior Spirit.'}”
            </p>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {activeSlide.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={activeSlide.primaryCtaHref || '/about'}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#08783E] hover:bg-[#063B25] text-white font-athletic font-black text-lg uppercase tracking-wider shadow-md transition-transform active:scale-95"
              >
                <span>{activeSlide.primaryCtaLabel || 'Explore Our Club'}</span>
                <ArrowRight className="w-5 h-5 text-[#F5D000]" />
              </Link>

              <Link
                href={activeSlide.secondaryCtaHref || '/sponsors'}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-[#08783E] font-athletic font-bold text-lg uppercase tracking-wider transition"
              >
                <Shield className="w-5 h-5 text-[#08783E]" />
                <span>{activeSlide.secondaryCtaLabel || 'Partner With Us'}</span>
              </Link>
            </div>

            {/* Slide Controls when multiple slides are active */}
            {activeSlides.length > 1 && (
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
                  }
                  className="p-2 rounded-lg bg-slate-100 hover:bg-[#08783E] text-slate-700 hover:text-white transition"
                  aria-label="Previous hero slide"
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
                      className={`h-2.5 rounded-full transition-all ${
                        idx === currentIndex ? 'w-8 bg-[#08783E]' : 'w-2.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-[#08783E] text-slate-700 hover:text-white transition"
                  aria-label="Next hero slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Official Crest Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative p-8 rounded-full bg-slate-50 border-2 border-slate-200 shadow-xl group hover:border-[#08783E]/40 transition-all">
              <ClubCrest
                size={220}
                customCrestUrl={settings.crestUrl}
                alt={`${settings.clubName} Official Crest`}
              />
            </div>
            <p className="mt-4 text-xs font-athletic font-bold uppercase tracking-widest text-[#08783E] text-center">
              OFFICIAL CLUB IDENTITY • EST. {settings.establishedYear}
            </p>
          </div>
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
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [kickoffIso]);

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#08783E]/10 text-[#08783E] font-athletic font-black text-xs uppercase tracking-wider">
        <Clock className="w-4 h-4" />
        <span>Match Time Reached</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center" aria-label="Match kickoff countdown">
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEC', value: timeLeft.seconds },
      ].map((unit) => (
        <div
          key={unit.label}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
        >
          <span className="block font-pedals font-athletic text-2xl font-black text-slate-900 leading-none">
            {String(unit.value).padStart(2, '0')}
          </span>
          <span className="block text-[10px] font-bold text-slate-500 tracking-wider mt-0.5">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
