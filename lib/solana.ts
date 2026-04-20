import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  type TransactionSignature,
} from '@solana/web3.js';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import { DESTINATION_ADDRESS } from './constants';

const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl('mainnet-beta');

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export async function sendFlipTransaction(params: {
  wallet: WalletContextState;
  lamports: number;
}): Promise<TransactionSignature> {
  const { wallet, lamports } = params;
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected');
  }

  const payer: PublicKey = wallet.publicKey;

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash(
    'confirmed'
  );

  const tx = new Transaction({
    feePayer: payer,
    blockhash,
    lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: DESTINATION_ADDRESS,
      lamports,
    })
  );

  const signature = await wallet.sendTransaction(tx, connection);

  const confirmation = await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    'confirmed'
  );
  if (confirmation.value.err) {
    throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
  }
  return signature;
}

export function shortAddress(addr: string | PublicKey, chars = 4): string {
  const s = typeof addr === 'string' ? addr : addr.toBase58();
  if (s.length <= chars * 2 + 1) return s;
  return `${s.slice(0, chars)}…${s.slice(-chars)}`;
}
