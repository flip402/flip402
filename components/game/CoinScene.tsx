'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

import { Coin3D } from './Coin3D';
import { useVisibilityPause } from '@/hooks/useVisibilityPause';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { FlipPhase } from '@/hooks/useFlip';

type Props = {
  phase: FlipPhase;
  rolled?: number | null;
  compact?: boolean;
  className?: string;
};

export function CoinScene({ phase, rolled, compact, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const tabVisible = useVisibilityPause();
  const isMobile = useIsMobile(768);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mustAnimate =
    phase === 'awaiting-signature' ||
    phase === 'confirming' ||
    phase === 'revealing';

  const shouldRun = mustAnimate || (inView && tabVisible);

  const caOffset = useMemo(() => new Vector2(0.0012, 0.0012), []);

  // On mobile: lower DPR and softer Bloom to keep 60fps
  const dpr: [number, number] = isMobile ? [1, 1.25] : [1, 2];
  const bloomIntensity = isMobile ? 0.8 : 1.15;

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.55, 3.3], fov: 32 }}
        frameloop={shouldRun ? 'always' : 'demand'}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[-3, 4, 2]} intensity={3.2} color="#4c8dff" />
        <pointLight position={[3, 1, 2]} intensity={1.6} color="#a8c5ff" />
        <pointLight position={[0, -2.5, 2]} intensity={1.1} color="#6ea8ff" />
        <spotLight
          position={[0, 5, 2]}
          angle={0.5}
          penumbra={1}
          intensity={0.6}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <Coin3D phase={phase} rolled={rolled} compact={compact} />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          {isMobile ? (
            <Vignette eskil={false} offset={0.3} darkness={0.55} />
          ) : (
            <>
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={caOffset}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil={false} offset={0.3} darkness={0.6} />
            </>
          )}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
