"use client";

import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export { SectionLabel } from "./SectionTitle";

/** Fades and lifts content into view once. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** A line of text that slides up from behind a mask. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

/** Paragraph whose words light up as it scrolls through the viewport. */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={i}
          word={w}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        />
      ))}
    </p>
  );
}

/**
 * Stat value that animates when it enters the view: numbers count up
 * ("2+" counts 0 → 2), anything else decodes through scrambled letters.
 */
export function StatValue({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      const target = Number(match[1]);
      const controls = animate(0, target, {
        duration: 1.6,
        ease: EASE,
        onUpdate: (v) => (el.textContent = `${Math.round(v)}${match[2]}`),
      });
      return () => controls.stop();
    }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*";
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const settled = Math.floor(frame / 3);
      el.textContent = value
        .split("")
        .map((c, i) => (i < settled ? c : glyphs[Math.floor(Math.random() * glyphs.length)]))
        .join("");
      if (settled >= value.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
