'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CoinScene } from '@/components/game/CoinScene';
import { NumberPicker } from '@/components/game/NumberPicker';
import { FlipButton } from '@/components/game/FlipButton';
import { RecentFlips } from '@/components/game/RecentFlips';
import { useFlip } from '@/hooks/useFlip';
import { FLIP_AMOUNT_LABEL, MODE } from '@/lib/constants';

export function GameArena() {
  const { connected } = useWallet();
  const [pick, setPick] = useState<number>(402);
  const { phase, lastResult, history, flip } = useFlip();

  const busy = phase !== 'idle' && phase !== 'done';

  return (
    <section
      id="play"
      className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24"
    >
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border-bright bg-navy/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_#4c8dff]" />
          {MODE.name}  ·  extreme
        </span>
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Pick a number. <span className="grad-ice">Flip.</span>
        </h2>
        <p className="max-w-lg text-sm text-text-mute md:text-base">
          {MODE.odds}. Payout <span className="ice-text">{MODE.displayMultiplier}</span>. Every flip costs{' '}
          <span className="text-text">{FLIP_AMOUNT_LABEL}</span>.
        </p>
      </div>

      <div className="relative">
        {/* Volumetric glow behind the card — Sandra AI reference */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-40px_-20px_-60px_-20px] -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(76,141,255,0.35), rgba(76,141,255,0.1) 40%, transparent 70%)',
            filter: 'blur(28px)',
          }}
        />

        <div className="glass grid grid-cols-1 overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT: coin stage */}
          <div className="relative flex min-h-[380px] items-center justify-center border-b border-border lg:border-b-0 lg:border-r">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(76,141,255,0.22), transparent 70%)',
              }}
            />

            <CoinScene
              phase={phase}
              rolled={lastResult?.rolled}
              className="relative h-[360px] w-full md:h-[440px]"
            />

            <AnimatePresence>
              {phase === 'done' && lastResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-coral/40 bg-coral/10 px-4 py-2 text-center backdrop-blur"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-coral">
                    Rolled
                  </div>
                  <div className="font-display text-3xl font-bold text-coral">
                    {lastResult.rolled}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* RIGHT: controls */}
          <div className="flex flex-col gap-6 p-6 md:p-8">
            <NumberPicker value={pick} onChange={setPick} disabled={busy} />

            <div className="flex flex-col gap-2">
              <FlipButton phase={phase} onClick={() => flip(pick)} />
              {!connected && (
                <p className="text-center font-mono text-[11px] text-text-dim">
                  Supports Phantom, Solflare, MetaMask (Solana Snap)
                </p>
              )}
            </div>

            <div className="divider-glow my-1" />

            <RecentFlips items={history} />
          </div>
        </div>
      </div>
    </section>
  );
}
