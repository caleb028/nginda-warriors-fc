'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
 * Viewport-triggered scroll animations with custom luxury cubic-bezier easing
 * [0.16, 1, 0.3, 1] and viewport: { once: false }, animating gracefully both
 * when scrolling down into view and when returning up.
 */
export function MotionReveal({
  children,
  delay = 0,
  y = 28,
  scale = 0.98,
  className = '',
  once = false,
  amount = 0.15,
}: MotionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{
        duration: 0.7,
        delay,
        ease: LUXURY_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer & StaggerItem
 * Creates staggered waterfall animations across grids and card collections.
 */
export function StaggerContainer({
  children,
  className = '',
  once = false,
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.65,
            ease: LUXURY_EASE,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * MotionAccordion
 * Smooth motion-driven accordion expansion for FAQs and expandable drawers.
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
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: LUXURY_EASE }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
