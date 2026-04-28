# x402 — Context & Background

Why FLIP402 exists and what x402 actually is.

## HTTP 402: A 26-year placeholder

In 1998, Tim Berners-Lee and the HTTP working group reserved status code 402 — "Payment Required" — in RFC 2616. The intention was clear: eventually, the web would need native payments. The code was reserved for that future.

That future never came. For 26 years, HTTP 402 sat in the spec unused. Every other 4xx code had a job. 402 had a reservation and nothing else.

## x402: The lock finally gets a key

In May 2025, Coinbase published the x402 protocol specification. The idea: use HTTP 402 as a real payment layer. When a client requests a resource, the server can respond with `402 Payment Required` plus payment terms. The client pays (on-chain, in stablecoins or SOL), retries the request with a payment proof header, and gets the response.

No accounts. No subscriptions. No API keys. Just pay and get.

```
Client → GET /api/data
Server ← 402 Payment Required
         X-Payment-Required: true
         X-Payment-Amount: 0.005
         X-Payment-Asset: SOL
         X-Payment-Recipient: [address]

Client → pay(0.005 SOL) → confirmed on Solana
Client → GET /api/data
         X-Payment: [proof]
Server ← 200 OK + data
```

## Who's building on x402

- **Coinbase** — protocol spec and reference implementation
- **Stripe** — fiat-to-x402 bridge (launched February 2026)
- **Google Cloud** — compute payment infrastructure
- **Cloudflare** — edge API monetization, co-founded x402 Foundation
- **Vercel** — deployment infrastructure support
- **Solana Foundation** — primary chain for micropayments

The x402 Foundation (Coinbase + Cloudflare) now governs the open spec. Members include Google, Visa, AWS, Circle, and Anthropic.

## Why Solana

x402's average transaction is ~$0.06. On Base (Ethereum L2), gas fees of $0.015 consume 25% of each transaction — unsustainable. On Solana, fees are $0.00025. That's 60x cheaper. This makes true micropayments viable in a way no other chain enables.

Solana processes 400ms finality. For AI agents making thousands of calls per minute, this matters.

## By the numbers

- 100M+ x402 transactions since May 2025
- $10M+ volume processed
- 22+ facilitators operating
- 10,000+ paid API endpoints live

## FLIP402's place in this

FLIP402 is not infrastructure. It's an experiment at the edge of the x402 ecosystem — a human-facing application of the same primitive that AI agents use every second.

When you flip the 402, you're doing what every agent does: paying into the unknown and waiting to see what comes back.

The difference is you picked the number.
