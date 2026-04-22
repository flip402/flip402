'use client';

import { useState } from 'react';

const ITEMS = [
  { kind: 'plain', text: 'FLIP 402' },
  { kind: 'plain', text: '◎ SOLANA' },
  { kind: 'rekt', text: 'GET REKT 💀' },
  { kind: 'plain', text: '1 IN 402' },
  { kind: 'ice', text: '×380 JACKPOT' },
  { kind: 'plain', text: 'X402' },
  { kind: 'plain', text: 'HIGH STAKES ONLY' },
  { kind: 'rekt', text: 'NO REFUNDS' },
  { kind: 'plain', text: 'PAY THE PROTOCOL' },
  { kind: 'ice', text: 'BEAT THE 402' },
  { kind: 'plain', text: 'DEGEN MODE' },
  { kind: 'rekt', text: 'SKILL ISSUE' },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-8 px-4 sm:gap-10 sm:px-5">
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className={
            'flex items-center gap-8 font-display text-xl font-bold tracking-wider sm:gap-10 sm:text-2xl md:text-3xl ' +
            (it.kind === 'ice'
              ? 'text-ice'
              : it.kind === 'rekt'
                ? 'text-coral'
                : 'text-text-mute')
          }
        >
          {it.text}
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-text-dim" />
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      aria-hidden
      className="relative flex w-full overflow-hidden border-y border-border bg-void/60 py-3 sm:py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Edge fade masks */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-void to-transparent sm:w-24"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-void to-transparent sm:w-24"
      />

      <div
        className="flex shrink-0 items-center"
        style={{
          animation: 'marquee 42s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        <Row />
        <Row />
      </div>
    </div>
  );
}
