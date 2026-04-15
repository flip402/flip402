import { PublicKey } from '@solana/web3.js';

export const DESTINATION_ADDRESS = new PublicKey(
  '7AQR3GrA66TfAEeASfh5FgBMJi9CZ4LE5QSkrLZTGWh9'
);

/** Fixed wager, paid in SOL directly. */
export const FLIP_SOL = 0.005;
export const FLIP_LAMPORTS = Math.round(FLIP_SOL * 1_000_000_000);
/** Pretty display string for the wager amount. */
export const FLIP_AMOUNT_LABEL = `${FLIP_SOL} SOL`;

export const MODE = {
  name: 'x402 Jackpot',
  odds: '1 in 402',
  multiplier: 380,
  displayMultiplier: '×380',
  range: [1, 402] as const,
};

export const SOL_MINT = 'So11111111111111111111111111111111111111112';

export const SOLSCAN_TX = (sig: string) => `https://solscan.io/tx/${sig}`;

export const HISTORY_KEY = 'flip402:history:v1';
