"use client";

import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const FINE = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** Mouse/trackpad vs touch, read from the browser (assumes mouse while prerendering). */
const useFinePointer = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(FINE).matches, () => true);

/**
 * A plain-English statement with an "x-ray" lens: moving the cursor over it
 * reveals the technical version underneath. On touch screens the lens wanders
 * by itself while the block is visible.
 */
export default function XrayLens() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const finePointer = useFinePointer();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30 });
  const y = useSpring(my, { stiffness: 300, damping: 30 });
  const r = useSpring(0, { stiffness: 220, damping: 24 });
  const clipPath = useMotionTemplate`circle(${r}px at ${x}px ${y}px)`;
  const ringSize = useMotionTemplate`${r}px`;

  // Touch / no-hover: let the lens drift across the text on its own.
  useEffect(() => {
    const el = ref.current;
    if (finePointer || reduced || !inView || !el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    r.set(Math.min(w, h) * 0.32);
    const ax = animate(mx, [w * 0.15, w * 0.8, w * 0.45, w * 0.2], {
      duration: 7,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    const ay = animate(my, [h * 0.3, h * 0.6, h * 0.35, h * 0.7], {
      duration: 5,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    });
    return () => {
      ax.stop();
      ay.stop();
    };
  }, [finePointer, reduced, inView, mx, my, r]);

  const move = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div className="mt-24 md:mt-36">
      <div className="mb-6 flex items-end justify-between gap-6">
        <p className="label">What I do, in one line</p>
        <p className="label whitespace-nowrap">{finePointer ? "Hover to x-ray →" : "Watch the lens"}</p>
      </div>

      <div
        ref={ref}
        data-cursor="hover"
        onPointerEnter={(e) => {
          if (!finePointer) return;
          const rect = e.currentTarget.getBoundingClientRect();
          x.jump(e.clientX - rect.left);
          y.jump(e.clientY - rect.top);
          setHovering(true);
          r.set(150);
        }}
        onPointerMove={finePointer ? move : undefined}
        onPointerLeave={() => {
          if (!finePointer) return;
          setHovering(false);
          r.set(0);
        }}
        className="hairline relative overflow-hidden rounded-md border px-6 py-14 md:px-14 md:py-24"
      >
        {/* What a recruiter reads */}
        <p className="display text-[11vw] md:text-[6.4vw]">
          I build the software <span className="accent">behind</span> every loan.
        </p>

        {/* What the lens reveals */}
        <motion.div
          aria-hidden
          className="absolute inset-0 flex flex-col justify-center gap-4 bg-gold px-6 text-ink md:px-14"
          style={{ clipPath }}
        >
          <p className="font-mono text-[3.4vw] leading-relaxed md:text-[1.7vw]">
            POST /v1/loans → OCR(15+ docs) → CAM.pdf → approval matrix → lender API integration → disburse →
            collections
          </p>
          <p className="font-mono text-[2.6vw] tracking-[0.12em] uppercase opacity-70 md:text-[0.9vw]">
            Go Fiber · React · TypeScript · MySQL · Redis · AWS · lender APIs
          </p>
        </motion.div>

        {/* Lens ring */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 rounded-full border border-ink/40"
          style={{
            x,
            y,
            width: ringSize,
            height: ringSize,
            translateX: "-50%",
            translateY: "-50%",
            scale: 2,
            opacity: hovering || !finePointer ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}
