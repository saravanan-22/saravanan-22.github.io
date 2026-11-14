"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { store } from "@/lib/store";

/**
 * Skill orbit: skills ride three tilted 3D rings around a glowing core.
 * Positions are projected in JS each frame (real 3D: perspective, depth
 * sorting, size and brightness by distance). The cursor tilts the system,
 * scrolling spins the rings, and hovering a skill pauses the orbit.
 */

type Ring = { r: number; tilt: number; yaw: number; speed: number; gold?: boolean; items: string[] };

const RINGS: Ring[] = [
  { r: 0.3, tilt: 0.25, yaw: 0.2, speed: 0.24, items: ["Go", "TypeScript", "React"] },
  {
    r: 0.6,
    tilt: -0.3,
    yaw: 0.7,
    speed: -0.15,
    items: ["MySQL", "Redis", "AWS", "Docker", "REST APIs", "Shadcn UI", "Git"],
  },
  {
    r: 0.92,
    tilt: 0.42,
    yaw: -0.45,
    speed: 0.1,
    gold: true,
    items: ["Lender APIs", "Loan origination", "Collections", "OCR", "CAM report", "GST"],
  },
];
const CHIPS = RINGS.flatMap((ring, ri) =>
  ring.items.map((label, i) => ({ label, ri, gold: !!ring.gold, phase: (i / ring.items.length) * Math.PI * 2 }))
);
const TOTAL = CHIPS.length;
const F = 1500; // perspective distance (px)

type V = [number, number, number];
const rotX = ([x, y, z]: V, a: number): V => [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
const rotY = ([x, y, z]: V, a: number): V => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];

export default function SkillOrbit() {
  const stage = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const inView = useInView(stage, { margin: "200px 0px" });
  const hover = useRef(false);

  useEffect(() => {
    const el = stage.current;
    if (!el || !inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let pitch = 1.12;
    let yaw = 0;
    let pace = 1;
    const angles = RINGS.map(() => 0);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const cx = W / 2;
      const cy = H / 2;
      const unit = Math.min(W * 0.46, H * 1.05);

      // cursor tilts the whole system; hovering a chip eases the orbit to a stop
      const mx = store.pointerActive ? store.mouseX : 0;
      const my = store.pointerActive ? store.mouseY : 0;
      pitch += (1.12 - my * 0.32 - pitch) * 0.08;
      yaw += (mx * 0.55 - yaw) * 0.08;
      pace += ((hover.current || reduced ? 0 : 1) - pace) * 0.08;
      const scrollSpin = store.scrollY * 0.0016;
      RINGS.forEach((ring, i) => (angles[i] += dt * ring.speed * pace));

      const project = (ri: number, a: number) => {
        const ring = RINGS[ri];
        const R = ring.r * unit;
        let v: V = [Math.cos(a) * R, 0, Math.sin(a) * R];
        v = rotY(rotX(v, ring.tilt), ring.yaw);
        v = rotX(rotY(v, yaw), pitch);
        const s = F / (F - v[2]);
        return { x: cx + v[0] * s, y: cy - v[1] * s, z: v[2], s };
      };

      // rings
      RINGS.forEach((ring, ri) => {
        const p = paths.current[ri];
        if (!p) return;
        let d = "";
        for (let k = 0; k <= 72; k++) {
          const q = project(ri, (k / 72) * Math.PI * 2);
          d += `${k ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
        }
        p.setAttribute("d", d);
      });
      svg.current?.setAttribute("viewBox", `0 0 ${W} ${H}`);

      // chips
      CHIPS.forEach((c, i) => {
        const node = chips.current[i];
        if (!node) return;
        const dir = Math.sign(RINGS[c.ri].speed);
        const q = project(c.ri, c.phase + angles[c.ri] + scrollSpin * dir);
        const depth = Math.max(-1, Math.min(1, q.z / (unit * 0.92)));
        node.style.transform = `translate3d(${q.x.toFixed(1)}px, ${q.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(q.s * (0.86 + depth * 0.14)).toFixed(3)})`;
        node.style.zIndex = String(500 + Math.round(q.z));
        node.style.opacity = (0.42 + 0.58 * (depth * 0.5 + 0.5)).toFixed(3);
      });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div className="px-5 md:px-10">
      <div className="mb-2 flex items-end justify-between gap-6">
        <p className="label whitespace-nowrap">The toolkit</p>
        <p className="label hidden whitespace-nowrap sm:block">Move to tilt · hover a skill</p>
      </div>

      <div ref={stage} className="relative h-[460px] select-none md:h-[600px]">
        {/* orbit rings */}
        <svg ref={svg} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {RINGS.map((ring, i) => (
            <path
              key={i}
              ref={(n) => {
                paths.current[i] = n;
              }}
              fill="none"
              stroke={ring.gold ? "rgb(216 166 87 / 0.45)" : "rgb(237 232 224 / 0.22)"}
              strokeWidth={1}
              strokeDasharray={ring.gold ? "0" : "3 6"}
            />
          ))}
        </svg>

        {/* glowing core */}
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2">
          <div className="orbit-core grid h-24 w-24 place-items-center rounded-full md:h-28 md:w-28">
            <div className="text-center leading-none text-ink">
              <div className="display text-3xl font-semibold md:text-4xl">{TOTAL}</div>
              <div className="mt-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase">tools</div>
            </div>
          </div>
        </div>

        {/* skills */}
        <ul aria-label="Skills">
          {CHIPS.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                ref={(n) => {
                  chips.current[i] = n;
                }}
                onPointerEnter={() => (hover.current = true)}
                onPointerLeave={() => (hover.current = false)}
                onFocus={() => (hover.current = true)}
                onBlur={() => (hover.current = false)}
                data-cursor="hover"
                className={`absolute top-0 left-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-[box-shadow,background-color,color] duration-300 will-change-transform md:px-5 md:py-2.5 md:text-[0.95rem] ${
                  c.gold
                    ? "border-gold bg-gold text-ink shadow-[0_8px_30px_-8px_rgb(216_166_87/0.6)] hover:bg-[#f1cf8f] hover:shadow-[0_0_40px_rgb(216_166_87/0.85)]"
                    : "border-gold/45 bg-[#100e0b]/85 text-bone hover:border-gold hover:bg-[#1c1812] hover:shadow-[0_0_34px_rgb(216_166_87/0.5)]"
                }`}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
