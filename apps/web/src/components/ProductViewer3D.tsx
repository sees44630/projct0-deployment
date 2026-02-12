'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Rarity-based colors
const RARITY_3D_COLORS: Record<string, { main: string; glow: string; emissive: string }> = {
  COMMON: { main: '#9ca3af', glow: '#6b7280', emissive: '#4b5563' },
  UNCOMMON: { main: '#4ade80', glow: '#22c55e', emissive: '#16a34a' },
  RARE: { main: '#60a5fa', glow: '#3b82f6', emissive: '#2563eb' },
  EPIC: { main: '#a78bfa', glow: '#8b5cf6', emissive: '#7c3aed' },
  LEGENDARY: { main: '#fbbf24', glow: '#f59e0b', emissive: '#d97706' },
};

// Floating crystal/gem shape representing the product's rarity
function RarityGem({ rarityTier = 'RARE' }: { rarityTier: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors = RARITY_3D_COLORS[rarityTier] || RARITY_3D_COLORS.RARE;

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[1.2, 0]} />
        <MeshDistortMaterial
          color={colors.main}
          emissive={colors.emissive}
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.8}
          distort={0.15}
          speed={3}
        />
      </mesh>
    </Float>
  );
}

// Pre-generate particle data to avoid Math.random() in render
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    angle: (i / count) * Math.PI * 2,
    radius: 2.2 + Math.random() * 0.3,
    y: (Math.random() - 0.5) * 0.6,
    size: 0.03 + Math.random() * 0.02,
  }));
}

// Orbiting particles around the gem
function ParticleRing({ count = 40, rarityTier = 'RARE' }: { count?: number; rarityTier: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const colors = RARITY_3D_COLORS[rarityTier] || RARITY_3D_COLORS.RARE;
  const particles = useMemo(() => generateParticles(count), [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={[Math.cos(p.angle) * p.radius, p.y, Math.sin(p.angle) * p.radius]}
        >
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={colors.glow}
            emissive={colors.main}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Pulsing energy ring
function EnergyRing({ rarityTier = 'RARE' }: { rarityTier: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const colors = RARITY_3D_COLORS[rarityTier] || RARITY_3D_COLORS.RARE;

  useFrame((state) => {
    if (!ringRef.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    ringRef.current.scale.set(scale, scale, scale);
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={colors.main}
        emissive={colors.glow}
        emissiveIntensity={3}
        toneMapped={false}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Main Product Viewer Component
interface ProductViewerProps {
  rarityTier?: string;
  className?: string;
}

export default function ProductViewer3D({ rarityTier = 'RARE', className = '' }: ProductViewerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{ aspectRatio: '1/1' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Canvas glow border */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 60px ${RARITY_3D_COLORS[rarityTier]?.glow || '#3b82f6'}22`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
          <pointLight
            position={[-3, -3, 2]}
            intensity={0.8}
            color={RARITY_3D_COLORS[rarityTier]?.main || '#60a5fa'}
          />
          <spotLight
            position={[0, 5, 0]}
            intensity={0.5}
            angle={0.3}
            penumbra={1}
            color={RARITY_3D_COLORS[rarityTier]?.glow || '#3b82f6'}
          />

          {/* Main 3D Elements */}
          <RarityGem rarityTier={rarityTier} />
          <ParticleRing rarityTier={rarityTier} />
          <EnergyRing rarityTier={rarityTier} />

          {/* Environment */}
          <Environment preset="night" />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>

      {/* HUD overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <span className="font-stats text-[9px] tracking-[0.2em] text-text-muted/50">
          3D PREVIEW
        </span>
        <span className="font-stats text-[9px] tracking-[0.2em] text-text-muted/50">
          DRAG TO ROTATE
        </span>
      </div>
    </div>
  );
}
