'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

import type { FlipPhase } from '@/hooks/useFlip';

type Props = {
  phase: FlipPhase;
  rolled?: number | null;
  compact?: boolean;
};

const IDLE_SPEED = 0.32;
const FLIP_SPEED = 22;
const HOVER_BOOST = 1.5;

function buildFaceTexture({
  accent,
  bg,
  sub,
  showBigNumber = true,
}: {
  accent: string;
  bg: string;
  sub: string;
  showBigNumber?: boolean;
}): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#0f1a38');
  grad.addColorStop(1, bg);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  // outer ice ring
  ctx.strokeStyle = accent;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 18, 0, Math.PI * 2);
  ctx.stroke();

  // inner hairline ring
  ctx.strokeStyle = 'rgba(168,197,255,0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 44, 0, Math.PI * 2);
  ctx.stroke();

  // sub label (top)
  ctx.fillStyle = 'rgba(168,197,255,0.7)';
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(sub, size / 2, size / 2 - 132);

  if (showBigNumber) {
    // main number — icy white with subtle shadow
    ctx.shadowColor = 'rgba(76,141,255,0.55)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#e8f0ff';
    ctx.font = 'bold 230px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('402', size / 2, size / 2 + 20);
    ctx.shadowBlur = 0;
  } else {
    // solana mark
    ctx.fillStyle = '#a8c5ff';
    ctx.font = 'bold 180px "Space Grotesk", system-ui, sans-serif';
    ctx.fillText('◎', size / 2, size / 2 + 14);
  }

  // bottom decoration
  ctx.fillStyle = accent;
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText('· 1 IN 402 ·', size / 2, size / 2 + 140);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildEdgeTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1a2a55');
  grad.addColorStop(0.4, '#4c8dff');
  grad.addColorStop(0.6, '#6ea8ff');
  grad.addColorStop(1, '#0b1226');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // reeding ticks (chromed metal)
  ctx.strokeStyle = 'rgba(232,240,255,0.45)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 4);
    ctx.lineTo(x, h - 4);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function Coin3D({ phase, rolled, compact }: Props) {
  const group = useRef<THREE.Group>(null!);
  const velocity = useRef(IDLE_SPEED);
  const tumble = useRef(0);

  const faceFront = useMemo(
    () => buildFaceTexture({ accent: '#a8c5ff', bg: '#05070f', sub: 'X402' }),
    []
  );
  const faceBack = useMemo(
    () =>
      buildFaceTexture({
        accent: '#4c8dff',
        bg: '#060c1f',
        sub: '◎ SOLANA',
        showBigNumber: false,
      }),
    []
  );
  const edge = useMemo(() => buildEdgeTexture(), []);

  const materials = useMemo(() => {
    // CylinderGeometry: [side, top, bottom]
    const sideMat = new THREE.MeshStandardMaterial({
      map: edge,
      metalness: 0.95,
      roughness: 0.15,
      color: '#b9cdff',
    });
    const topMat = new THREE.MeshStandardMaterial({
      map: faceFront,
      metalness: 0.6,
      roughness: 0.25,
      emissive: '#4c8dff',
      emissiveIntensity: 0.18,
    });
    const bottomMat = new THREE.MeshStandardMaterial({
      map: faceBack,
      metalness: 0.6,
      roughness: 0.25,
      emissive: '#4c8dff',
      emissiveIntensity: 0.18,
    });
    return [sideMat, topMat, bottomMat];
  }, [faceFront, faceBack, edge]);

  useEffect(() => {
    return () => {
      faceFront.dispose();
      faceBack.dispose();
      edge.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [faceFront, faceBack, edge, materials]);

  useEffect(() => {
    if (phase === 'awaiting-signature' || phase === 'confirming' || phase === 'revealing') {
      velocity.current = FLIP_SPEED;
    } else {
      velocity.current = IDLE_SPEED;
    }
  }, [phase]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += velocity.current * delta;
    if (phase === 'awaiting-signature' || phase === 'confirming' || phase === 'revealing') {
      tumble.current += delta * 14;
      group.current.rotation.x = tumble.current;
    } else {
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        0,
        4,
        delta
      );
      tumble.current = 0;
    }
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
  });

  const scale = compact ? 0.85 : 1;

  return (
    <group ref={group} scale={scale}>
      <mesh castShadow receiveShadow material={materials}>
        <cylinderGeometry args={[1, 1, 0.14, 96, 1]} />
      </mesh>

      {/* Subtle ice-blue rim — no more pedestal-lamp look */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.008, 0.008, 16, 128]} />
        <meshStandardMaterial
          color="#6ea8ff"
          emissive="#4c8dff"
          emissiveIntensity={0.45}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {typeof rolled === 'number' && phase === 'done' ? (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <ringGeometry args={[1.08, 1.12, 96]} />
          <meshBasicMaterial color="#ff6b7a" transparent opacity={0.6} />
        </mesh>
      ) : null}
    </group>
  );
}
