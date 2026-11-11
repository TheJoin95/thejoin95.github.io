"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

function Sculpture({ animate }: { animate: boolean }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (animate && mesh.current) mesh.current.rotation.y += Math.min(delta, 0.1) * 0.2;
  });
  return (
    <mesh ref={mesh} rotation={[0.4, 0, 0]}>
      <torusKnotGeometry args={[0.9, 0.25, 128, 24]} />
      <meshStandardMaterial color="#8b8b8b" roughness={0.3} metalness={0.6} />
    </mesh>
  );
}

export default function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]}
      frameloop={reducedMotion ? "demand" : "always"}
      fallback={<p>3D preview is unavailable on this device.</p>}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={4} />
      <Sculpture animate={!reducedMotion} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
