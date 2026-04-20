import { SOL_MINT } from './constants';

type CacheEntry = { price: number; at: number };
let cached: CacheEntry | null = null;
const TTL_MS = 30_000;

/**
 * Fetch SOL price in USD from Jupiter Lite price API.
 * Cached for 30 seconds to avoid hammering the endpoint.
 */
export async function fetchSolUsd(): Promise<number> {
  const now = Date.now();
  if (cached && now - cached.at < TTL_MS) return cached.price;

  const url = `https://lite-api.jup.ag/price/v2?ids=${SOL_MINT}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Price API ${res.status}`);
  const json = (await res.json()) as {
    data: Record<string, { price: string } | null>;
  };
  const raw = json.data?.[SOL_MINT]?.price;
  if (!raw) throw new Error('Price missing in response');
  const price = Number(raw);
  if (!Number.isFinite(price) || price <= 0) throw new Error('Invalid price value');
  cached = { price, at: now };
  return price;
}

/**
 * Convert USD to lamports given a SOL/USD price.
 * Ceiling so we never under-charge due to rounding.
 */
export function usdToLamports(usd: number, solUsd: number): number {
  const sol = usd / solUsd;
  return Math.ceil(sol * 1_000_000_000);
}
