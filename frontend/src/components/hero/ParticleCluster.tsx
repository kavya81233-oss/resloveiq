'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// 5 Incident cluster nodes in 3D space
const CLUSTERS = [
  { id: 1, pos: new THREE.Vector3(-3.2, 1.8, 0), label: '14 complaints, 1 incident', color: '#38BDF8' },
  { id: 2, pos: new THREE.Vector3(3.4, 2.0, -1), label: '28 complaints, 1 incident', color: '#A78BFA' },
  { id: 3, pos: new THREE.Vector3(0.0, -0.2, 0.5), label: '19 complaints, 1 incident', color: '#34D399' },
  { id: 4, pos: new THREE.Vector3(-2.8, -2.2, -0.5), label: '9 complaints, 1 incident', color: '#FBBF24' },
  { id: 5, pos: new THREE.Vector3(3.0, -1.8, 0.2), label: '12 complaints, 1 incident', color: '#F87171' },
];

function Particles({ count = 400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Initial random positions and targets
  const { positions, targets, colors, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    const targ = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter in a sphere radius 8
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 8;
      const sinPhi = Math.sin(phi);

      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = orig[i * 3] = x;
      pos[i * 3 + 1] = orig[i * 3 + 1] = y;
      pos[i * 3 + 2] = orig[i * 3 + 2] = z;

      // Assign to one of 5 clusters
      const cluster = CLUSTERS[i % CLUSTERS.length];
      const targetSpread = 0.55;
      targ[i * 3] = cluster.pos.x + (Math.random() - 0.5) * targetSpread;
      targ[i * 3 + 1] = cluster.pos.y + (Math.random() - 0.5) * targetSpread;
      targ[i * 3 + 2] = cluster.pos.z + (Math.random() - 0.5) * targetSpread;

      const c = new THREE.Color(cluster.color);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, targets: targ, colors: col, originalPositions: orig };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const array = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();
    // Over 6 seconds, progress from 0 (scattered) to 1 (clustered)
    const progress = Math.min(time / 6.0, 1.0);
    const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Drift towards target cluster
      const targetX = targets[idx];
      const targetY = targets[idx + 1];
      const targetZ = targets[idx + 2];

      const origX = originalPositions[idx];
      const origY = originalPositions[idx + 1];
      const origZ = originalPositions[idx + 2];

      // Subtle float motion
      const floatX = Math.sin(time + i) * 0.05;
      const floatY = Math.cos(time + i * 1.5) * 0.05;

      array[idx] = THREE.MathUtils.lerp(origX, targetX, ease) + floatX;
      array[idx + 1] = THREE.MathUtils.lerp(origY, targetY, ease) + floatY;
      array[idx + 2] = THREE.MathUtils.lerp(origZ, targetZ, ease);
    }

    posAttr.needsUpdate = true;

    // Gentle camera parallax based on mouse
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.8, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.88} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ClusterLabels() {
  return (
    <group>
      {CLUSTERS.map((c) => (
        <group key={c.id} position={[c.pos.x, c.pos.y, c.pos.z]}>
          <Html center distanceFactor={10} position={[0, -0.6, 0]}>
            <div className="pointer-events-none select-none px-3 py-1 rounded-full bg-surface/90 border border-border/80 backdrop-blur-md shadow-lg shadow-black/40 whitespace-nowrap text-center animate-fade-in">
              <span className="text-[11px] font-mono font-medium text-text">{c.label}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function ParticleCluster() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={400} />
        <ClusterLabels />
      </Canvas>
    </div>
  );
}

