'use client';

import { useCallback, useEffect, useState } from 'react';
import { HISTORY_KEY } from '@/lib/constants';

export type FlipRecord = {
  id: string;
  ts: number;
  pick: number;
  rolled: number;
  isWin: boolean;
  signature: string;
  lamports: number;
  solUsd: number;
};

const MAX_HISTORY = 20;

function safeParse(raw: string | null): FlipRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is FlipRecord =>
        !!x &&
        typeof x === 'object' &&
        typeof (x as FlipRecord).id === 'string' &&
        typeof (x as FlipRecord).signature === 'string'
    );
  } catch {
    return [];
  }
}

export function useFlipHistory() {
  const [history, setHistory] = useState<FlipRecord[]>([]);

  useEffect(() => {
    setHistory(safeParse(window.localStorage.getItem(HISTORY_KEY)));
  }, []);

  const addFlip = useCallback((flip: FlipRecord) => {
    setHistory((prev) => {
      const next = [flip, ...prev].slice(0, MAX_HISTORY);
      try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* quota or privacy mode — ignore */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try {
      window.localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return { history, addFlip, clear };
}
