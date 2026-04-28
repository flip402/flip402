# FLIP402 — Architecture

## Overview

FLIP402 is a single-page Next.js application. There is no backend — all logic runs client-side or directly on Solana.

## Payment flow

```
User picks number (1-402)
        ↓
User clicks "FLIP 402"
        ↓
Frontend builds SOL transfer transaction
  from: user wallet
  to:   PAYMENT_ADDRESS (house wallet)
  amount: 0.005 SOL
        ↓
User signs via wallet adapter (Phantom / Solflare / MetaMask Snap)
        ↓
Transaction submitted to Solana mainnet
        ↓
Frontend polls for confirmation
        ↓
On confirmation: extract transaction signature hash
        ↓
Derive result: hash → integer mod 402 + 1
  if result === user's number → WIN
  else → LOSE
        ↓
WIN: house wallet sends payout (0.005 × 380 = 1.9 SOL)
LOSE: nothing sent back
```

## Randomness

The outcome is derived from the confirmed transaction signature:

```typescript
function deriveResult(txSignature: string, max: number): number {
  // Take first 8 bytes of signature hash
  const hash = sha256(txSignature).slice(0, 8);
  const num = parseInt(hash, 16);
  return (num % max) + 1;
}
```

This is deterministic — given the same signature, the result is always the same. The signature is not known until the transaction is confirmed on-chain, making it impossible to predict before payment.

**Limitation**: This is client-side. A malicious frontend could theoretically show a different result than what the hash dictates. Provably fair upgrade: Switchboard VRF (see `SECURITY.md`).

## Component structure

```
app/
  page.tsx              — assembles all sections
  layout.tsx            — metadata, fonts, wallet provider
  globals.css           — CSS variables, keyframes
  opengraph-image.tsx   — dynamic OG image generation

components/
  layout/
    Header.tsx          — fixed nav with wallet connect
    Footer.tsx          — minimal two-row footer
    BackgroundFX.tsx    — shader-based volumetric background
    Preloader.tsx       — initial loading screen
  sections/
    Hero.tsx            — hero with two-column layout (text + game)
    HowItWorks.tsx      — three step cards
    Mechanism.tsx       — x402 explanation + HTTP terminal
    Economy.tsx         — live x402 economy stats
    Lore.tsx            — history + tabbed HTTP transcript
  game/
    GameCard.tsx        — game container with all controls
    NumberPicker.tsx    — number input (1-402) + shuffle
    FlipButton.tsx      — primary CTA with phase states
    RollReveal.tsx      — slot-machine reveal animation
    LiveActivity.tsx    — pseudo x402 network feed
    RecentFlips.tsx     — history list with Solscan links
    WinBurst.tsx        — win celebration overlay
  motion/
    ScrollReveal.tsx    — bidirectional scroll animations

hooks/
  useFlip.ts            — flip logic, phase machine, result derivation
  useFlipHistory.ts     — localStorage-backed history
  useVisibilityPause.ts — tab visibility pause for animations
  useIsMobile.ts        — responsive breakpoint hook

lib/
  constants.ts          — FLIP_SOL, MODE, DESTINATION_ADDRESS
  solana.ts             — connection + sendFlipTransaction helper
  random.ts             — rolling logic
  cn.ts                 — clsx + tailwind-merge helper
```

## Key design decisions

**No backend**: Keeps the project simple and trustless. Payment goes directly on-chain. No server can intercept or manipulate funds.

**Single mode**: Only x402 Jackpot (1 in 402). Keeps the narrative focused. The number 402 IS the product.

**Client-side random**: Acceptable for a community experiment. Auditable by anyone — the derivation code is open source and the input (tx signature) is on-chain.

**Fixed SOL stake**: Everyone pays exactly 0.005 SOL — no dynamic USD conversion, no oracle dependency, no slippage between display and signature.
