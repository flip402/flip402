# Security

## Current implementation

FLIP402 uses client-side randomness derived from the confirmed Solana transaction signature. The derivation is deterministic and open source — anyone can verify the result given a transaction signature.

**Audit the result yourself:**
1. Get the transaction signature from your wallet
2. Run: `sha256(signature)` → take first 8 bytes → parse as hex integer → mod 402 + 1
3. Compare to what the frontend showed you

## Known limitations

- **Client-side trust**: The frontend derives and displays the result. A compromised frontend could theoretically show incorrect results. Mitigation: the code is open source and verifiable.
- **No VRF**: The randomness source is the transaction signature, which is determined by the network. It is not directly manipulable by either party but is not cryptographically provable as random.

## Upgrade path

For provably fair randomness:

**Option 1: Switchboard VRF**
Request a verifiable random number from Switchboard's on-chain VRF. Result is committed on-chain before reveal.

**Option 2: Pyth Entropy**
Use Pyth's entropy service for on-chain random number generation.

Both options require a program (smart contract) to escrow funds and release based on VRF result — a more complex architecture.

## Responsible disclosure

If you find a vulnerability, open an issue or contact via Twitter @flip402.
