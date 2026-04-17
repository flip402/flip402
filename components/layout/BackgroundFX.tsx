'use client';

import dynamic from 'next/dynamic';

const MeshGradient = dynamic(
  async () => (await import('@paper-design/shaders-react')).MeshGradient,
  { ssr: false }
);

/**
 * Layered background:
 *   z-0  Paper Shader mesh gradient (slow aurora, cool navy)
 *   z-0  Vignette + dim overlay so content reads
 *   z-0  CSS dot-grid pattern (technical lattice, like AuthKit)
 *   z-0  Top-center volumetric halo
 *   z-3  Film grain
 *
 * All layers are non-interactive. Content sits at z-10 in layout.tsx.
 */
export function BackgroundFX() {
  return (
    <>
      {/* Base void color is already on <body>. */}

      {/* Aurora mesh gradient — the "volumetric blue light" from the references */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.85 }}
      >
        <MeshGradient
          style={{ width: '100%', height: '100%' }}
          colors={['#03050c', '#0a1228', '#1a3fb0', '#4c8dff', '#a8c5ff']}
          distortion={0.85}
          swirl={0.35}
          speed={0.18}
          grainMixer={0.12}
          grainOverlay={0}
        />
      </div>

      {/* Darken + vignette the aurora so content reads */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 90% at 50% 50%, rgba(3,5,12,0.35), rgba(3,5,12,0.85) 80%)',
        }}
      />


      {/* Volumetric halo at top-center */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% -10%, rgba(76,141,255,0.35), transparent 65%)',
        }}
      />

      {/* Cinematic edge vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 45%, rgba(3,5,12,0.85) 100%)',
        }}
      />

      {/* Film grain, on top of everything except foreground */}
      <div className="grain" aria-hidden />
    </>
  );
}
