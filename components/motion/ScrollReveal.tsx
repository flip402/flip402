'use client';

import { motion, type MotionProps, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Vertical offset while out of view */
  y?: number;
  /** Horizontal offset while out of view */
  x?: number;
  delay?: number;
  duration?: number;
  /** Set false for the reveal to replay every time the element enters the viewport */
  once?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'ul' | 'li';
} & Pick<MotionProps, 'viewport'>;

/**
 * Bidirectional scroll reveal. By default replays whenever element re-enters
 * the viewport (scroll up/down both trigger) — matches the requested behavior
 * "блоки появляются и при скролле вверх тоже".
 */
export function ScrollReveal({
  children,
  y = 32,
  x = 0,
  delay = 0,
  duration = 0.6,
  once = false,
  className,
  as = 'div',
  viewport,
}: Props) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y, x, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={viewport ?? { once, margin: '-10% 0px -10% 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger wrapper: children reveal sequentially. */
export function ScrollRevealStagger({
  children,
  className,
  stagger = 0.08,
  once = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] },
  },
};
