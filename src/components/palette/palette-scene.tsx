"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, Vector2, type Texture } from "three";
import { coverScale, paletteImages } from "./reveal";

type SceneProps = { active: boolean; value: number; onReady: () => void; onFailure: () => void };

const vertex = `varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const fragment = `uniform sampler2D originalImage;
uniform sampler2D paletteImage;
uniform float reveal;
uniform vec2 crop;
varying vec2 vUv;
void main() {
  vec2 imageUv = (vUv - 0.5) * crop + 0.5;
  vec4 original = texture2D(originalImage, imageUv);
  vec4 palette = texture2D(paletteImage, imageUv);
  gl_FragColor = mix(original, palette, step(1.0 - reveal, vUv.x));
  #include <colorspace_fragment>
}`;

function configureTextures(textures: Texture | Texture[]) {
  for (const texture of Array.isArray(textures) ? textures : [textures]) texture.colorSpace = SRGBColorSpace;
}

function ImagePlane({ active, value, onReady, onFailure }: SceneProps) {
  const [original, palette] = useTexture([paletteImages.original, paletteImages.palette], configureTextures);
  const { size, gl, invalidate } = useThree();
  const uniforms = useMemo(() => ({
    originalImage: { value: original }, paletteImage: { value: palette },
    reveal: { value: value / 100 }, crop: { value: new Vector2(...coverScale(size.width, size.height)) },
  }), [original, palette, value, size.width, size.height]);
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", lost);
    // Two frames allow the demand render to finish before revealing the canvas.
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(onReady); });
    return () => {
      cancelAnimationFrame(first); cancelAnimationFrame(second);
      canvas.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, onReady, onFailure]);

  return <mesh frustumCulled={false}>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} toneMapped={false} />
  </mesh>;
}

export default function PaletteScene(props: SceneProps) {
  return <Canvas frameloop={props.active ? "demand" : "never"} dpr={[1, 1.5]} flat
    onCreated={({ gl }) => { gl.debug.onShaderError = props.onFailure; }}
    gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}>
    <Suspense fallback={null}><ImagePlane {...props} /></Suspense>
  </Canvas>;
}
