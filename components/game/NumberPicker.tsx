'use client';

import { Shuffle } from 'lucide-react';
import { MODE } from '@/lib/constants';
import { cn } from '@/lib/cn';

const [MIN, MAX] = MODE.range;

type Props = {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
};

export function NumberPicker({ value, onChange, disabled }: Props) {
  const clamp = (n: number) => Math.min(MAX, Math.max(MIN, Math.floor(n || MIN)));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    if (!raw) {
      onChange(MIN);
      return;
    }
    onChange(clamp(Number(raw)));
  };

  const random = () => onChange(Math.floor(Math.random() * MAX) + 1);

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim sm:text-[11px]">
          Your number
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-dim sm:text-[11px]">
          {MIN} – {MAX}
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleInput}
          disabled={disabled}
          className={cn(
            'h-16 w-full rounded-xl border border-border-bright bg-void/50 px-4 text-center font-display text-[52px] font-bold tabular-nums tracking-tight outline-none transition-all sm:h-20 sm:rounded-2xl sm:text-[64px]',
            'focus:border-electric focus:shadow-[0_0_0_4px_rgba(76,141,255,0.15)]',
            disabled && 'opacity-50'
          )}
        />
        <button
          type="button"
          onClick={random}
          disabled={disabled}
          aria-label="Random number"
          className={cn(
            'absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-mute transition-all sm:right-3 sm:top-3 sm:h-10 sm:w-10 sm:rounded-xl',
            'hover:border-border-bright hover:text-text active:scale-95',
            disabled && 'pointer-events-none opacity-50'
          )}
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
