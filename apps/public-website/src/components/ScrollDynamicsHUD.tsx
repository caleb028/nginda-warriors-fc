'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ScrollDynamicsHUD
 * Isolated, zero-overhead scroll progress & navigation dynamics controller.
 * Directly animates GPU transforms via requestAnimationFrame refs so the
 * parent shell and active page components NEVER re-render on scroll.
 */
export function ScrollDynamicsHUD() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);

  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const showScrollTopRef = useRef(false);
  const showScrollDownRef = useRef(true);

  // Instant route navigation flash indicator (runs only on route change)
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 280);
    return () => clearTimeout(timer);
  }, [pathname]);

  // High-performance 60/120fps passive RAF scroll listener with ZERO parent re-renders
  useEffect(() => {
    let ticking = false;

    const updateScrollDOM = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const docHeight = scrollHeight - innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100)) : 0;

      // 1. Hardware-accelerated top reading progress bar via GPU scaleX
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress / 100})`;
      }

      // 2. Direct SVG ring stroke-dashoffset update (circumference = 119.38)
      if (ringRef.current) {
        const offset = Math.max(0, 119.38 - (119.38 * progress) / 100);
        ringRef.current.style.strokeDashoffset = `${offset}`;
      }

      // 3. Threshold state transitions: ONLY trigger React state when crossing boundaries
      const shouldShowTop = currentScrollY > 240;
      if (shouldShowTop !== showScrollTopRef.current) {
        showScrollTopRef.current = shouldShowTop;
        setShowScrollTop(shouldShowTop);
      }

      const shouldShowDown = progress < 88;
      if (shouldShowDown !== showScrollDownRef.current) {
        showScrollDownRef.current = shouldShowDown;
        setShowScrollDown(shouldShowDown);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDOM);
        ticking = true;
      }
    };

    updateScrollDOM();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Route Navigation Transition Energy Beam */}
      {isNavigating && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[3px] z-[70] bg-gradient-to-r from-transparent via-[#FDE100] to-transparent animate-routeBar shadow-[0_0_12px_#FDE100] pointer-events-none will-change-transform"
        />
      )}

      {/* Top Reading Scroll Progress Bar (Hardware GPU scaleX) */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] bg-[#FDE100] shadow-[0_0_8px_#FDE100] origin-left pointer-events-none will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Floating Dynamic Scroll Controller HUD (Elevated safely above mobile bottom nav) */}
      <div
        className={`fixed bottom-20 xl:bottom-8 right-4 sm:right-6 z-40 flex flex-col items-center gap-2 transition-all duration-300 pointer-events-auto ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="relative group w-12 h-12 rounded-full bg-black/90 hover:bg-black border border-[#FDE100]/40 hover:border-[#FDE100] shadow-[0_8px_24px_rgba(0,0,0,0.6)] flex items-center justify-center text-white hover:text-[#FDE100] transition-all duration-200 active:scale-90"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          {/* SVG Progress Circle Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="#262626"
              strokeWidth="2.5"
            />
            <circle
              ref={ringRef}
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke="#FDE100"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="119.38"
              strokeDashoffset="119.38"
            />
          </svg>

          <ChevronUp className="w-5 h-5 text-[#FDE100] transition-transform duration-200 group-hover:-translate-y-0.5" />
        </button>

        {/* Quick Scroll to Bottom Button */}
        {showScrollDown && (
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
              })
            }
            className="w-8 h-8 rounded-full bg-black/80 hover:bg-black border border-[#333333] hover:border-[#FDE100]/60 text-slate-300 hover:text-[#FDE100] shadow-md flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105"
            aria-label="Scroll to bottom of page"
            title="Scroll to bottom"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
}
