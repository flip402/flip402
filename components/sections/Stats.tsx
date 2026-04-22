'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useFlipHistory } from '@/hooks/useFlipHistory';
import { FLIP_SOL } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { ScrollReveal, ScrollRevealStagger, staggerItem } from '@/components/motion/ScrollReveal';

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return n;
}

type TileProps = {
  label: string;
  value: string;
  className?: string;
  accent?: 'ice' | 'default';
  sub?: string;
};

function Tile({ label, value, className, accent = 'default', sub }: TileProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{
        y: -3,
        borderColor: 'rgba(168,197,255,0.25)',
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className={cn('glass relative overflow-hidden rounded-2xl p-6', className)}
    >
      {accent === 'ice' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(168,197,255,0.22), transparent 70%)',
          }}
        />
      )}
      <div className="relative">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
          {label}
        </div>
        <div
          className={cn(
            'mt-3 font-display text-4xl font-bold tabular-nums md:text-5xl',
            accent === 'ice' ? 'ice-text' : 'text-text'
          )}
        >
          {value}
        </div>
        {sub && <div className="mt-2 font-mono text-[11px] text-text-dim">{sub}</div>}
      </div>
    </motion.div>
  );
}

export function Stats() {
  const { history } = useFlipHistory();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' });

  const totalFlips = history.length;
  const totalBurned = totalFlips * FLIP_SOL;
  const wins = history.filter((h) => h.isWin).length;

  const animFlips = useCountUp(totalFlips, inView);
  const animBurned = useCountUp(totalBurned, inView);

  return (
    <section id="stats" className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <ScrollReveal as="div" className="mb-8 flex items-end justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
            Your dossier
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
            The numbers don&apos;t lie.
          </h2>
        </div>
      </ScrollReveal>

      <ScrollRevealStagger
        className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-[auto_auto]"
        stagger={0.08}
      >
        <div ref={ref} className="contents">
          <Tile
            label="Total flips"
            value={Math.floor(animFlips).toString()}
            className="md:col-span-2 md:row-span-2"
            sub="Your lifetime attempts on this device"
          />
          <Tile
            label="Total burned"
            value={`${animBurned.toFixed(3)} SOL`}
            accent="ice"
            sub="Cumulative wagered"
          />
          <Tile label="Wins" value={wins.toString()} sub={wins === 0 ? 'None yet.' : 'Rare.'} />
          <Tile label="Biggest roll gap" value={maxGap(history)} sub="|pick − rolled|" />
          <Tile label="House edge" value="1 / 402" accent="ice" sub="You already know" />
        </div>
      </ScrollRevealStagger>
    </section>
  );
}

function maxGap(history: Array<{ pick: number; rolled: number }>) {
  if (!history.length) return '—';
  const gap = history.reduce(
    (acc, h) => Math.max(acc, Math.abs(h.pick - h.rolled)),
    0
  );
  return gap.toString();
}
