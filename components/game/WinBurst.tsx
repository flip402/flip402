'use client';

import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  active: boolean;
};

/**
 * Win celebration overlay — mint halo + ring burst + sparkling dots.
 * Currently only triggers when a flip is a win; since the backend always
 * produces a loss right now, this is wired but dormant.
 */
export function WinBurst({ active }: Props) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="winburst"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          {/* Mint halo pulse */}
          <motion.span
            aria-hidden
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut', repeat: 2 }}
            className="absolute h-48 w-48 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(74,222,128,0.55), transparent 60%)',
            }}
          />
          {/* Ring burst */}
          <motion.span
            aria-hidden
            initial={{ scale: 0.4, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="absolute h-48 w-48 rounded-full border-2 border-mint"
          />
          {/* Sparkles */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const r = 120;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.span
                key={i}
                aria-hidden
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{
                  x,
                  y,
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.6],
                }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.02,
                  ease: 'easeOut',
                }}
                className="absolute h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_10px_#4ade80]"
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
