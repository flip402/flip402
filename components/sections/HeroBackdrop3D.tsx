'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

import { useVisibilityPause } from '@/hooks/useVisibilityPause';

function WireObject() {
  const group = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.x += delta * 0.08;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.z += delta * 0.05;
  });

  return (
    <group ref={group}>
      {/* Glowing icosahedron with wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color="#4c8dff"
          wireframe
          transparent
          opacity={0.28}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial
          color="#a8c5ff"
          wireframe
          transparent
          opacity={0.42}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.25}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial
          color="#6ea8ff"
          wireframe
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Decorative wireframe element behind the hero — the "JumpBot wireframe" feel.
 * Non-interactive. Pauses when tab hidden.
 */
export function HeroBackdrop3D({ className }: { className?: string }) {
  const visible = useVisibilityPause();

  return (
    <div className={className} aria-hidden style={{ pointerEvents: 'none' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        frameloop={visible ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <WireObject />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
