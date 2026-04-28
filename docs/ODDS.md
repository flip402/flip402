# Odds & House Edge

Full transparency on the math.

## x402 Jackpot

| Parameter | Value |
|-----------|-------|
| Cost per flip | 0.005 SOL |
| Win condition | Pick = rolled number (1–402) |
| Win probability | 1/402 = 0.2488% |
| Payout on win | 0.005 × 380 = 1.9 SOL |
| Expected payout | 1.9 × (1/402) = 0.004726 SOL |
| House edge | (0.005 - 0.004726) / 0.005 = **5.47%** |

## What this means

For every 402 flips on average:
- 401 players lose 0.005 SOL each = 2.005 SOL collected
- 1 player wins 1.9 SOL
- House retains: 2.005 - 1.9 = **0.105 SOL**

## Expected value per flip

```
EV = (1/402 × 1.9 SOL) + (401/402 × -0.005 SOL)
EV = 0.004726 - 0.004975
EV = -0.000249 SOL per flip
```

You lose ~0.0002 SOL on average per flip, or about 5% of your stake.

## Comparison

| Game | House edge |
|------|-----------|
| FLIP402 | ~5.5% |
| Roulette (European) | 2.7% |
| Roulette (American) | 5.26% |
| Slots (typical) | 5–15% |

## Note

These are theoretical odds based on fair randomness. See `SECURITY.md` for notes on the current randomness implementation.
