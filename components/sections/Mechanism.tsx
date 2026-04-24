'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, ScrollRevealStagger, staggerItem } from '@/components/motion/ScrollReveal';

const HTTP_LINES: Array<{ text: string; kind: 'header' | 'value' | 'blank' | 'prompt' | 'ok' | 'mixed' }> = [
  { text: 'HTTP/1.1 402 Payment Required', kind: 'header' },
  { text: 'X-Payment-Required: true', kind: 'value' },
  { text: 'X-Payment-Amount: 0.005', kind: 'value' },
  { text: 'X-Payment-Asset: SOL', kind: 'value' },
  { text: 'X-Payment-Recipient: 7AQR…GWh9', kind: 'value' },
  { text: '', kind: 'blank' },
  { text: '> pay(0.005 SOL)', kind: 'prompt' },
  { text: '> awaiting confirmation…', kind: 'prompt' },
  { text: '> confirmed ✓', kind: 'ok' },
  { text: '> access: GRANTED | DENIED', kind: 'mixed' },
];

function CodeLine({
  line,
  index,
}: {
  line: (typeof HTTP_LINES)[number];
  index: number;
}) {
  if (line.kind === 'blank') {
    return <div className="h-3" aria-hidden />;
  }

  const renderText = () => {
    if (line.kind === 'header') {
      // HTTP/1.1 [402] [Payment Required]
      const m = line.text.match(/^(HTTP\/1\.1)\s+(\d+)\s+(.*)$/);
      if (m) {
        return (
          <>
            <span className="text-text-mute">{m[1]} </span>
            <span className="text-coral">{m[2]} </span>
            <span className="text-coral/80">{m[3]}</span>
          </>
        );
      }
    }
    if (line.kind === 'value') {
      const idx = line.text.indexOf(':');
      if (idx > 0) {
        return (
          <>
            <span className="text-ice">{line.text.slice(0, idx)}</span>
            <span className="text-text-dim">: </span>
            <span className="text-white-ice">{line.text.slice(idx + 1).trim()}</span>
          </>
        );
      }
    }
    if (line.kind === 'prompt') {
      return (
        <>
          <span className="text-electric">{'> '}</span>
          <span className="text-text-mute">{line.text.slice(2)}</span>
        </>
      );
    }
    if (line.kind === 'ok') {
      return (
        <>
          <span className="text-electric">{'> '}</span>
          <span className="text-text">{line.text.slice(2, -2)}</span>
          <span className="text-mint"> ✓</span>
        </>
      );
    }
    if (line.kind === 'mixed') {
      // > access: GRANTED | DENIED
      return (
        <>
          <span className="text-electric">{'> '}</span>
          <span className="text-text-mute">access: </span>
          <span className="text-mint">GRANTED</span>
          <span className="text-text-dim"> | </span>
          <span className="text-coral">DENIED</span>
        </>
      );
    }
    return <span>{line.text}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-15% 0px -15% 0px' }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className="font-mono text-[12px] leading-7 sm:text-[13px]"
    >
      {renderText()}
    </motion.div>
  );
}

const BUILDERS: Array<{ name: string; role: string }> = [
  { name: 'Coinbase', role: 'payment infrastructure' },
  { name: 'Stripe', role: 'fiat-to-x402 bridge' },
  { name: 'Google Cloud', role: 'compute payments' },
  { name: 'Cloudflare', role: 'edge API monetization' },
  { name: 'Solana Foundation', role: 'protocol grants' },
];

function Builders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-bright bg-void/55 px-5 py-5 backdrop-blur-md sm:px-7 sm:py-6">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
        <span className="text-text-mute">Who&apos;s building on x402</span>
        <span className="text-text-dim">{BUILDERS.length + 1}</span>
      </div>

      <div className="grid gap-x-8 gap-y-1 md:grid-cols-2 lg:grid-cols-3">
        {BUILDERS.map((b) => (
          <div
            key={b.name}
            className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 font-mono text-[12px]"
          >
            <span className="text-text">{b.name}</span>
            <span className="truncate text-right text-text-mute">{b.role}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 rounded-lg border border-electric/30 bg-electric/[0.06] px-4 py-3 font-mono text-[12px]">
        <span className="ice-text font-bold">FLIP402</span>
        <span className="text-text-mute">human-facing flip</span>
      </div>
    </div>
  );
}

export function Mechanism() {
  return (
    <section
      id="protocol"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
        <ScrollReveal x={-12} y={0} className="md:sticky md:top-32 md:self-start">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ice">
            The mechanism
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
            § x402
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-10 md:gap-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-stretch lg:gap-10">
            {/* Story copy */}
            <ScrollRevealStagger className="flex flex-col justify-center gap-5 text-[15px] leading-relaxed text-text-mute md:text-base">
              <motion.p variants={staggerItem}>
                Every HTTP request can return a status code.{' '}
                <span className="text-text">200</span> means success.{' '}
                <span className="text-text">404</span> means not found.{' '}
                <span className="text-coral">402 — Payment Required</span> sat unused
                for thirty years. A door with no lock.
              </motion.p>
              <motion.p variants={staggerItem}>
                Then <span className="text-text">x402</span> arrived.{' '}
                <span className="text-text">Coinbase</span> built the lock.{' '}
                <span className="text-text">Stripe</span> turned the key.{' '}
                <span className="text-text">Google Cloud</span> opened the door.
                Now AI agents pay for API calls in real-time, machine to machine,
                cent by cent, on <span className="ice-text">Solana</span>.
              </motion.p>
              <motion.p variants={staggerItem} className="text-text">
                FLIP402 is the same handshake — but you&apos;re the agent, the
                endpoint flips a coin, and the payload is your number.
              </motion.p>
            </ScrollRevealStagger>

            {/* Terminal block */}
            <ScrollReveal y={20} className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[-22px_-12px_-30px_-12px] -z-10"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(76,141,255,0.32), rgba(76,141,255,0.08) 45%, transparent 75%)',
                  filter: 'blur(24px)',
                }}
              />
              <div className="overflow-hidden rounded-2xl border border-border-bright bg-void/80 backdrop-blur-md">
                {/* macOS-ish title bar */}
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-text-dim" />
                    <span className="h-2.5 w-2.5 rounded-full bg-mint/60" />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dim">
                    x402.transcript
                  </div>
                  <span className="w-[42px]" />
                </div>

                {/* Body */}
                <div
                  className="relative px-4 py-4 sm:px-5 sm:py-5"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(7,11,24,0.6), rgba(3,5,12,0.9))',
                  }}
                >
                  {/* Subtle scan lines */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                      background:
                        'repeating-linear-gradient(180deg, transparent 0 3px, rgba(255,255,255,0.4) 3px 4px)',
                    }}
                  />
                  {HTTP_LINES.map((line, i) => (
                    <CodeLine line={line} index={i} key={i} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Builders — full-width strip under the grid */}
          <ScrollReveal>
            <Builders />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
