'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

// ─── Transcript content ──────────────────────────────────────────────────────

type LineTone =
  | 'comment' // // muted
  | 'request' // GET / Host / mid-grey
  | 'error' // 402 in coral
  | 'header' // X-Payment-* in electric
  | 'prompt' // > pay() in mid-grey
  | 'success' // 200 OK / confirmed
  | 'final'; // GRANTED | DENIED special

type Line = { text: string; tone: LineTone };

type Block = { label: string; lines: Line[] };

const BLOCK_1998: Block = {
  label: '// 1998 · RFC 2616',
  lines: [
    { text: 'GET /resource HTTP/1.1', tone: 'request' },
    { text: 'Host: api.example.com', tone: 'request' },
    { text: '', tone: 'comment' },
    { text: '← HTTP/1.1 402 Payment Required', tone: 'error' },
    { text: '', tone: 'comment' },
    { text: '// no payment handler exists.', tone: 'comment' },
    { text: '// the door is locked from the inside.', tone: 'comment' },
    { text: '// sit here for 26 years.', tone: 'comment' },
  ],
};

const BLOCK_2024: Block = {
  label: '// 2024 · x402 by Coinbase',
  lines: [
    { text: 'GET /api/data HTTP/1.1', tone: 'request' },
    { text: 'Host: service.example.com', tone: 'request' },
    { text: '', tone: 'comment' },
    { text: '← HTTP/1.1 402 Payment Required', tone: 'header' },
    { text: '   X-Payment-Required: true', tone: 'header' },
    { text: '   X-Payment-Asset:    SOL', tone: 'header' },
    { text: '   X-Payment-Amount:   0.005', tone: 'header' },
    { text: '   X-Payment-Recipient: [addr]', tone: 'header' },
    { text: '', tone: 'comment' },
    { text: '> pay(0.005 SOL)', tone: 'prompt' },
    { text: '> confirmed ✓', tone: 'prompt' },
    { text: '', tone: 'comment' },
    { text: '← HTTP/1.1 200 OK', tone: 'success' },
  ],
};

const BLOCK_NOW: Block = {
  label: '// now · flip402.com',
  lines: [
    { text: 'GET /flip HTTP/1.1', tone: 'request' },
    { text: 'Host: flip402.com', tone: 'request' },
    { text: 'X-Player: you', tone: 'request' },
    { text: '', tone: 'comment' },
    { text: '← HTTP/1.1 402 Payment Required', tone: 'header' },
    { text: '   X-Payment-Amount:   0.005 SOL', tone: 'header' },
    { text: '   X-Payment-Odds:     1 in 402', tone: 'header' },
    { text: '   X-Payment-Payout:   ×380', tone: 'header' },
    { text: '', tone: 'comment' },
    { text: '> pay(0.005 SOL)', tone: 'prompt' },
    { text: '> awaiting confirmation…', tone: 'prompt' },
    { text: '> confirmed ✓', tone: 'prompt' },
    { text: '', tone: 'comment' },
    { text: '← access: GRANTED | DENIED', tone: 'final' },
  ],
};

const BLOCKS: Block[] = [BLOCK_1998, BLOCK_2024, BLOCK_NOW];

const STAGGER_MS = 80;

// Pre-compute cumulative line index across blocks for sequential reveal
function lineDelay(globalIndex: number): number {
  return globalIndex * STAGGER_MS;
}

// ─── Section ────────────────────────────────────────────────────────────────

export function Lore() {
  return (
    <section id="lore" className="relative mx-auto w-full max-w-[1100px] px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      {/* Heading spans both columns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-15% 0px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ice">
          Lore
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
          § 402
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
          HTTP 402 is the oldest joke in the book.
        </h2>
      </motion.div>

      <div className="grid items-start gap-10 md:gap-14 lg:grid-cols-[45fr_55fr] lg:gap-20">
        <LeftColumn />
        <RightTerminal />
      </div>

      <FactBar />
    </section>
  );
}

// ─── Left column ─────────────────────────────────────────────────────────────

function LeftColumn() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex flex-col gap-5 text-[15px] leading-relaxed text-text-mute md:text-base"
    >
      <p>
        For thirty years <span className="text-text">402 Payment Required</span>{' '}
        sat in the spec unused — a door marked &ldquo;you can&apos;t afford
        this&rdquo; with no lock behind it. A placeholder for a future nobody
        built.
      </p>
      <p>
        Then the chains showed up. Payments became native. The door got a lock,
        and the lock got a key, and the key was just a signature you could make
        in your pocket.
      </p>
      <p>
        FLIP402 is what we do with the door now. Pay the toll. One in four
        hundred and two times, the protocol lets you through with{' '}
        <span className="grad-ice">×380</span>. The other four hundred and one
        times it doesn&apos;t.
      </p>
      <p className="border-l-2 border-ice/70 pl-4 text-text-mute">
        Every time an AI agent makes an x402 call and gets nothing back —
        it&apos;s a loss. Every time it gets access — it&apos;s a win. FLIP402
        is that binary. <span className="text-text">For humans.</span>
      </p>
      <p className="text-text">
        No roadmaps. No vesting. No team dinners. Just the coin, the number, and
        the chain between you and the outcome.
      </p>
    </motion.div>
  );
}

// ─── Terminal ────────────────────────────────────────────────────────────────

const TAB_LABELS = ['1998', '2024', 'NOW'];
const AUTO_ADVANCE_MS = 4500;

function RightTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [autoDone, setAutoDone] = useState(false);

  // Trigger reveal when terminal enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !reveal) {
          setReveal(true);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  // Auto-advance through blocks 1998 → 2024 → NOW once on first reveal
  useEffect(() => {
    if (!reveal || autoDone) return;
    const t1 = window.setTimeout(() => setActive(1), AUTO_ADVANCE_MS);
    const t2 = window.setTimeout(() => {
      setActive(2);
      setAutoDone(true);
    }, AUTO_ADVANCE_MS * 2);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reveal, autoDone]);

  // If user clicks a tab, stop auto-progression
  const onTab = (i: number) => {
    setAutoDone(true);
    setActive(i);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{
        duration: 0.7,
        delay: 0.15,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      className="relative"
    >
      {/* Soft glow behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-22px_-12px_-30px_-12px] -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(76,141,255,0.32), rgba(76,141,255,0.08) 45%, transparent 75%)',
          filter: 'blur(24px)',
        }}
      />

      <div
        className="overflow-hidden rounded-[12px] border bg-[#060B14] backdrop-blur-md"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: '#FF5F57' }} />
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: '#FEBC2E' }} />
            <span className="h-[10px] w-[10px] rounded-full" style={{ background: '#28C840' }} />
          </div>
          <div
            className="font-mono text-[11px]"
            style={{
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.15em',
            }}
          >
            HTTP · TRANSCRIPT
          </div>
          <span className="w-[42px]" />
        </div>

        {/* Tabs */}
        <div
          className="flex items-center gap-1 px-3 py-2"
          style={{
            background: 'rgba(255,255,255,0.015)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {TAB_LABELS.map((label, i) => {
            const isActive = i === active;
            return (
              <button
                key={label}
                onClick={() => onTab(i)}
                className={`relative rounded-md px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'text-ice'
                    : 'text-text-dim hover:text-text-mute'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="lore-tab-pill"
                    className="absolute inset-0 -z-10 rounded-md border border-electric/30 bg-electric/[0.08]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {label}
              </button>
            );
          })}
          {!autoDone && reveal && (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-dim">
              <span className="h-1 w-1 animate-pulse rounded-full bg-mint" />
              auto
            </span>
          )}
        </div>

        {/* Body */}
        <div
          className="relative font-mono text-[12px] leading-[1.65] sm:text-[13px]"
        >
          {/* Subtle scan lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              background:
                'repeating-linear-gradient(180deg, transparent 0 3px, rgba(255,255,255,0.5) 3px 4px)',
            }}
          />

          <div className="relative px-5 py-4 sm:px-6 sm:py-5" style={{ minHeight: 280 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <BlockBody block={BLOCKS[active]!} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BlockBody({ block }: { block: Block }) {
  return (
    <div>
      <TypedLine delayMs={0} className="text-text-dim/60">
        {block.label}
      </TypedLine>
      <div className="h-1.5" />
      {block.lines.map((line, i) => (
        <RenderedLine key={i} line={line} delay={lineDelay(i + 1)} />
      ))}
    </div>
  );
}

function RenderedLine({ line, delay }: { line: Line; delay: number }) {
  if (line.tone === 'final') {
    return (
      <TypedLine delayMs={delay} className="text-text-mute">
        <span className="text-text-mute">← access: </span>
        <span className="font-bold text-mint blink-granted">GRANTED</span>
        <span className="text-text-dim"> | </span>
        <span className="font-bold text-coral blink-denied">DENIED</span>
        <span
          aria-hidden
          className="ml-2 inline-block h-[1em] w-[0.55em] -translate-y-[0.1em] align-middle bg-electric blink-cursor"
          style={{ verticalAlign: '-0.12em' }}
        />
      </TypedLine>
    );
  }

  if (line.text === '') {
    return <div className="h-2" aria-hidden />;
  }

  return (
    <TypedLine delayMs={delay} className={toneClass(line.tone)}>
      {line.text}
    </TypedLine>
  );
}

function toneClass(t: LineTone): string {
  switch (t) {
    case 'comment':
      return 'text-text-dim/60';
    case 'request':
      return 'text-white/50';
    case 'error':
      return 'text-coral';
    case 'header':
      return 'text-electric';
    case 'prompt':
      return 'text-white/55';
    case 'success':
      return 'text-mint';
    default:
      return 'text-text-mute';
  }
}

function TypedLine({
  children,
  delayMs,
  className = '',
}: {
  children: ReactNode;
  delayMs: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{
        duration: 0.18,
        delay: delayMs / 1000,
        ease: 'easeOut',
      }}
      className={`relative whitespace-pre ${className}`}
    >
      {children || ' '}
    </motion.div>
  );
}

// ─── Fact-bar ────────────────────────────────────────────────────────────────

const FACTS: Array<{ tag: string; sub: string; href: string }> = [
  {
    tag: 'Coined in 1998',
    sub: 'RFC 2616 / HTTP/1.1 spec',
    href: 'https://www.rfc-editor.org/rfc/rfc2616',
  },
  {
    tag: 'Unused 26 years',
    sub: 'No standard payment layer',
    href: 'https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#402',
  },
  {
    tag: 'Revived by Coinbase',
    sub: 'x402 protocol · 2024',
    href: 'https://x402.org',
  },
];

function FactBar() {
  return (
    <div className="mt-10 grid gap-2.5 md:mt-14 md:grid-cols-3">
      {FACTS.map((f) => (
        <a
          key={f.tag}
          href={f.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group rounded-lg border border-border-bright bg-void/40 px-4 py-3 backdrop-blur transition-all hover:border-electric/50 hover:bg-electric/5"
        >
          <div className="flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ice">
            {f.tag}
            <svg
              className="h-3 w-3 -translate-x-1 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
          <div className="mt-1 font-mono text-[11px] text-text-dim">{f.sub}</div>
        </a>
      ))}
    </div>
  );
}
