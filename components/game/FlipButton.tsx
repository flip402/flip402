'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import type { FlipPhase } from '@/hooks/useFlip';
import { FLIP_AMOUNT_LABEL, MODE } from '@/lib/constants';

type Props = {
  phase: FlipPhase;
  onClick: () => void;
};

export function FlipButton({ phase, onClick }: Props) {
  const { connected } = useWallet();

  const busy =
    phase === 'awaiting-signature' ||
    phase === 'confirming' ||
    phase === 'revealing';

  const awaitingSig = phase === 'awaiting-signature';

  const label = (() => {
    if (!connected) return 'Connect wallet to play';
    switch (phase) {
      case 'awaiting-signature':
        return 'Confirm in your wallet…';
      case 'confirming':
        return 'Confirming onchain…';
      case 'revealing':
        return 'Flipping…';
      default:
        return `FLIP 402  ·  ${FLIP_AMOUNT_LABEL}`;
    }
  })();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={busy}
      whileTap={{ scale: busy ? 1 : 0.98 }}
      className={cn(
        'group relative h-[52px] w-full overflow-hidden rounded-xl font-display text-[15px] font-bold tracking-wide transition-all sm:h-14 sm:text-base',
        'bg-gradient-to-b from-electric to-primary text-text',
        'border border-electric/40 shadow-[0_10px_30px_-8px_rgba(76,141,255,0.6)]',
        'hover:from-ice hover:to-electric hover:shadow-[0_14px_40px_-8px_rgba(168,197,255,0.65)]',
        busy && 'cursor-not-allowed opacity-85',
        !busy && connected && 'pulse-glow',
        awaitingSig && 'ring-2 ring-ice/70'
      )}
    >
      {/* Scanline overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          background:
            'repeating-linear-gradient(180deg, transparent 0 2px, rgba(255,255,255,0.08) 2px 3px)',
        }}
      />

      {/* Shimmer sweep — runs constantly while awaiting signature */}
      {awaitingSig && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
          animate={{ x: ['0%', '400%'] }}
          transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{label}</span>
      </span>

      <span className="relative z-10 mt-0.5 block text-[10px] font-medium uppercase tracking-[0.22em] opacity-70 sm:text-[11px]">
        {MODE.odds}  ·  payout {MODE.displayMultiplier}
      </span>
    </motion.button>
  );
}
