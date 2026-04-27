import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FLIP402 — HTTP 402 Payment Required, now on Solana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#03050c',
          color: '#fff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Volumetric blue glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(76,141,255,0.55), rgba(76,141,255,0.1) 45%, transparent 70%)',
          }}
        />
        {/* Faint dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(168,197,255,0.18) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.55,
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: '#4c8dff',
              boxShadow: '0 0 18px #4c8dff',
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            HTTP 402 — Payment Required
          </div>
        </div>

        {/* Main block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 168,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
            }}
          >
            <span style={{ color: '#fff' }}>FLIP</span>
            <span
              style={{
                background:
                  'linear-gradient(180deg, #e8f0ff 0%, #b8d1ff 40%, #4c8dff 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              402
            </span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 880,
            }}
          >
            Flip the 402. Get paid or get rekt.
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 24,
              color: 'rgba(168,197,255,0.7)',
              fontFamily: 'monospace',
              letterSpacing: 1,
            }}
          >
            One in 402  ·  payout ×380  ·  on Solana
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 20,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'monospace',
            }}
          >
            x402 protocol  ·  Coinbase  ·  Solana Foundation
          </div>
          <div
            style={{
              fontSize: 22,
              fontFamily: 'monospace',
              letterSpacing: 3,
              color: '#a8c5ff',
            }}
          >
            flip402.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
