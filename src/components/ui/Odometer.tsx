"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const START = new Date(2024, 8, 1); // Sep 2024: first day on the lending platform

/** One digit wheel: a 0–9 column that rolls to `digit`. */
function Wheel({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-bottom">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        initial={{ y: "0em" }}
        animate={{ y: `${-digit}em` }}
        transition={{ type: "spring", stiffness: 60, damping: 16, delay }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * "Shipping lending software for N days" — N is counted live in the browser
 * and rolls in on odometer wheels when it scrolls into view.
 */
export default function Odometer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = requestAnimationFrame(() =>
      setDays(Math.floor((Date.now() - START.getTime()) / 86_400_000))
    );
    return () => cancelAnimationFrame(id);
  }, [inView]);

  const digits = String(days).padStart(3, "0").split("").map(Number);

  return (
    <div ref={ref}>
      <p className="label mb-3">Shipping lending software for</p>
      <p className="display flex items-end gap-3 text-6xl tabular-nums md:text-7xl">
        <span className="flex text-gold" aria-label={`${days} days`}>
          {digits.map((d, i) => (
            <Wheel key={i} digit={d} delay={i * 0.12} />
          ))}
        </span>
        <span className="accent pb-1 text-3xl md:text-4xl">days</span>
      </p>
    </div>
  );
}
