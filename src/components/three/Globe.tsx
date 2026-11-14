"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { store } from "@/lib/store";

/*
 * Interactive 3D Earth.
 *  - Day side lit by the sun, gold city lights on the night side, ocean glint,
 *    a drifting cloud layer, an atmosphere glow and a starfield.
 *  - The cursor tilts and turns the globe and moves the camera (parallax).
 *  - Scrolling flies the camera through a keyframe per section: the globe
 *    spins in the hero, turns to Tiruppur (home) with a pulsing marker, then
 *    gold arcs carry pulses between Tiruppur and other cities.
 * Textures: three.js example planet maps (NASA-derived).
 */

const DEG = Math.PI / 180;
const HOME = { lat: 11.11, lon: 77.34 }; // Tiruppur
const CITIES: [number, number][] = [
  [19.08, 72.88], // Mumbai
  [12.97, 77.59], // Bengaluru
  [13.08, 80.27], // Chennai
  [28.61, 77.21], // Delhi
  [17.39, 78.49], // Hyderabad
  [22.57, 88.36], // Kolkata
  [1.35, 103.82], // Singapore
  [25.2, 55.27], // Dubai
  [51.5, -0.12], // London
  [40.71, -74.0], // New York
  [35.68, 139.69], // Tokyo
  [-33.87, 151.21], // Sydney
];

function latLon(lat: number, lon: number, r = 1) {
  const phi = (lon + 180) * DEG;
  const theta = (90 - lat) * DEG;
  return new THREE.Vector3(
    -Math.cos(phi) * Math.sin(theta) * r,
    Math.cos(theta) * r,
    Math.sin(phi) * Math.sin(theta) * r
  );
}
/** Rotation about Y that brings a longitude to face the camera (+Z). */
function faceLon(lon: number) {
  const p = latLon(0, lon);
  return Math.atan2(-p.x, p.z);
}
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Camera/globe keyframe per section. x is a fraction of the half-width. */
const KEYS = [
  { id: "top", x: 0.5, y: -0.04, s: 1.15, focus: 0, arcs: 0, pin: 0 },
  { id: "about", x: 0.52, y: 0, s: 1.35, focus: 1, arcs: 0, pin: 1 },
  { id: "stack", x: 0.55, y: 0, s: 1.0, focus: 1, arcs: 0.7, pin: 1 },
  { id: "experience", x: 0, y: 0, s: 1.55, focus: 1, arcs: 1, pin: 1 },
  { id: "fintech", x: 0.5, y: 0, s: 1.2, focus: 1, arcs: 1, pin: 1 },
  { id: "work", x: -0.5, y: 0, s: 1.1, focus: 0.5, arcs: 0.8, pin: 1 },
  { id: "education", x: 0.55, y: 0, s: 0.85, focus: 0, arcs: 0.5, pin: 0.6 },
  { id: "roadmap", x: -0.5, y: 0, s: 0.85, focus: 0, arcs: 0.4, pin: 0.6 },
  { id: "contact", x: 0.45, y: -0.02, s: 1.3, focus: 1, arcs: 1, pin: 1 },
];
type Key = (typeof KEYS)[number];

