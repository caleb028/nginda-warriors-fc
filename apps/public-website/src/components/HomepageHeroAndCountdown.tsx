'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <section className="relative overflow-hidden bg-black text-white border-b border-[#262626]">
      {/* Team Photograph Background (When Uploaded) */}
      {activeSlide.imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-25"
          style={{ backgroundImage: `url(${activeSlide.imageUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 pitch-grid-bg opacity-50" aria-hidden="true" />
      )}

      {/* Dark Gradient Overlay for Supreme Contrast & Readability */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-[#0A0A0A]/90"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDE100]/10 border border-[#FDE100]/30 text-[#FDE100] text-xs font-athletic font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE100]" />
              <span>OFFICIAL DIGITAL PLATFORM • EST. {settings.establishedYear}</span>
            </div>

            <h1 className="font-athletic text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white">
              {activeSlide.headline || settings.clubName}
            </h1>

            <p className="font-athletic text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#FDE100]">
              “{activeSlide.tagline || 'One Team. One Community. One Warrior Spirit.'}”
            </p>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {activeSlide.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={activeSlide.primaryCtaHref || '/about'}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#FDE100] hover:bg-[#FFE600] text-black font-athletic font-black text-lg uppercase tracking-wider shadow-xl transition-all active:scale-95"
              >
                <span>{activeSlide.primaryCtaLabel || 'Explore Our Club'}</span>
                <ArrowRight className="w-5 h-5 text-black" />
              </Link>

              <Link
                href={activeSlide.secondaryCtaHref || '/sponsors'}
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1F1F1F] text-white border-2 border-[#262626] hover:border-[#FDE100] font-athletic font-bold text-lg uppercase tracking-wider transition"
              >
                <Shield className="w-5 h-5 text-[#FDE100]" />
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
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#FDE100] text-slate-300 hover:text-black border border-[#262626] transition"
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
                        idx === currentIndex ? 'w-8 bg-[#FDE100]' : 'w-2.5 bg-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                  className="p-2 rounded-lg bg-[#141414] hover:bg-[#FDE100] text-slate-300 hover:text-black border border-[#262626] transition"
                  aria-label="Next hero slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Official Crest Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0A0A0A]/95 border-2 border-[#262626] shadow-2xl group hover:border-[#FDE100] transition-all flex items-center justify-center">
              <ClubCrest
                size={220}
                customCrestUrl={settings.crestUrl}
                alt={`${settings.clubName} Official Crest`}
                className="w-auto h-auto max-h-56 max-w-full drop-shadow-xl"
              />
            </div>
            <p className="mt-4 text-xs font-athletic font-black uppercase tracking-widest text-[#FDE100] text-center">
              OFFICIAL CLUB IDENTITY • EST. {settings.establishedYear}
            </p>
          </div>
        </div>

        {/* Looping Scroll Indicator (Hero Section) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden sm:flex flex-col items-center justify-center pt-8 pb-3"
        >
          <span className="text-[11px] font-athletic font-bold uppercase tracking-widest text-[#FDE100] mb-2 drop-shadow-sm">
            Scroll to Explore
          </span>
          <div className="w-5 h-9 rounded-full border-2 border-[#FDE100]/40 flex items-start justify-center p-1 relative overflow-hidden bg-black/40 backdrop-blur-xs">
            <motion.div
              animate={{ y: [-12, 16, -12] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-2.5 bg-[#FDE100] rounded-full shadow-[0_0_8px_#FDE100]"
            />
          </div>
        </motion.div>
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
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FDE100]/10 text-[#FDE100] border border-[#FDE100]/30 font-athletic font-black text-xs uppercase tracking-wider">
        <Clock className="w-4 h-4 text-[#FDE100]" />
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
          className="bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1.5"
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
