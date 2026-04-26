'use client';

import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

import { NumberPicker } from '@/components/game/NumberPicker';
import { FlipButton } from '@/components/game/FlipButton';
import { RecentFlips } from '@/components/game/RecentFlips';
import { WinBurst } from '@/components/game/WinBurst';
import { RollReveal } from '@/components/game/RollReveal';
import { useFlip } from '@/hooks/useFlip';
import { FLIP_AMOUNT_LABEL, MODE } from '@/lib/constants';
import type { FlipRecord } from '@/hooks/useFlipHistory';

/**
 * Stand-alone game card. No 3D coin — pure form:
 *  - mode badge
 *  - number picker
 *  - flip button (with shimmer while awaiting signature)
 *  - result banner (loss/win flash)
 *  - recent flips list
 */
export function GameCard() {
  const { connected } = useWallet();
  const [pick, setPick] = useState<number>(402);
  const { phase, lastResult, history, flip, targetRoll } = useFlip();

  const busy = phase !== 'idle' && phase !== 'done';
  // Reel only takes over the picker during the reveal phase. As soon as the
  // result lands (`done`), the picker fades back in so the player can choose
  // a new number — `ResultBanner` keeps the previous outcome visible above.
  const showReveal = phase === 'revealing' && targetRoll !== null;

  // Loss animation trigger — shake whenever a new losing result arrives
  const shake = useAnimationControls();
  const lastId = useRef<string | null>(null);
  useEffect(() => {
    if (lastResult && lastResult.id !== lastId.current) {
      lastId.current = lastResult.id;
      if (!lastResult.isWin) {
        shake.start({
          x: [0, -12, 10, -6, 4, -2, 0],
          transition: { duration: 0.6, ease: 'easeInOut' },
        });
      }
    }
  }, [lastResult, shake]);

  return (
    <motion.div animate={shake} className="relative">
      {/* Volumetric glow behind card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-30px_-16px_-44px_-16px] -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(76,141,255,0.4), rgba(76,141,255,0.1) 42%, transparent 72%)',
          filter: 'blur(26px)',
        }}
      />

      {/* Coral pulse when a loss just landed */}
      <AnimatePresence>
        {phase === 'done' && lastResult && !lastResult.isWin ? (
          <motion.div
            key={lastResult.id}
            aria-hidden
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
            style={{
              boxShadow:
                '0 0 60px 10px rgba(255,107,122,0.55), inset 0 0 40px rgba(255,107,122,0.3)',
            }}
          />
        ) : null}
      </AnimatePresence>

      <div className="glass overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-[0_0_10px_#4c8dff]" />
            {MODE.name}
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim">
            <span>stake {FLIP_AMOUNT_LABEL}</span>
            <span className="text-text-dim">·</span>
            <span className="ice-text">payout {MODE.displayMultiplier}</span>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-col gap-5 p-5 sm:gap-6 sm:p-6 md:p-7">
          {/* Win overlay — dormant while always-lose */}
          <WinBurst active={phase === 'done' && !!lastResult?.isWin} />

          <AnimatePresence mode="wait">
            {showReveal ? (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <RollReveal target={targetRoll!} />
              </motion.div>
            ) : (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <NumberPicker value={pick} onChange={setPick} disabled={busy} />
              </motion.div>
            )}
          </AnimatePresence>

          <ResultBanner result={lastResult} phase={phase} />

          <div className="flex flex-col gap-2">
            <FlipButton phase={phase} onClick={() => flip(pick)} />
            {!connected && (
              <p className="text-center font-mono text-[10px] text-text-dim">
                Phantom · Solflare · MetaMask (Solana Snap)
              </p>
            )}
          </div>

          <div className="divider-glow" />

          <RecentFlips items={history} />
        </div>
      </div>
    </motion.div>
  );
}

function ResultBanner({
  result,
  phase,
}: {
  result: FlipRecord | null;
  phase: string;
}) {
  return (
    <AnimatePresence>
      {phase === 'done' && result ? (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 320, damping: 22 },
          }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
          className={`relative overflow-hidden rounded-xl border px-4 py-3 text-center ${
            result.isWin
              ? 'border-mint/40 bg-mint/10'
              : 'border-coral/40 bg-coral/10'
          }`}
        >
          <motion.span
            aria-hidden
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
            style={{
              background: result.isWin
                ? 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,107,122,0.28), transparent)',
            }}
          />
          <div
            className={`relative font-mono text-[10px] uppercase tracking-[0.24em] ${
              result.isWin ? 'text-mint' : 'text-coral'
            }`}
          >
            {result.isWin ? 'winning number' : 'rolled'}
          </div>
          <div className="relative mt-1 flex items-center justify-center gap-3 font-display text-2xl font-bold tabular-nums">
            <span className="text-text">{result.pick}</span>
            <span className="font-mono text-sm text-text-dim">→</span>
            <span className={result.isWin ? 'text-mint' : 'text-coral'}>
              {result.rolled}
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
