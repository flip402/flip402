'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-10 sm:px-6">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-text-dim">
            <span className="flex h-10 w-10 overflow-hidden rounded-lg">
              <Image
                src="/flip402-mark.png"
                alt="FLIP402"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-display text-lg font-bold text-text-mute">
              FLIP<span className="text-ice">402</span>
            </span>
            <span className="text-text-dim">© 2026</span>
          </div>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-dim transition-colors duration-200 hover:text-text-mute"
          >
            beat the 402 ↑
          </button>
        </div>

        {/* Row 2 */}
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5 text-text-mute">
            <a
              href="https://twitter.com/flip402"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Twitter"
              className="text-text-mute transition-colors duration-200 hover:text-text"
            >
              <XIcon />
            </a>
            <a
              href="https://github.com/x402-foundation/x402"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="text-text-mute transition-colors duration-200 hover:text-text"
            >
              <GithubIcon />
            </a>
            <a
              href="https://x402.org"
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-sm lowercase tracking-[0.18em] text-text-mute transition-colors duration-200 hover:text-text"
            >
              x402
            </a>
          </div>

          <div className="font-mono text-[11px] tracking-[0.18em] text-text-dim/70">
            HTTP 402 was written into the spec in 1998 · It waited 26 years · It&apos;s ready now
          </div>
        </div>
      </div>
    </footer>
  );
}

function XIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
