'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  /** The number the chain rolled. Set as soon as `revealing` phase begins. */
  target: number;
};

/**
 * Slot-machine reveal: 3 digit slots cycle through 0–9 and settle, in turn,
 * on the digits of `target`. Hundreds settle first (drama: which range we
 * land in), then tens, then ones (the punchline). Total ~2.4 s — fits inside
 * the 2.8 s reveal window.
 */
const STOP_AT_MS = [700, 1500, 2300]; // hundreds, tens, ones
const TICK_MS = 65;

export function RollReveal({ target }: Props) {
  const targetDigits: [number, number, number] = [
    Math.floor(target / 100) % 10,
    Math.floor(target / 10) % 10,
    target % 10,
  ];

  const [digits, setDigits] = useState<[number, number, number]>([0, 0, 0]);
  const [stopped, setStopped] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const startTs = useRef<number>(performance.now());

  useEffect(() => {
    startTs.current = performance.now();
    let raf = 0;
    let lastTick = 0;
    const stoppedFlags: [boolean, boolean, boolean] = [false, false, false];

    const loop = (t: number) => {
      const elapsed = t - startTs.current;

      // Mark slots stopped one by one
      for (let i = 0; i < 3; i++) {
        if (!stoppedFlags[i] && elapsed >= STOP_AT_MS[i]!) {
          stoppedFlags[i] = true;
          setStopped([stoppedFlags[0]!, stoppedFlags[1]!, stoppedFlags[2]!]);
          setDigits((prev) => {
            const next = [...prev] as [number, number, number];
            next[i] = targetDigits[i]!;
            return next;
          });
        }
      }

      // Tick the still-spinning slots
      if (t - lastTick >= TICK_MS) {
        lastTick = t;
        setDigits((prev) => {
          const next = [...prev] as [number, number, number];
          for (let i = 0; i < 3; i++) {
            if (!stoppedFlags[i]) {
              next[i] = Math.floor(Math.random() * 10);
            }
          }
          return next;
        });
      }

      if (!stoppedFlags.every(Boolean)) {
        raf = requestAnimationFrame(loop);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="flex flex-col items-stretch gap-2.5 sm:gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim sm:text-[11px]">
          Rolling on chain
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-mint sm:text-[11px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-mint/70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
          </span>
          live
        </span>
      </div>

      {/* Reel */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {digits.map((d, i) => (
          <DigitSlot key={i} digit={d} stopped={stopped[i]!} />
        ))}
      </div>

      <div className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim sm:text-[11px]">
        protocol picks a number from <span className="text-text-mute">1</span>{' '}
        to <span className="text-text-mute">402</span>
      </div>
    </div>
  );
}

function DigitSlot({ digit, stopped }: { digit: number; stopped: boolean }) {
  return (
    <div
      className={`relative flex h-16 items-center justify-center overflow-hidden rounded-xl border bg-void/50 sm:h-20 sm:rounded-2xl ${
        stopped
          ? 'border-electric shadow-[0_0_0_4px_rgba(76,141,255,0.15),0_0_28px_-6px_rgba(76,141,255,0.6)]'
          : 'border-border-bright'
      }`}
    >
      {/* Subtle scan lines */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          background:
            'repeating-linear-gradient(180deg, transparent 0 3px, rgba(255,255,255,0.6) 3px 4px)',
        }}
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${digit}-${stopped}`}
          initial={{ y: stopped ? 0 : '-100%', opacity: stopped ? 1 : 0 }}
          animate={
            stopped
              ? { y: 0, opacity: 1, scale: [1, 1.18, 1] }
              : { y: 0, opacity: 1 }
          }
          exit={{ y: '110%', opacity: 0 }}
          transition={
            stopped
              ? { duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }
              : { duration: 0.05, ease: 'linear' }
          }
          className={`relative font-display text-[44px] font-bold leading-none tabular-nums sm:text-[56px] ${
            stopped ? 'text-text' : 'text-text-mute'
          }`}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
