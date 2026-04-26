'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_VISIBLE_MS = 1600;
const FADE_MS = 700;

export function Preloader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const minDone = new Promise<void>((r) =>
      window.setTimeout(r, MIN_VISIBLE_MS)
    );
    const loadDone = new Promise<void>((r) => {
      if (document.readyState === 'complete') {
        r();
      } else {
        window.addEventListener('load', () => r(), { once: true });
      }
    });
    Promise.all([minDone, loadDone]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(8px)',
            transition: { duration: FADE_MS / 1000, ease: 'easeInOut' },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
        >
          {/* Deep halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(76,141,255,0.45), transparent 65%)',
            }}
          />

          {/* Rotating conic rings — two, counter-rotating */}
          <motion.span
            aria-hidden
            className="absolute h-[320px] w-[320px] rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(76,141,255,0.6) 60deg, transparent 120deg, transparent 360deg)',
              maskImage:
                'radial-gradient(circle, transparent 60%, #000 62%, #000 100%)',
              WebkitMaskImage:
                'radial-gradient(circle, transparent 60%, #000 62%, #000 100%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />
          <div className="relative flex flex-col items-center gap-7">
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: 1,
              }}
              transition={{
                opacity: { duration: 0.4 },
                scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative flex h-20 w-20 items-center justify-center"
            >
              <span
                aria-hidden
                className="absolute -inset-2 rounded-2xl blur-xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(76,141,255,0.55), transparent 70%)',
                }}
              />
              <span className="relative flex h-20 w-20 overflow-hidden rounded-2xl">
                <Image
                  src="/flip402-mark.png"
                  alt="FLIP402"
                  width={160}
                  height={160}
                  priority
                  className="h-full w-full object-cover"
                />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-3xl font-bold tracking-tight"
            >
              FLIP<span className="grad-ice">402</span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative h-[3px] w-[220px] overflow-hidden rounded-full bg-white/[0.06]"
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #4c8dff, #a8c5ff, #e8f0ff)',
                  boxShadow: '0 0 14px rgba(168,197,255,0.6)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: MIN_VISIBLE_MS / 1000,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-[0.32em] text-text-dim"
            >
              connecting · x402
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
