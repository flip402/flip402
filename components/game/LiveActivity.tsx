'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlipHistory } from '@/hooks/useFlipHistory';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';

type TxKind =
  | 'inference'
  | 'rpc_call'
  | 'price_feed'
  | 'write_access'
  | 'compute'
  | 'verify'
  | 'flip_attempt';

type Tx = {
  id: string;
  amount: number;
  endpoint: string;
  kind: TxKind;
  ts: number;
  isYou?: boolean;
};

const POOL: Array<{ endpoint: string; kind: TxKind; range: [number, number] }> = [
  { endpoint: 'api.openai.com', kind: 'inference', range: [0.002, 0.012] },
  { endpoint: 'api.anthropic.com', kind: 'inference', range: [0.003, 0.014] },
  { endpoint: 'rpc.helius.dev', kind: 'rpc_call', range: [0.001, 0.004] },
  { endpoint: 'rpc.triton.one', kind: 'rpc_call', range: [0.001, 0.004] },
  { endpoint: 'data.birdeye.so', kind: 'price_feed', range: [0.0008, 0.0025] },
  { endpoint: 'price.jup.ag', kind: 'price_feed', range: [0.0008, 0.002] },
  { endpoint: 'storage.shadow.so', kind: 'write_access', range: [0.004, 0.012] },
  { endpoint: 'arweave.gateway.so', kind: 'write_access', range: [0.005, 0.015] },
  { endpoint: 'agent.coinbase.com', kind: 'compute', range: [0.003, 0.009] },
  { endpoint: 'compute.nitro.run', kind: 'compute', range: [0.004, 0.011] },
  { endpoint: 'verify.civic.me', kind: 'verify', range: [0.001, 0.003] },
  { endpoint: 'metadata.tensor.so', kind: 'rpc_call', range: [0.001, 0.003] },
];

function randomTx(): Tx {
  const e = POOL[Math.floor(Math.random() * POOL.length)]!;
  const [lo, hi] = e.range;
  const amount = Math.round((lo + Math.random() * (hi - lo)) * 1000) / 1000;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    amount,
    endpoint: e.endpoint,
    kind: e.kind,
    ts: Date.now(),
  };
}

function formatAge(ms: number): string {
  const s = Math.max(1, Math.floor(ms / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

const KIND_COLORS: Record<TxKind, string> = {
  inference: 'text-ice',
  rpc_call: 'text-electric',
  price_feed: 'text-mint',
  write_access: 'text-coral',
  compute: 'text-ice',
  verify: 'text-text-mute',
  flip_attempt: 'text-white-ice',
};

const MAX_ROWS = 4;

export function LiveActivity() {
  const visible = useVisibilityPause();
  const { history } = useFlipHistory();

  const [feed, setFeed] = useState<Tx[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const seed = Array.from({ length: MAX_ROWS }).map((_, i) => ({
      ...randomTx(),
      ts: Date.now() - (i + 1) * 4000 - Math.random() * 3000,
    }));
    setFeed(seed);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let t: number;
    const schedule = () => {
      const delay = 2500 + Math.random() * 2000;
      t = window.setTimeout(() => {
        setFeed((prev) => [randomTx(), ...prev].slice(0, MAX_ROWS));
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [visible]);

  const lastFlip = history[0];
  const youRow: Tx | null =
    lastFlip && Date.now() - lastFlip.ts < 30_000
      ? {
          id: `you-${lastFlip.id}`,
          amount: 0.005,
          endpoint: 'flip402.com',
          kind: 'flip_attempt',
          ts: lastFlip.ts,
          isYou: true,
        }
      : null;

  const rows: Tx[] = youRow ? [youRow, ...feed].slice(0, MAX_ROWS) : feed;
  void tick;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-bright bg-void/55 px-3.5 py-3 backdrop-blur sm:px-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral/70" />
            <span className="relative h-2 w-2 rounded-full bg-coral" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">
            Live · x402 network activity
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-dim">
          mainnet
        </span>
      </div>

      <ul
        className="relative flex flex-col gap-1.5 overflow-hidden"
        style={{ height: 'calc(4 * 30px + 3 * 6px)' }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {rows.map((tx) => (
            <motion.li
              key={tx.id}
              layout
              initial={{ opacity: 0, y: -10, x: -6 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: 6 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className={`grid h-[30px] shrink-0 grid-cols-[80px_1fr_auto] items-center gap-2.5 rounded-md px-2 font-mono text-[11px] whitespace-nowrap sm:grid-cols-[90px_1fr_auto] sm:gap-3 sm:text-[12px] ${
                tx.isYou ? 'bg-electric/12 text-text' : 'text-text-mute'
              }`}
            >
              <span
                className={
                  tx.isYou ? 'tabular-nums text-ice' : 'tabular-nums text-text'
                }
              >
                {tx.amount.toFixed(3)} SOL
              </span>
              <span className="flex min-w-0 items-center gap-2 truncate">
                <span className="text-text-dim">→</span>
                <span className="truncate">{tx.endpoint}</span>
                <span className={`shrink-0 ${KIND_COLORS[tx.kind]}`}>
                  [{tx.kind}]
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-text-dim">
                {tx.isYou ? (
                  <>
                    <span className="text-ice">now</span>
                    <span className="text-electric">←</span>
                  </>
                ) : (
                  <span suppressHydrationWarning>{formatAge(Date.now() - tx.ts)}</span>
                )}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
