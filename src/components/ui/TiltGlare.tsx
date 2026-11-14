"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import type { ReactNode } from "react";

/** Card that tilts toward the cursor in 3D with a soft glare sliding across it. */
export default function TiltGlare({
  children,
  className = "",
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgb(255 236 200 / 0.13), transparent 45%)`;

  return (
    <div className="shrink-0 [perspective:1100px]">
      <motion.div
        className={`relative [transform-style:preserve-3d] ${className}`}
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * max * 2);
          rx.set(-(py - 0.5) * max * 2);
          gx.set(px * 100);
          gy.set(py * 100);
          glareOpacity.set(1);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
          glareOpacity.set(0);
        }}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
          style={{ background: glare, opacity: glareOpacity }}
        />
      </motion.div>
    </div>
  );
}
