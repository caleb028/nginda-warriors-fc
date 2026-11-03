'use client';

import { useEffect } from 'react';

/**
 * PreventZoom
 * Intercepts desktop trackpad ctrl+wheel pinch zoom gestures without
 * interfering with native touch scrolling or blocking mobile compositor threads.
 */
export function PreventZoom() {
  useEffect(() => {
    // Intercept desktop trackpad pinch gesture via ctrlKey + wheel (only if ctrlKey is pressed)
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Prevent Safari iOS gesturestart without blocking standard touch scrolling
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('gesturestart', handleGestureStart, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('gesturestart', handleGestureStart);
    };
  }, []);

  return null;
}
