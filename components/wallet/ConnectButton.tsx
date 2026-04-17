'use client';

import dynamic from 'next/dynamic';

/**
 * `WalletMultiButton` from @solana/wallet-adapter-react-ui hard-codes its own
 * label dictionary, so passing `labels` as a prop has no effect there. We use
 * `BaseWalletMultiButton` directly and pass our own labels, which lets us
 * rename "Select Wallet" → "Connect Wallet" while keeping the rest of the UX.
 */
const DynamicBaseMultiButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
  { ssr: false }
);

const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting…',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': 'Connect Wallet',
} as const;

export function ConnectButton() {
  return <DynamicBaseMultiButton labels={LABELS} />;
}
