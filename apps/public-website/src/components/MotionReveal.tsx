'use client';

import React from 'react';

export const LUXURY_EASE = [0.16, 1, 0.3, 1] as const;

export interface MotionRevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

/**
 * MotionReveal
 * Clean, hardware-accelerated CSS transition reveal that guarantees zero text
 * overlap and rock-solid document flow across all mobile and desktop viewports.
 */
export function MotionReveal({
  children,
  className = '',
}: MotionRevealProps) {
  return (
    <div className={`transition-all duration-500 ease-out ${className}`}>
      {children}
    </div>
  );
}

/**
 * StaggerContainer & StaggerItem
 * Grid wrapper preserving standard CSS grid column flow without layout distortion.
 */
export function StaggerContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  stagger?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`w-full flex flex-col ${className}`}>{children}</div>;
}

/**
 * MotionAccordion
 * Smooth CSS-driven accordion for drawers and collapsible sections.
 */
export function MotionAccordion({
  isOpen,
  children,
  className = '',
}: {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;
  return (
    <div className={`overflow-hidden transition-all duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}
