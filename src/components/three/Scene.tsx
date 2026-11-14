"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { store } from "@/lib/store";

/*
 * Topographic contour map.
 * A slowly drifting fbm height field drawn as anti-aliased iso-lines, with every
 * fifth line heavier (like index contours on a survey map). The cursor acts as a
 * lens and raises a hill, so the lines ring around it; scrolling pans the map.
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
  uniform float uTime;
  uniform vec2 uRes;      // CSS pixels
  uniform vec2 uMouse;    // CSS pixels, origin bottom-left
  uniform float uScroll;  // CSS pixels scrolled
  uniform float uLens;    // 0..1 lens strength
  uniform float uIntro;   // 0..1 reveal
  uniform float uFade;    // dims lines behind long-form content
  uniform sampler2D uTrail; // cursor wake: xy = push direction, z = intensity
  varying vec2 vUv;

  const mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);

  float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return fract(p.x * p.y * (p.x + p.y));
  }

  float noise(vec2 x) {
    vec2 p = floor(x);
    vec2 w = fract(x);
    vec2 u = w * w * w * (w * (w * 6.0 - 15.0) + 10.0);
    float a = hash(p);
    float b = hash(p + vec2(1.0, 0.0));
    float c = hash(p + vec2(0.0, 1.0));
    float d = hash(p + vec2(1.0, 1.0));
    return a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float f = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      f += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return f;
  }

  void main() {
    const float SCALE = 640.0;          // CSS px per noise unit
    vec2 px = vUv * uRes;
    vec2 pan = vec2(0.0, uScroll * 0.35);
    vec2 p = (px + pan) / SCALE;
    vec2 m = (uMouse + pan) / SCALE;

    // cursor wake: lines get pushed along the path the cursor travelled
    vec4 wake = texture2D(uTrail, vUv);
    p -= wake.xy * (uRes / SCALE) * 0.07;

    // cursor lens: magnify around the pointer
    vec2 d = p - m;
    float lens = exp(-dot(d, d) / 0.045) * uLens;
    p -= d * lens * 0.45;

    // two "survey points" wander the map on their own, raising gold rings
    vec2 w1 = (vec2(0.5 + 0.36 * sin(uTime * 0.071), 0.5 + 0.3 * sin(uTime * 0.053 + 1.7)) * uRes + pan) / SCALE;
    vec2 w2 = (vec2(0.5 + 0.38 * sin(uTime * 0.047 + 3.1), 0.5 + 0.32 * cos(uTime * 0.061)) * uRes + pan) / SCALE;
    float g1 = exp(-dot(p - w1, p - w1) / 0.05);
    float g2 = exp(-dot(p - w2, p - w2) / 0.04);
    float wander = max(g1, g2) * uIntro;

    // domain-warped height field, always drifting
    float t = uTime * 0.045;
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
    float h = fbm(p * 0.9 + 1.6 * q + vec2(t * 0.6, 0.0));
    h += lens * 0.22 + (g1 * 0.16 + g2 * 0.13) * uIntro; // hills under cursor + wanderers
    h += wake.z * 0.09; // ripples along the wake

    // sonar pulse: every few seconds a ring sweeps out from a random spot
    const float PERIOD = 6.5;
    float cycle = floor(uTime / PERIOD);
    float phase = fract(uTime / PERIOD);
    vec2 origin = vec2(0.15 + 0.7 * hash(vec2(cycle, 1.3)), 0.2 + 0.6 * hash(vec2(cycle, 7.1))) * uRes;
    float dPulse = length(px - origin) / uRes.y;
    float pulse = exp(-pow((dPulse - phase * 1.8) / 0.045, 2.0)) * (1.0 - phase) * uIntro;

    // iso-lines, slowly flowing uphill
    float levels = 20.0;
    float lv = h * levels - uTime * 0.12;
    float fw = max(fwidth(lv), 1e-4);
    float dist = abs(fract(lv + 0.5) - 0.5);
    bool index = mod(floor(lv + 0.5), 5.0) < 0.5;
    float width = index ? 1.25 : 0.7;
    float line = 1.0 - smoothstep(width * fw - fw * 0.5, width * fw + fw * 0.5, dist);

    // shading
    float alpha = index ? 0.15 : 0.065;
    float glow = max(max(lens, wake.z * 0.9), max(wander * 0.75, pulse));
    alpha += glow * (index ? 0.55 : 0.35);
    vec3 ink = vec3(0.043, 0.039, 0.035);
    vec3 bone = vec3(0.93, 0.91, 0.88);
    vec3 gold = vec3(0.85, 0.65, 0.34);
    vec3 lineCol = mix(bone, gold, clamp(glow * 1.6, 0.0, 1.0));

    // intro: lines draw outward from the centre
    float r = length((vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0));
    float reveal = 1.0 - smoothstep(uIntro * 1.7 - 0.35, uIntro * 1.7, r);

    // vignette keeps edges calm
    float vig = smoothstep(1.25, 0.35, length((vUv - 0.5) * vec2(1.6, 1.9)));

    float a = line * alpha * reveal * mix(0.55, 1.0, vig) * uFade;
    vec3 col = mix(ink, lineCol, a);
    col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0; // dither
    gl_FragColor = vec4(col, 1.0);
  }
`;

/*
 * Cursor wake: a small ping-pong buffer. Each frame the previous state is
 * blurred and faded, then a soft capsule is stamped along the cursor's path
 * carrying its velocity. The map shader reads it to push and light the lines.
 */
const trailVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const trailFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uTexel;
  uniform vec2 uFrom;     // previous cursor uv
  uniform vec2 uTo;       // current cursor uv
  uniform vec2 uVel;      // cursor velocity (uv / frame, scaled)
  uniform float uStrength;
  uniform float uAspect;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uPrev, vUv) * 0.6
      + (texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)) + texture2D(uPrev, vUv - vec2(uTexel.x, 0.0))
       + texture2D(uPrev, vUv + vec2(0.0, uTexel.y)) + texture2D(uPrev, vUv - vec2(0.0, uTexel.y))) * 0.1;
    c *= 0.972;

    vec2 asp = vec2(uAspect, 1.0);
    vec2 pa = (vUv - uFrom) * asp;
    vec2 ba = (uTo - uFrom) * asp;
    float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    float dist = length(pa - ba * t);
    float stamp = exp(-dist * dist / 0.0035) * uStrength;

    c.xy = clamp(c.xy + uVel * stamp, -1.0, 1.0);
    c.z = min(c.z + stamp * 0.85, 1.0);
    gl_FragColor = c;
  }
`;

type Trail = {
  targets: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  from: THREE.Vector2;
};

function createTrail(): Trail {
  const make = () =>
    new THREE.WebGLRenderTarget(320, 180, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
  const material = new THREE.ShaderMaterial({
    vertexShader: trailVertex,
    fragmentShader: trailFragment,
    uniforms: {
      uPrev: { value: null },
      uTexel: { value: new THREE.Vector2(1 / 320, 1 / 180) },
      uFrom: { value: new THREE.Vector2(-1, -1) },
      uTo: { value: new THREE.Vector2(-1, -1) },
      uVel: { value: new THREE.Vector2() },
      uStrength: { value: 0 },
      uAspect: { value: 16 / 9 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  return {
    targets: [make(), make()],
    scene,
    camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    material,
    from: new THREE.Vector2(-1, -1),
  };
}

function ContourMap() {
  const ref = useRef<THREE.Mesh>(null);
  const s = useRef({ mx: -9999, my: -9999, lens: 0, intro: 0, scroll: 0, fade: 1 });
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
          uLens: { value: 0 },
          uIntro: { value: 0 },
          uFade: { value: 1 },
          uTrail: { value: null },
        },
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    []
  );

  const trail = useRef<Trail | null>(null);
  useEffect(
    () => () => {
      trail.current?.targets.forEach((t) => t.dispose());
      trail.current?.material.dispose();
    },
    []
  );

  useFrame(({ clock, size, gl }, delta) => {
    const m = ref.current?.material as THREE.ShaderMaterial | undefined;
    if (!m) return;
    const r = s.current;

    // --- advance the cursor wake ---
    if (!trail.current) trail.current = createTrail();
    const tr = trail.current;
    const to = new THREE.Vector2(store.mouseX * 0.5 + 0.5, store.mouseY * 0.5 + 0.5);
    if (tr.from.x < 0) tr.from.copy(to);
    const vel = to.clone().sub(tr.from);
    const speed = vel.length();
    const active = store.pointerActive && !store.reduced;
    const tu = tr.material.uniforms;
    tu.uPrev.value = tr.targets[0].texture;
    tu.uFrom.value.copy(tr.from);
    tu.uTo.value.copy(to);
    tu.uVel.value.copy(vel.multiplyScalar(18).clampLength(0, 1));
    tu.uStrength.value = active ? Math.min(speed * 55, 1) : 0;
    tu.uAspect.value = size.width / size.height;
    gl.setRenderTarget(tr.targets[1]);
    gl.render(tr.scene, tr.camera);
    gl.setRenderTarget(null);
    tr.targets.reverse();
    tr.from.copy(to);
    m.uniforms.uTrail.value = tr.targets[0].texture;
    const dt = Math.min(delta, 0.1);
    const t = clock.elapsedTime;

    // Pointer in CSS px (bottom-left origin). Touch devices get a slow wandering lens.
    let tx = (store.mouseX * 0.5 + 0.5) * size.width;
    let ty = (store.mouseY * 0.5 + 0.5) * size.height;
    if (!store.pointerActive) {
      tx = size.width * (0.62 + 0.18 * Math.sin(t * 0.21));
      ty = size.height * (0.55 + 0.2 * Math.sin(t * 0.17 + 1.3));
    }
    if (r.mx < -999) {
      r.mx = tx;
      r.my = ty;
    }
    r.mx = THREE.MathUtils.damp(r.mx, tx, 6, dt);
    r.my = THREE.MathUtils.damp(r.my, ty, 6, dt);
    r.lens = THREE.MathUtils.damp(r.lens, store.introDone ? 1 : 0, 2, dt);
    r.intro = THREE.MathUtils.damp(r.intro, store.introDone ? 1 : 0, 1.1, dt);
    r.scroll = THREE.MathUtils.damp(r.scroll, store.scrollY, 8, dt);
    r.fade = THREE.MathUtils.damp(r.fade, store.progress > 0.08 ? 0.6 : 1, 2, dt);

    m.uniforms.uTime.value = store.reduced ? 0 : t;
    m.uniforms.uRes.value.set(size.width, size.height);
    m.uniforms.uMouse.value.set(r.mx, r.my);
    m.uniforms.uScroll.value = r.scroll;
    m.uniforms.uLens.value = r.lens;
    m.uniforms.uIntro.value = store.reduced ? 1 : r.intro;
    m.uniforms.uFade.value = r.fade;
  });

  return (
    <mesh ref={ref} material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function Scene() {
  const [dpr] = useState(() => Math.min(window.devicePixelRatio, 1.5));
  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, alpha: false, stencil: false, depth: false }}
      onCreated={() => {
        store.sceneReady = true;
      }}
    >
      <ContourMap />
    </Canvas>
  );
}