/* --------------------------------- Shaders --------------------------------- */

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const earthFrag = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uSpec;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(vV);
    float ndl = dot(N, uSun);
    float day = smoothstep(-0.15, 0.3, ndl);
    vec3 dayCol = pow(texture2D(uDay, vUv).rgb, vec3(1.15)) * (0.12 + 1.15 * max(ndl, 0.0));
    float L = dot(texture2D(uNight, vUv).rgb, vec3(0.333));
    vec3 nightCol = vec3(1.0, 0.7, 0.32) * pow(L, 1.3) * 2.4 + vec3(0.008, 0.012, 0.025);
    vec3 col = mix(nightCol, dayCol, day);
    // sun glint on the oceans
    float spec = texture2D(uSpec, vUv).r;
    vec3 H = normalize(uSun + V);
    col += vec3(1.0, 0.88, 0.7) * pow(max(dot(N, H), 0.0), 45.0) * spec * 0.35 * day;
    // atmospheric rim
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += mix(vec3(0.9, 0.6, 0.28), vec3(0.4, 0.65, 1.0), day) * fres * 0.55;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const cloudFrag = /* glsl */ `
  uniform sampler2D uClouds;
  uniform vec3 uSun;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 N = normalize(vN);
    float ndl = dot(N, uSun);
    vec4 c = texture2D(uClouds, vUv);
    float a = c.a < 0.99 ? c.a : smoothstep(0.15, 0.9, dot(c.rgb, vec3(0.333)));
    float lit = 0.06 + 0.94 * smoothstep(-0.1, 0.4, ndl);
    gl_FragColor = vec4(vec3(1.0) * lit, a * 0.55 * (0.2 + 0.8 * lit));
  }
`;

const atmoVert = /* glsl */ `
  varying vec3 vNv;
  void main() {
    vNv = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFrag = /* glsl */ `
  varying vec3 vNv;
  void main() {
    float i = pow(clamp(-vNv.z, 0.0, 1.0), 2.2) * 1.5;
    gl_FragColor = vec4(mix(vec3(0.42, 0.64, 1.0), vec3(0.95, 0.7, 0.4), 0.22) * i, 1.0);
  }
`;

const arcVert = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const arcFrag = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform float uAmount;
  varying float vT;
  void main() {
    if (vT > uAmount * 1.15) discard;            // arcs draw in as they appear
    float head = fract(uTime * 0.32 + uOffset);
    float d = vT - head;
    float trail = smoothstep(-0.28, 0.0, d) * step(d, 0.0);
    float spark = exp(-pow(d / 0.012, 2.0));
    float a = (0.14 + trail * 0.8 + spark * 1.6) * min(uAmount * 1.5, 1.0);
    gl_FragColor = vec4(vec3(0.95, 0.68, 0.33) * a, 1.0);
  }
`;

/* ------------------------------- Components -------------------------------- */

