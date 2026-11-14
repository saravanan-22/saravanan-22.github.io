"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useInView } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import * as THREE from "three";

/*
 * Liquid-glass hover: the image is drawn by a shader that ripples and bends it
 * around the cursor, with a slight chromatic split at the edge of the ripple.
 * Mouse-only; touch devices just see the plain <Image> underneath.
 */
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;        // canvas size (px)
  uniform vec2 uImg;        // image size (px)
  uniform vec2 uMouse;      // 0..1, origin bottom-left
  uniform vec2 uVel;
  uniform float uHover;     // 0..1
  uniform float uTime;
  varying vec2 vUv;

  // object-fit: cover, anchored to the top (matches object-top)
  vec2 coverUv(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uImg.x / uImg.y;
    vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    vec2 off = rs > ri ? vec2(0.0, 1.0 - scale.y) : vec2((1.0 - scale.x) * 0.5, 0.0);
    return uv * scale + off;
  }

  void main() {
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);
    vec2 d = (vUv - uMouse) * asp;
    float r = length(d);
    float lens = (1.0 - smoothstep(0.0, 0.28, r)) * uHover;

    // ripple rings travelling outward + bulge + drag in the direction of motion
    float ripple = sin(r * 48.0 - uTime * 4.0) * 0.004 * lens;
    vec2 dir = r > 0.0 ? d / r : vec2(0.0);
    vec2 offset = -dir * (lens * lens * 0.035 + ripple) / asp - uVel * lens * 0.05;

    vec2 uv = vUv + offset;
    float split = 0.004 * lens + min(length(uVel), 0.5) * 0.012 * lens;
    vec3 col;
    col.r = texture2D(uTex, coverUv(uv + dir / asp * split)).r;
    col.g = texture2D(uTex, coverUv(uv)).g;
    col.b = texture2D(uTex, coverUv(uv - dir / asp * split)).b;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Plane({ src, target }: { src: string; target: RefObject<HTMLElement | null> }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef<THREE.Mesh>(null);
  const s = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0, hover: 0, inside: false });

  const material = useMemo(() => {
    const map = tex.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.minFilter = THREE.LinearFilter;
    map.needsUpdate = true;
    const img = map.image as { width: number; height: number };
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTex: { value: map },
        uRes: { value: new THREE.Vector2(1, 1) },
        uImg: { value: new THREE.Vector2(img.width, img.height) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVel: { value: new THREE.Vector2() },
        uHover: { value: 0 },
        uTime: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
  }, [tex]);

  // Track the pointer over the target element (the canvas itself ignores events).
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.current.tx = (e.clientX - r.left) / r.width;
      s.current.ty = 1 - (e.clientY - r.top) / r.height;
      s.current.inside = true;
    };
    const leave = () => (s.current.inside = false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [target]);

  useFrame(({ size, clock }, delta) => {
    const m = ref.current?.material as THREE.ShaderMaterial | undefined;
    if (!m) return;
    const r = s.current;
    const dt = Math.min(delta, 0.1);
    const px = r.x;
    const py = r.y;
    r.x = THREE.MathUtils.damp(r.x, r.tx, 10, dt);
    r.y = THREE.MathUtils.damp(r.y, r.ty, 10, dt);
    r.vx = THREE.MathUtils.damp(r.vx, (r.x - px) / Math.max(dt, 1e-3) * 0.05, 6, dt);
    r.vy = THREE.MathUtils.damp(r.vy, (r.y - py) / Math.max(dt, 1e-3) * 0.05, 6, dt);
    r.hover = THREE.MathUtils.damp(r.hover, r.inside ? 1 : 0, 4, dt);
    m.uniforms.uRes.value.set(size.width, size.height);
    m.uniforms.uMouse.value.set(r.x, r.y);
    m.uniforms.uVel.value.set(r.vx, r.vy);
    m.uniforms.uHover.value = r.hover;
    m.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh ref={ref} material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function LiquidImage({
  src,
  target,
}: {
  src: string;
  target: RefObject<HTMLElement | null>;
}) {
  const fine = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { margin: "200px 0px" });
  const [dpr] = useState(() => (typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio, 1.5)));

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0" aria-hidden>
      {fine && inView && (
        <Canvas dpr={dpr} gl={{ antialias: false, alpha: false }} style={{ pointerEvents: "none" }}>
          <Suspense fallback={null}>
            <Plane src={src} target={target} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
