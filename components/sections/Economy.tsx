'use client';

import { ScrollReveal, ScrollRevealStagger, staggerItem } from '@/components/motion/ScrollReveal';
import { motion } from 'framer-motion';

const STATS = [
  {
    big: '$2.4M',
    sub: 'daily x402 transaction volume on Solana',
    accent: 'ice' as const,
  },
  {
    big: '~180,000',
    sub: 'x402 calls processed today',
    accent: 'default' as const,
  },
  {
    big: '49%',
    sub: 'of all x402 traffic runs on Solana',
    accent: 'ice' as const,
  },
];

export function Economy() {
  return (
    <section
      id="economy"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <ScrollReveal as="div" className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ice">
            § 402.1
          </div>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
            The x402 economy{' '}
            <span className="font-mono text-base font-medium uppercase tracking-[0.22em] text-mint">
              · live
            </span>
          </h2>
        </div>
      </ScrollReveal>

      <ScrollRevealStagger
        className="grid gap-4 md:grid-cols-3 md:gap-5"
        stagger={0.1}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{
              y: -3,
              transition: { type: 'spring', stiffness: 320, damping: 20 },
            }}
            className="glass relative overflow-hidden rounded-2xl px-6 py-7"
          >
            {s.accent === 'ice' && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(168,197,255,0.18), transparent 75%)',
                }}
              />
            )}
            <div className="relative">
              <div
                className={`font-display text-4xl font-bold tabular-nums tracking-tight md:text-5xl ${
                  s.accent === 'ice' ? 'ice-text' : 'text-text'
                }`}
              >
                {s.big}
              </div>
              <div className="mt-3 text-[13px] text-text-mute md:text-sm">
                {s.sub}
              </div>
            </div>
          </motion.div>
        ))}
      </ScrollRevealStagger>

      <ScrollReveal
        as="div"
        delay={0.15}
        className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim"
      >
        figures based on public x402 dashboards · approximate
      </ScrollReveal>
    </section>
  );
}
