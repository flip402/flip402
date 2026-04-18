'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { GameCard } from '@/components/game/GameCard';
import { LiveActivity } from '@/components/game/LiveActivity';
import { FLIP_AMOUNT_LABEL, MODE } from '@/lib/constants';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0.3]);
  const haloY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 md:pt-40"
    >
      {/* Local volumetric halo behind the hero (parallaxed) */}
      <motion.div
        aria-hidden
        style={{ y: haloY }}
        className="pointer-events-none absolute inset-x-0 top-[10%] z-0 h-[70vh]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 50% at 35% 45%, rgba(76,141,255,0.35), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      </motion.div>

      <div className="relative z-10 grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* LEFT — copy */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="flex flex-col items-start text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-bright bg-navy/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_#4c8dff]" />
            HTTP 402: payment required · now on Solana
          </motion.div>

          <h1 className="font-display text-[clamp(44px,8vw,112px)] font-bold leading-[0.9] tracking-[-0.03em]">
            <RevealLine delay={0.45}>
              <span className="block grad-ice-subtle">FLIP THE</span>
            </RevealLine>
            <RevealLine delay={0.6}>
              <span className="block grad-ice">402</span>
            </RevealLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-5 max-w-md text-balance text-[15px] text-text-mute sm:mt-6 sm:text-base md:text-lg"
          >
            One in 402. Pay the protocol, pick a number, flip the coin.
            Beat the odds and keep <span className="ice-text">{MODE.displayMultiplier}</span>.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-7 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim sm:mt-8 sm:gap-5"
          >
            <Stat k="stake" v={FLIP_AMOUNT_LABEL} />
            <Stat k="payout" v={MODE.displayMultiplier} />
            <Stat k="odds" v={MODE.odds} />
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15 }}
            className="mt-8 w-full max-w-md"
          >
            <LiveActivity />
          </motion.div>
        </motion.div>

        {/* RIGHT — game */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          id="play"
        >
          <GameCard />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex flex-col">
      <span className="text-[10px] text-text-dim">{k}</span>
      <span className="font-display text-base font-bold normal-case text-text">
        {v}
      </span>
    </li>
  );
}

function RevealLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}
