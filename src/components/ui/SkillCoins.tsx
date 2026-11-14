"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Skill coins: tokens drop into a jar with simple circle physics. Grab one to
 * drag and throw it; moving the cursor nudges coins out of the way.
 */

type Coin = { label: string; size: number; gold?: boolean };

const COINS: Coin[] = [
  { label: "Go", size: 1.25 },
  { label: "React", size: 1.15 },
  { label: "TypeScript", size: 1.3 },
  { label: "MySQL", size: 1.05 },
  { label: "Redis", size: 0.95 },
  { label: "AWS", size: 0.95 },
  { label: "Docker", size: 1 },
  { label: "REST APIs", size: 1.05 },
  { label: "Shadcn UI", size: 0.95 },
  { label: "Git", size: 0.8 },
  { label: "Lender APIs", size: 1.2, gold: true },
  { label: "Loan origination", size: 1.15, gold: true },
  { label: "Collections", size: 1, gold: true },
  { label: "OCR", size: 0.95, gold: true },
  { label: "CAM report", size: 1.1, gold: true },
  { label: "GST", size: 0.85, gold: true },
];

const GRAVITY = 2400; // px/s²
const BOUNCE = 0.35;
const FRICTION = 0.985;

export default function SkillCoins() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const ripples = useRef<(HTMLSpanElement | null)[]>([]);
  const sparks = useRef<(HTMLSpanElement | null)[]>([]);
  const fx = useRef({ ripple: 0, spark: 0, cooldown: [] as number[], enabled: false });
  const inView = useInView(box, { amount: 0.3 });
  const reduced = useReducedMotion();
  const started = useRef(false);

  // Physics state lives outside React so the loop never re-renders.
  const sim = useRef({
    x: [] as number[],
    y: [] as number[],
    vx: [] as number[],
    vy: [] as number[],
    r: [] as number[],
    a: [] as number[],
    inside: [] as boolean[],
    drag: -1,
    px: -9999,
    py: -9999,
    lastPx: 0,
    lastPy: 0,
    W: 0,
    H: 0,
  });

  useEffect(() => {
    const el = box.current;
    if (!el || !inView || started.current) return;
    started.current = true;

    const s = sim.current;
    s.W = el.clientWidth;
    s.H = el.clientHeight;
    const unit = Math.max(30, Math.min(s.W / 15, 76));
    COINS.forEach((c, i) => {
      s.r[i] = unit * c.size;
      s.x[i] = s.r[i] + ((i * 0.618 * s.W) % Math.max(1, s.W - 2 * s.r[i]));
      s.y[i] = -s.r[i] * 2 - i * 70; // staggered drop from above
      s.vx[i] = (i % 2 ? 1 : -1) * 60;
      s.vy[i] = 0;
      s.a[i] = 0;
      s.inside[i] = false;
    });
  }, [inView]);

  useEffect(() => {
    const el = box.current;
    if (!el || !inView) return;
    const s = sim.current;
    const n = COINS.length;

    const resize = () => {
      s.W = el.clientWidth;
      s.H = el.clientHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    /** Gold ripple across the floor where a coin lands hard. */
    const ripple = (x: number, w: number, strength: number) => {
      const el = ripples.current[fx.current.ripple++ % ripples.current.length];
      if (!el || !fx.current.enabled) return;
      el.style.left = `${x}px`;
      el.style.width = `${w}px`;
      el.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.2)", opacity: Math.min(0.9, strength) },
          { transform: "translate(-50%, -50%) scale(1.6)", opacity: 0 },
        ],
        { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    };

    /** Small spark where two coins smash together. */
    const spark = (x: number, y: number) => {
      const el = sparks.current[fx.current.spark++ % sparks.current.length];
      if (!el || !fx.current.enabled) return;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.animate(
        [
          { transform: "translate(-50%, -50%) scale(0.2)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1.8)", opacity: 0 },
        ],
        { duration: 500, easing: "ease-out" }
      );
    };

    const step = (dt: number) => {
      const now = performance.now();
      const cd = fx.current.cooldown;
      for (let i = 0; i < n; i++) {
        if (i === s.drag) continue;
        s.vy[i] += GRAVITY * dt;
        s.vx[i] *= FRICTION;
        s.x[i] += s.vx[i] * dt;
        s.y[i] += s.vy[i] * dt;

        // Cursor nudge
        const dx = s.x[i] - s.px;
        const dy = s.y[i] - s.py;
        const d = Math.hypot(dx, dy);
        const reach = s.r[i] + 40;
        if (s.drag === -1 && d < reach && d > 0.01) {
          const push = ((reach - d) / reach) * 9000 * dt;
          s.vx[i] += (dx / d) * push;
          s.vy[i] += (dy / d) * push;
        }

        // Walls, floor, and a ceiling once the coin has dropped in
        const r = s.r[i];
        if (s.y[i] - r > 0) s.inside[i] = true;
        if (s.inside[i] && s.y[i] - r < 0) {
          s.y[i] = r;
          s.vy[i] *= -BOUNCE;
        }
        if (s.y[i] + r > s.H) {
          if (s.vy[i] > 450 && now - (cd[i] ?? 0) > 180) {
            cd[i] = now;
            ripple(s.x[i], r * 2.4, s.vy[i] / 1600);
          }
          s.y[i] = s.H - r;
          s.vy[i] *= -BOUNCE;
          s.vx[i] *= 0.92;
        }
        if (s.x[i] - r < 0) {
          s.x[i] = r;
          s.vx[i] *= -BOUNCE;
        } else if (s.x[i] + r > s.W) {
          s.x[i] = s.W - r;
          s.vx[i] *= -BOUNCE;
        }
      }

      // Coin-coin collisions (a few relaxation passes)
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const dx = s.x[j] - s.x[i];
            const dy = s.y[j] - s.y[i];
            const min = s.r[i] + s.r[j];
            const d2 = dx * dx + dy * dy;
            if (d2 >= min * min || d2 === 0) continue;
            const d = Math.sqrt(d2);
            const nx = dx / d;
            const ny = dy / d;
            const overlap = min - d;
            const mi = i === s.drag ? 0 : s.r[i] ** 2;
            const mj = j === s.drag ? 0 : s.r[j] ** 2;
            const total = mi + mj || 1;
            s.x[i] -= nx * overlap * (mi / total);
            s.y[i] -= ny * overlap * (mi / total);
            s.x[j] += nx * overlap * (mj / total);
            s.y[j] += ny * overlap * (mj / total);
            // Exchange velocity along the normal
            const rel = (s.vx[j] - s.vx[i]) * nx + (s.vy[j] - s.vy[i]) * ny;
            if (rel < -900 && pass === 0 && now - (cd[i] ?? 0) > 150) {
              cd[i] = now;
              spark(s.x[i] + nx * s.r[i], s.y[i] + ny * s.r[i]);
            }
            if (rel < 0) {
              const imp = (-(1 + BOUNCE) * rel) / 2;
              if (i !== s.drag) {
                s.vx[i] -= imp * nx;
                s.vy[i] -= imp * ny;
              }
              if (j !== s.drag) {
                s.vx[j] += imp * nx;
                s.vy[j] += imp * ny;
              }
            }
          }
        }
      }

      // Lean into the direction of travel (labels stay readable)
      for (let i = 0; i < n; i++) {
        const target = Math.max(-0.3, Math.min(0.3, s.vx[i] / 1500));
        s.a[i] += (target - s.a[i]) * Math.min(1, dt * 10);
      }
    };

    const paint = () => {
      for (let i = 0; i < n; i++) {
        const node = els.current[i];
        if (!node) continue;
        const r = s.r[i];
        node.style.width = node.style.height = `${r * 2}px`;
        node.style.transform = `translate3d(${s.x[i] - r}px, ${s.y[i] - r}px, 0) rotate(${s.a[i]}rad)`;
      }
    };

    if (reduced) {
      for (let k = 0; k < 900; k++) step(1 / 120);
      paint();
      return () => ro.disconnect();
    }

    fx.current.enabled = true;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      step(dt / 2);
      step(dt / 2);
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [inView, reduced]);

  const local = (e: React.PointerEvent) => {
    const rect = box.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    const s = sim.current;
    const p = local(e);
    for (let i = COINS.length - 1; i >= 0; i--) {
      if (Math.hypot(p.x - s.x[i], p.y - s.y[i]) < s.r[i]) {
        s.drag = i;
        s.lastPx = p.x;
        s.lastPy = p.y;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        break;
      }
    }
  };

  const onMove = (e: React.PointerEvent) => {
    const s = sim.current;
    const p = local(e);
    s.px = p.x;
    s.py = p.y;
    if (s.drag >= 0) {
      const i = s.drag;
      const cap = (v: number) => Math.max(-3000, Math.min(3000, v));
      s.vx[i] = cap((p.x - s.lastPx) * 60);
      s.vy[i] = cap((p.y - s.lastPy) * 60);
      s.x[i] = Math.max(s.r[i], Math.min(s.W - s.r[i], p.x));
      s.y[i] = Math.max(s.r[i], Math.min(s.H - s.r[i], p.y));
      s.lastPx = p.x;
      s.lastPy = p.y;
    }
  };

  const onUp = () => {
    sim.current.drag = -1;
  };

  return (
    <div className="px-5 md:px-10">
      <div className="mb-5 flex items-end justify-between gap-6">
        <p className="label whitespace-nowrap">The toolkit</p>
        <p className="label whitespace-nowrap">Grab a coin &amp; throw it ↗</p>
      </div>
      <div
        ref={box}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={() => {
          sim.current.px = sim.current.py = -9999;
        }}
        data-cursor="hover"
        className="hairline relative h-[380px] touch-pan-y overflow-hidden rounded-md border bg-ink/30 backdrop-blur-sm select-none md:h-[440px]"
      >
        {/* Background: perspective grid floor, impact effects */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[-25%] bottom-0 h-[70%] [perspective:500px]">
          <div className="coin-floor absolute inset-0 origin-bottom [transform:rotateX(62deg)] [mask-image:linear-gradient(to_top,#000_10%,transparent_85%)]" />
        </div>
        {/* Gold dust drifting up through the empty space */}
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={`d${i}`}
            aria-hidden
            className="coin-dust pointer-events-none absolute bottom-0 rounded-full bg-gold"
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              animationDuration: `${6 + (i % 5) * 1.7}s`,
              animationDelay: `${-((i * 1.3) % 9)}s`,
            }}
          />
        ))}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-2/3 -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={`r${i}`}
            ref={(node) => {
              ripples.current[i] = node;
            }}
            aria-hidden
            className="pointer-events-none absolute h-6 rounded-[50%] border border-gold/70 opacity-0 shadow-[0_0_18px_rgb(216_166_87/0.5)]"
            style={{ top: "100%" }}
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={`s${i}`}
            ref={(node) => {
              sparks.current[i] = node;
            }}
            aria-hidden
            className="pointer-events-none absolute z-10 h-10 w-10 rounded-full opacity-0 [background:radial-gradient(circle,#fff3d6_0%,rgb(216_166_87/0.85)_25%,transparent_65%)]"
          />
        ))}

        <ul className="sr-only">
          {COINS.map((c) => (
            <li key={c.label}>{c.label}</li>
          ))}
        </ul>
        {COINS.map((c, i) => (
          <div
            key={c.label}
            ref={(node) => {
              els.current[i] = node;
            }}
            aria-hidden
            className={`absolute top-0 left-0 grid cursor-grab place-items-center rounded-full text-center active:cursor-grabbing ${
              c.gold
                ? "bg-[radial-gradient(circle_at_35%_30%,#f1d29a,#d8a657_45%,#9c7333)] text-ink shadow-[inset_0_-6px_12px_rgb(0_0_0/0.25),0_10px_25px_-8px_rgb(0_0_0/0.8)]"
                : "border-2 border-gold/70 bg-[radial-gradient(circle_at_35%_30%,#2a251d,#121110_70%)] text-bone shadow-[inset_0_0_0_5px_rgb(216_166_87/0.12),0_10px_25px_-8px_rgb(0_0_0/0.8)]"
            }`}
            style={{ transform: "translate3d(-200px,-200px,0)", width: 0, height: 0 }}
          >
            <span className="pointer-events-none px-2 text-[clamp(0.7rem,1.1vw,1rem)] leading-tight font-medium tracking-tight">
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
