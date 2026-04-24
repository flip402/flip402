'use client';

import { Wallet, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal, ScrollRevealStagger, staggerItem } from '@/components/motion/ScrollReveal';

const STEPS = [
  {
    n: '01',
    icon: Wallet,
    title: 'Connect',
    desc: 'Plug in Phantom, Solflare, or MetaMask. One click, no registration.',
  },
  {
    n: '02',
    icon: Target,
    title: 'Pick',
    desc: 'Choose your number from 1 to 402. Gut feeling or birthday — doesn’t matter to the chain.',
  },
  {
    n: '03',
    icon: Zap,
    title: 'Flip',
    desc: 'Pay 0.005 SOL. The protocol rolls. Land on your number, pocket ×380.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
      <ScrollReveal as="div" className="mb-12 flex flex-col items-center gap-3 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim">
          Three steps
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          How it works
        </h2>
      </ScrollReveal>

      <ScrollRevealStagger className="grid gap-5 md:grid-cols-3" stagger={0.12}>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              variants={staggerItem}
              whileHover={{
                y: -4,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className="glass relative overflow-hidden rounded-2xl p-7"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-8 font-display text-[140px] font-bold leading-none text-text"
                style={{ opacity: 0.04 }}
              >
                {step.n}
              </span>
              <div className="relative">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border-bright bg-electric/10 text-electric">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-text-mute">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </ScrollRevealStagger>
    </section>
  );
}
