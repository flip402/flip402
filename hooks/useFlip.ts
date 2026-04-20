'use client';

import { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { toast } from 'sonner';

import { FLIP_LAMPORTS, FLIP_SOL, SOLSCAN_TX } from '@/lib/constants';
import { sendFlipTransaction } from '@/lib/solana';
import { rollLosingNumber } from '@/lib/random';
import { useFlipHistory, type FlipRecord } from '@/hooks/useFlipHistory';

export type FlipPhase =
  | 'idle'
  | 'awaiting-signature'
  | 'confirming'
  | 'revealing'
  | 'done';

const REVEAL_MS = 2800;

export function useFlip() {
  const wallet = useWallet();
  const { setVisible: openWalletModal } = useWalletModal();
  const { history, addFlip } = useFlipHistory();

  const [phase, setPhase] = useState<FlipPhase>('idle');
  const [lastResult, setLastResult] = useState<FlipRecord | null>(null);
  /** The number the chain "rolled" — exposed the instant the reveal phase starts. */
  const [targetRoll, setTargetRoll] = useState<number | null>(null);

  const flip = useCallback(
    async (pick: number) => {
      if (phase !== 'idle' && phase !== 'done') return;

      if (!wallet.connected || !wallet.publicKey) {
        openWalletModal(true);
        toast.info('Connect your wallet to play.');
        return;
      }

      try {
        setPhase('awaiting-signature');
        const signature = await sendFlipTransaction({
          wallet,
          lamports: FLIP_LAMPORTS,
        });

        setPhase('confirming');
        await new Promise((r) => setTimeout(r, 400));

        // Compute the rolled number BEFORE the reveal animation so the
        // slot-reel knows where to land. Always a loss for now.
        const rolled = rollLosingNumber(pick);
        setTargetRoll(rolled);
        setPhase('revealing');
        await new Promise((r) => setTimeout(r, REVEAL_MS));

        const record: FlipRecord = {
          id: signature.slice(0, 12),
          ts: Date.now(),
          pick,
          rolled,
          isWin: false,
          signature,
          lamports: FLIP_LAMPORTS,
          solUsd: 0, // legacy field, no longer fetched
        };
        addFlip(record);
        setLastResult(record);
        setPhase('done');

        toast(`Rolled ${rolled}. You picked ${pick}.`, {
          description: `${FLIP_SOL} SOL spent · not your number.`,
          action: {
            label: 'View tx',
            onClick: () => window.open(SOLSCAN_TX(signature), '_blank'),
          },
        });
      } catch (err) {
        setPhase('idle');
        setTargetRoll(null);
        const msg =
          err instanceof Error && err.message ? err.message : 'Flip failed.';
        const userRejected = /reject|declin|user.*refused|denied/i.test(msg);
        if (userRejected) {
          toast.error('Transaction cancelled.');
        } else {
          toast.error('Flip failed', { description: msg });
        }
      }
    },
    [phase, wallet, openWalletModal, addFlip]
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setLastResult(null);
    setTargetRoll(null);
  }, []);

  return { phase, lastResult, history, flip, reset, targetRoll };
}
