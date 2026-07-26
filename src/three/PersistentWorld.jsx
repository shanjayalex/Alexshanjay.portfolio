import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import { scrollState } from "../lib/scrollProgress";
import { journeyStates } from "../data/journeyKeyframes";
import { useSectionOffsets } from "../hooks/useSectionOffsets";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function resolveTarget(offsets) {
  const p = scrollState.progress;
  let lo = offsets[0];
  let hi = offsets[offsets.length - 1];

  for (let i = 0; i < offsets.length - 1; i++) {
    if (p >= offsets[i].progress && p <= offsets[i + 1].progress) {
      lo = offsets[i];
      hi = offsets[i + 1];
      break;
    }
  }

  const span = hi.progress - lo.progress || 1;
  const local = Math.min(1, Math.max(0, (p - lo.progress) / span));
  const a = journeyStates[lo.id];
  const b = journeyStates[hi.id];

  return {
    position: [
      lerp(a.position[0], b.position[0], local),
      lerp(a.position[1], b.position[1], local),
      lerp(a.position[2], b.position[2], local),
    ],
    scale: lerp(a.scale, b.scale, local),
    emissive: lerp(a.emissive, b.emissive, local),
    light: lerp(a.light, b.light, local),
    sparkle: lerp(a.sparkle, b.sparkle, local),
  };
}

function Centerpiece({ offsets, reduced }) {
  const groupRef = useRef();
  const solidRef = useRef();
  const wireRef = useRef();
  const matRef = useRef();
  const lightARef = useRef();
  const lightBRef = useRef();
  const lightCRef = useRef();
  const rot = useRef(0);

  const smoothed = useRef({ x: 0, y: 0, z: 0, scale: 1, emissive: 0.28, light: 1, sparkle: 0.55 });
  const lastSparkleTick = useRef(0.55);
  const [sparkleOpacity, setSparkleOpacity] = useState(0.55);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!reduced) rot.current += delta * 0.22;
    const tiltX = reduced ? 0 : state.pointer.y * 0.22;
    const tiltY = rot.current + (reduced ? 0 : state.pointer.x * 0.28);

    if (solidRef.current) {
      solidRef.current.rotation.set(tiltX, tiltY, solidRef.current.rotation.z + delta * 0.02);
    }
    if (wireRef.current) {
      wireRef.current.rotation.set(tiltX, tiltY, wireRef.current.rotation.z + delta * 0.05);
    }

    const target = reduced ? journeyStates.top : resolveTarget(offsets);
    const damp = 1 - Math.pow(0.001, delta);

    const s = smoothed.current;
    s.x = lerp(s.x, target.position[0], damp);
    s.y = lerp(s.y, target.position[1], damp);
    s.z = lerp(s.z, target.position[2], damp);
    s.scale = lerp(s.scale, target.scale, damp);
    s.emissive = lerp(s.emissive, target.emissive, damp);
    s.light = lerp(s.light, target.light, damp);
    s.sparkle = lerp(s.sparkle, target.sparkle, damp);

    groupRef.current.position.set(s.x, s.y, s.z);
    groupRef.current.scale.setScalar(s.scale);

    if (matRef.current) matRef.current.emissiveIntensity = s.emissive;
    if (lightARef.current) lightARef.current.intensity = 14 * s.light;
    if (lightBRef.current) lightBRef.current.intensity = 12 * s.light;
    if (lightCRef.current) lightCRef.current.intensity = 12 * s.light;

    const quantized = Math.round(s.sparkle * 20) / 20;
    if (Math.abs(quantized - lastSparkleTick.current) > 0.001) {
      lastSparkleTick.current = quantized;
      setSparkleOpacity(quantized);
    }
  });

  return (
    <>
      <pointLight ref={lightARef} position={[3, 2, 4]} intensity={14} color="#00d9f5" />
      <pointLight ref={lightBRef} position={[-3, -2, 3]} intensity={12} color="#b6f000" />
      <pointLight ref={lightCRef} position={[0, 3, -3]} intensity={12} color="#1b4de4" />

      <group ref={groupRef}>
        <mesh ref={solidRef}>
          <torusKnotGeometry args={[1.1, 0.36, 180, 24]} />
          <meshPhysicalMaterial
            ref={matRef}
            color="#1b4de4"
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.12}
            iridescence={1}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[100, 400]}
            emissive="#00d9f5"
            emissiveIntensity={0.28}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.05}>
          <torusKnotGeometry args={[1.1, 0.36, 90, 16]} />
          <meshBasicMaterial color="#b6f000" wireframe transparent opacity={0.32} />
        </mesh>
      </group>

      <Sparkles
        count={70}
        scale={[7, 6, 5]}
        size={2.2}
        speed={reduced ? 0 : 0.22}
        opacity={sparkleOpacity}
        color="#38e6ff"
      />
    </>
  );
}

export default function PersistentWorld() {
  const reduced = useReducedMotion();
  const offsets = useSectionOffsets();

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        flat
        camera={{ position: [0, 0, 8.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <fog attach="fog" args={["#05081f", 5, 12]} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[2, 4, 5]} intensity={0.35} color="#ffffff" />

        <Centerpiece offsets={offsets} reduced={!!reduced} />

        <EffectComposer>
          <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
