# FLIP402

**Live:** [flip402.xyz](https://flip402.xyz) · **Token:** [F9nqmfbosyPiNwVYd5SfRwWAVJ5csVRGYGJQ4Cwtpump](https://pump.fun/coin/F9nqmfbosyPiNwVYd5SfRwWAVJ5csVRGYGJQ4Cwtpump) · **Twitter:** [@flip402sol](https://x.com/flip402sol)

> HTTP 402 — Payment Required.
> For thirty years, this status code did nothing.
> Then x402 arrived.

FLIP402 is an onchain coin flip experiment built on the x402 payment primitive. Pick a number from 1 to 402. Pay the protocol. Beat the odds.

---

## What is x402?

x402 is an open HTTP payment standard incubated by Coinbase, integrated by Stripe, Google Cloud, and Cloudflare. It revives the dormant HTTP 402 "Payment Required" status code — turning it into a real payment layer for AI agents on Solana.

Every second, thousands of agents make x402 calls: paying for API access, compute, data feeds. Not every payment returns something valuable. Sometimes the response is worth millions. Sometimes — nothing.

FLIP402 distills that uncertainty into a game.

→ [x402.org](https://x402.org)
→ [Solana x402 docs](https://solana.com/x402)
→ [Coinbase x402 spec](https://docs.cdp.coinbase.com/x402/welcome)

---

## How it works

| Mode | Odds | Payout | Cost |
|------|------|--------|------|
| x402 Jackpot | 1 in 402 | ×380 | 0.005 SOL |

1. Connect your Solana wallet (Phantom, Solflare, MetaMask Snap)
2. Pick a number from 1 to 402
3. Pay 0.005 SOL to the protocol
4. The protocol rolls. You win ×380 or you don't.

---

## The 402 connection

The number you're betting against — **402** — is the HTTP status code itself. The payout — **×380** — accounts for the house edge while keeping expected value close to fair.

If you hit it, the protocol paid you back. And then some.

One in 402 times, the door opens.

---

## Architecture

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Animations**: Framer Motion + Paper Design Shaders
- **Wallet**: Solana Wallet Adapter (Phantom, Solflare, MetaMask Snap)
- **Payments**: @solana/web3.js — direct SOL transfer on Solana mainnet
- **Randomness**: Client-side, seeded from transaction signature hash

### Randomness note

Current implementation uses client-side randomness derived from the confirmed transaction signature. This is deterministic and auditable — the outcome is fixed at the moment of on-chain confirmation.

Upgrade path to provably fair: Switchboard VRF or Pyth Entropy. See `SECURITY.md`.

---

## Run locally

```bash
git clone https://github.com/flip402/flip402
cd flip402
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## House edge

There is a house edge. It is documented transparently in `docs/ODDS.md`.

Short version: expected value per flip is ~0.00472 SOL on a 0.005 SOL stake. House edge: ~5.5%.

---

## Disclaimer

FLIP402 is a community experiment on the x402 narrative. Not financial advice. Play responsibly.

## License

MIT
