'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { SOLSCAN_TX } from '@/lib/constants';
import type { FlipRecord } from '@/hooks/useFlipHistory';

type Props = {
  items: FlipRecord[];
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function shortSig(sig: string) {
  return `${sig.slice(0, 4)}…${sig.slice(-4)}`;
}

export function RecentFlips({ items }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">
          Recent flips
        </span>
        <motion.span
          key={items.length}
          initial={{ scale: 1.2, color: '#a8c5ff' }}
          animate={{ scale: 1, color: 'rgba(255,255,255,0.32)' }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          {items.length}
        </motion.span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-bright/40 bg-void/30 px-4 py-6 text-center text-xs text-text-dim sm:text-sm sm:py-8">
          No flips yet. Be the first to lose money.
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          <AnimatePresence initial={false}>
            {items.slice(0, 6).map((f, idx) => {
              const isNewest = idx === 0;
              return (
                <motion.li
                  key={f.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: -14,
                    scale: 0.96,
                    filter: 'blur(4px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: {
                      type: 'spring',
                      stiffness: 320,
                      damping: 24,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95,
                    transition: { duration: 0.2 },
                  }}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-lg border-l-2 py-2 pl-3 pr-2 ${
                    f.isWin
                      ? 'border-mint bg-mint/5'
                      : 'border-coral bg-coral/5'
                  }`}
                >
                  {/* Glow sweep on newest entry */}
                  {isNewest && (
                    <motion.span
                      aria-hidden
                      initial={{ x: '-120%' }}
                      animate={{ x: '120%' }}
                      transition={{
                        duration: 1.1,
                        ease: 'easeOut',
                        delay: 0.1,
                      }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-2/3"
                      style={{
                        background: f.isWin
                          ? 'linear-gradient(90deg, transparent, rgba(74,222,128,0.25), transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(255,107,122,0.22), transparent)',
                      }}
                    />
                  )}

                  <span className="relative font-mono text-[11px] text-text-dim">
                    {formatTime(f.ts)}
                  </span>
                  <span className="relative flex-1 font-mono text-xs text-text-mute">
                    picked <span className="text-text">{f.pick}</span>, rolled{' '}
                    <span className={f.isWin ? 'text-mint' : 'text-coral'}>
                      {f.rolled}
                    </span>
                  </span>
                  <a
                    href={SOLSCAN_TX(f.signature)}
                    target="_blank"
                    rel="noreferrer"
                    className="relative flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-text-dim opacity-60 transition-opacity hover:text-text-mute sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    {shortSig(f.signature)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