function useSectionTops() {
  const tops = useRef<number[]>([]);
  useEffect(() => {
    const measure = () => {
      tops.current = KEYS.map(({ id }) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const id = window.setInterval(measure, 2000);
    return () => {
      ro.disconnect();
      window.clearInterval(id);
    };
  }, []);
  return tops;
}

/** Blend the two keyframes around the current scroll position. */
function sample(tops: number[], scrollY: number, vh: number): Key & { local: number } {
  const target = scrollY + vh * 0.5;
  let i = 0;
  let f = 0;
  for (let k = 0; k < tops.length - 1; k++) {
    const start = tops[k + 1] - vh * 0.35;
    const end = tops[k + 1] + vh * 0.25;
    if (target >= end) i = k + 1;
    else {
      if (target > start) f = (target - start) / (end - start);
      break;
    }
  }
  // progress through the current section, 0 at its top, 1 at the next section's top
  const docEnd = document.documentElement.scrollHeight;
  let si = 0;
  while (si < tops.length - 1 && target >= tops[si + 1]) si++;
  const from = tops[si];
  const to = si < tops.length - 1 ? tops[si + 1] : docEnd;
  const local = Math.min(Math.max((target - from) / Math.max(to - from, 1), 0), 1);
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const e = f * f * (3 - 2 * f);
  const m = (p: number, q: number) => p + (q - p) * e;
  return { id: a.id, x: m(a.x, b.x), y: m(a.y, b.y), s: m(a.s, b.s), focus: m(a.focus, b.focus), arcs: m(a.arcs, b.arcs), pin: m(a.pin, b.pin), local };
}

function Arcs({ amount }: { amount: React.RefObject<number> }) {
  const home = useMemo(() => latLon(HOME.lat, HOME.lon, 1.002), []);
  const arcs = useMemo(
    () =>
      CITIES.map(([lat, lon], i) => {
        const b = latLon(lat, lon, 1.002);
        const lift = 1 + home.distanceTo(b) * 0.42;
        const mid = home.clone().add(b).normalize().multiplyScalar(lift);
        const curve = new THREE.QuadraticBezierCurve3(home, mid, b);
        return {
          geo: new THREE.TubeGeometry(curve, 64, 0.0028, 4, false),
          uniforms: { uTime: { value: 0 }, uOffset: { value: (i * 0.137) % 1 }, uAmount: { value: 0 } },
          dot: b,
        };
      }),
    [home]
  );
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    group.current?.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = store.reduced ? 0 : clock.elapsedTime;
        mat.uniforms.uAmount.value = amount.current ?? 0;
      }
    });
  });
  return (
    <group ref={group}>
      {arcs.map((a, i) => (
        <mesh key={i} geometry={a.geo}>
          <shaderMaterial
            vertexShader={arcVert}
            fragmentShader={arcFrag}
            uniforms={a.uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      {arcs.map((a, i) => (
        <mesh key={`d${i}`} position={a.dot}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#d8a657" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function HomePin({ amount }: { amount: React.RefObject<number> }) {
  const pos = useMemo(() => latLon(HOME.lat, HOME.lon, 1.003), []);
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()),
    [pos]
  );
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const k = amount.current ?? 0;
    g.visible = k > 0.01;
    g.scale.setScalar(Math.max(k, 0.001));
    const t = store.reduced ? 0 : clock.elapsedTime;
    [ring.current, ring2.current].forEach((r, i) => {
      if (!r) return;
      const p = (t * 0.6 + i * 0.5) % 1;
      r.scale.setScalar(1 + p * 3.2);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.9;
    });
  });
  return (
    <group ref={group} position={pos} quaternion={quat}>
      <mesh>
        <circleGeometry args={[0.014, 24]} />
        <meshBasicMaterial color="#ffe2a8" />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.018, 0.022, 40]} />
        <meshBasicMaterial color="#d8a657" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[0.018, 0.022, 40]} />
        <meshBasicMaterial color="#d8a657" transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* light beam rising from home */}
      <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.24, 8, 1, true]} />
        <meshBasicMaterial color="#f3c983" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Stars() {
  const geo = useMemo(() => {
    const n = 2600;
    const pos = new Float32Array(n * 3);
    let seed = 3;
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 30 + r() * 30;
      pos.set([Math.sin(ph) * Math.cos(th) * rad, Math.cos(ph) * rad, Math.sin(ph) * Math.sin(th) * rad], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current && !store.reduced) ref.current.rotation.y += dt * 0.004;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#efe6d6" size={0.11} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function Earth() {
  const [day, night, spec, clouds] = useLoader(THREE.TextureLoader, [
    "/textures/earth_atmos_2048.jpg",
    "/textures/earth_lights_2048.png",
    "/textures/earth_specular_2048.jpg",
    "/textures/earth_clouds_1024.png",
  ]);
  const { gl } = useThree();
  const tops = useSectionTops();

  const sun = useMemo(() => new THREE.Vector3(-1, 0.35, 0.5).normalize(), []);
  const [earthU] = useState(() => ({ uDay: { value: day }, uNight: { value: night }, uSpec: { value: spec }, uSun: { value: sun } }));
  const [cloudU] = useState(() => ({ uClouds: { value: clouds }, uSun: { value: sun } }));

  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const cloudMesh = useRef<THREE.Mesh>(null);
  const arcAmount = useRef(0);
  const pinAmount = useRef(0);
  const s = useRef({ x: 0, y: 0, sc: 1, focus: 0, spinA: 0, rotY: 0, rotX: 0.3, mx: 0, my: 0, last: 0, vel: 0, intro: 0 });

  useEffect(() => {
    [day, night, spec, clouds].forEach((t) => {
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    });
    store.sceneReady = true;
  }, [day, night, spec, clouds, gl]);

  useFrame(({ size, viewport, camera }, delta) => {
    const r = root.current;
    const tl = tilt.current;
    const sp = spin.current;
    if (!r || !tl || !sp) return;
    const st = s.current;
    const dt = Math.min(delta, 0.1);
    const damp = THREE.MathUtils.damp;
    const k = sample(tops.current, store.scrollY, size.height);

    // scroll speed adds spin
    const dy = store.scrollY - st.last;
    st.last = store.scrollY;
    st.vel = damp(st.vel, THREE.MathUtils.clamp(dy * 0.004, -0.6, 0.6), 4, dt);

    // cursor (smoothed)
    st.mx = damp(st.mx, store.pointerActive ? store.mouseX : 0, 5, dt);
    st.my = damp(st.my, store.pointerActive ? store.mouseY : 0, 5, dt);

    // placement
    const wide = size.width / size.height > 1.1;
    const halfW = viewport.getCurrentViewport(camera, new THREE.Vector3()).width / 2;
    const tx = (wide ? k.x * halfW : 0) + st.mx * 0.35;
    const ts = (wide ? k.s : k.s * 0.62) * (0.92 + 0.08 * Math.min(halfW / 3.2, 1.2));
    st.x = damp(st.x, tx, 2.2, dt);
    st.y = damp(st.y, k.y * 2 + (k.local - 0.5) * 1.1 + st.my * 0.2, 4, dt);
    st.sc = damp(st.sc, ts, 2.2, dt);
    st.intro = damp(st.intro, store.introDone ? 1 : 0, 1.4, dt);
    r.position.set(st.x, st.y, 0);
    r.scale.setScalar(st.sc * (0.6 + 0.4 * st.intro));

    // rotation: free spin ↔ facing home (shortest path)
    if (!store.reduced) st.spinA += dt * (0.07 + st.vel * 2);
    st.focus = damp(st.focus, k.focus, 2, dt);
    const homeA = faceLon(HOME.lon);
    const scrollTwist = (k.local - 0.5) * 1.4; // ±40° across each section
    const targetY = st.spinA + wrap(homeA - st.spinA) * st.focus + scrollTwist + st.mx * 0.9;
    st.rotY = damp(st.rotY, targetY, 4.5, dt);
    const targetX = THREE.MathUtils.lerp(0.32, HOME.lat * DEG + 0.08, st.focus) - st.my * 0.5 + (k.local - 0.5) * 0.25;
    st.rotX = damp(st.rotX, targetX, 4.5, dt);
    sp.rotation.y = st.rotY;
    tl.rotation.x = st.rotX;
    tl.rotation.z = -0.12 + st.mx * 0.05;

    if (cloudMesh.current && !store.reduced) cloudMesh.current.rotation.y += dt * 0.012;

    arcAmount.current = damp(arcAmount.current, k.arcs, 1.6, dt);
    pinAmount.current = damp(pinAmount.current, k.pin, 2.5, dt);

    // camera parallax
    camera.position.x = damp(camera.position.x, st.mx * 0.5, 4, dt);
    camera.position.y = damp(camera.position.y, st.my * 0.3, 4, dt);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={root}>
      <group ref={tilt}>
        <group ref={spin}>
          <mesh>
            <sphereGeometry args={[1, 128, 128]} />
            <shaderMaterial vertexShader={earthVert} fragmentShader={earthFrag} uniforms={earthU} />
          </mesh>
          <mesh ref={cloudMesh} scale={1.012}>
            <sphereGeometry args={[1, 96, 96]} />
            <shaderMaterial vertexShader={earthVert} fragmentShader={cloudFrag} uniforms={cloudU} transparent depthWrite={false} />
          </mesh>
          <HomePin amount={pinAmount} />
          <Arcs amount={arcAmount} />
        </group>
      </group>
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Globe() {
  const [dpr] = useState(() => Math.min(window.devicePixelRatio, 1.75));
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#000000")}
    >
      <Suspense fallback={null}>
        <Stars />
        <Earth />
      </Suspense>
    </Canvas>
  );
}
