'use client';

import { useEffect } from 'react';

/**
 * PreventZoom
 * Intercepts ctrl+wheel and multi-touch touchmove events to prevent accidental
 * trackpad pinch-to-zoom gestures from distorting the responsive layout,
 * while keeping native vertical touch momentum scrolling completely fluid.
 */
export function PreventZoom() {
  useEffect(() => {
    // Intercept trackpad pinch gesture via ctrlKey + wheel
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Intercept multi-finger touch gestures that would zoom/pinch the page
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent gesturestart on Safari iOS
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('gesturestart', handleGestureStart, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  return null;
}
