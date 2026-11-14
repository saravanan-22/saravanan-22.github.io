"use client";

import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL = "08";
const once = { once: true, margin: "-10% 0px" } as const;

/* ------------------------------------------------------------ Section tag
 * Highlighted section marker: a gold pill with the number and name, a shine
 * that sweeps across it, and a rule that draws out to the right.
 */
export function SectionLabel({
  index,
  title,
  className = "mb-12 md:mb-20",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <motion.span
        className="relative flex shrink-0 items-center gap-3 overflow-hidden rounded-full border border-gold/45 bg-gold/[0.07] px-4 py-1.5"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={once}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="font-mono text-[0.72rem] text-gold">{index}</span>
        <span className="h-3 w-px bg-gold/40" />
        <span className="text-[0.74rem] font-medium tracking-[0.16em] text-bone uppercase md:text-[0.8rem]">{title}</span>
        <motion.span
          aria-hidden
          className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-gold/35 to-transparent"
          initial={{ left: "-70%" }}
          whileInView={{ left: "140%" }}
          viewport={once}
          transition={{ duration: 1.3, delay: 0.45, ease: "easeInOut" }}
        />
      </motion.span>
      <motion.span
        className="h-px flex-1 origin-left bg-gradient-to-r from-gold/50 via-bone/15 to-bone/5"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={once}
        transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
      />
      <span className="label hidden shrink-0 md:inline">
        {index} / {TOTAL}
      </span>
    </div>
  );
}

/* ------------------------------------------------------- Animated heading */

export type Part = { text: string; accent?: boolean };
export type HeadingVariant = "cascade" | "blur" | "highlight" | "typewriter" | "assemble" | "fill" | "glitch";

type Props = { parts: Part[]; variant: HeadingVariant; className?: string };

const plain = (parts: Part[]) => parts.map((p) => p.text).join("");

/** Split parts into words (keeping spaces) so lines still wrap naturally. */
function words(parts: Part[]) {
  const out: { word: string; accent?: boolean }[] = [];
  parts.forEach((p) => p.text.split(/(\s+)/).forEach((w) => w && out.push({ word: w, accent: p.accent })));
  return out;
}

/** Words with the index of their first character across the whole heading. */
function indexed(parts: Part[]) {
  const ws = words(parts);
  const starts = ws.map((_, i) => ws.slice(0, i).reduce((n, w) => n + w.word.length, 0));
  return ws.map((w, i) => ({ ...w, start: starts[i] }));
}

/** Deterministic pseudo-random in [-1, 1] (same on server and client). */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

function CharWords({ parts, charVariants, stagger }: { parts: Part[]; charVariants: (i: number) => Variants; stagger: number }) {
  return (
    <motion.span initial="hidden" whileInView="show" viewport={once} transition={{ staggerChildren: stagger }} className="inline">
      {indexed(parts).map((w, wi) =>
        /^\s+$/.test(w.word) ? (
          <span key={wi}> </span>
        ) : (
          <span key={wi} className={`inline-block whitespace-nowrap ${w.accent ? "accent" : ""}`}>
            {w.word.split("").map((ch, k) => {
              const i = w.start + k;
              return (
                <motion.span key={i} className="inline-block" variants={charVariants(i)}>
                  {ch}
                </motion.span>
              );
            })}
          </span>
        )
      )}
    </motion.span>
  );
}

/** About: letters drop in from above and flip down into place. */
function Cascade({ parts }: { parts: Part[] }) {
  return (
    <span className="inline [perspective:800px]">
      <CharWords
        parts={parts}
        stagger={0.035}
        charVariants={() => ({
          hidden: { y: "-0.8em", rotateX: 90, opacity: 0 },
          show: { y: 0, rotateX: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 18 } },
        })}
      />
    </span>
  );
}

/** Projects: scattered letters fly in and assemble. */
function Assemble({ parts }: { parts: Part[] }) {
  return (
    <CharWords
      parts={parts}
      stagger={0.025}
      charVariants={(i) => ({
        // Whole numbers so server and client render identical styles.
        hidden: {
          x: Math.round(rand(i, 1) * 240),
          y: Math.round(rand(i, 2) * 160),
          rotate: Math.round(rand(i, 3) * 120),
          scale: 0.4,
          opacity: 0,
        },
        show: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, transition: { duration: 1.1, ease: EASE } },
      })}
    />
  );
}

/** Stack: each word sharpens out of a blur while its letter-spacing tightens. */
function Blur({ parts }: { parts: Part[] }) {
  return (
    <motion.span initial="hidden" whileInView="show" viewport={once} transition={{ staggerChildren: 0.12 }}>
      {words(parts).map((w, i) =>
        /^\s+$/.test(w.word) ? (
          <span key={i}> </span>
        ) : (
          <motion.span
            key={i}
            className={`inline-block ${w.accent ? "accent" : ""}`}
            variants={{
              hidden: { filter: "blur(18px)", opacity: 0, letterSpacing: "0.25em" },
              show: { filter: "blur(0px)", opacity: 1, letterSpacing: "0em", transition: { duration: 1.2, ease: EASE } },
            }}
          >
            {w.word}
          </motion.span>
        )
      )}
    </motion.span>
  );
}

/** Experience: the line rises in, then a gold highlighter swipes across the accent word. */
function Highlight({ parts }: { parts: Part[] }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={once}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {parts.map((p, i) =>
        p.accent ? (
          <motion.span
            key={i}
            className="accent bg-no-repeat px-[0.06em] [background-image:linear-gradient(transparent_55%,rgb(216_166_87/0.32)_55%,rgb(216_166_87/0.32)_92%,transparent_92%)]"
            initial={{ backgroundSize: "0% 100%" }}
            whileInView={{ backgroundSize: "100% 100%" }}
            viewport={once}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            {p.text}
          </motion.span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </motion.span>
  );
}

/** FinTech: typed out character by character with a blinking caret that follows. */
function Typewriter({ parts }: { parts: Part[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, once);
  const total = plain(parts).length;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setN((v) => (v >= total ? v : v + 1)), 55);
    return () => clearInterval(id);
  }, [inView, total]);

  const ws = indexed(parts);

  return (
    <span ref={ref}>
      {ws.map((w, wi) =>
        /^\s+$/.test(w.word) ? (
          <span key={wi}> </span>
        ) : (
          <span key={wi} className={`inline-block whitespace-nowrap ${w.accent ? "accent" : ""}`}>
            {w.word.split("").map((ch, k) => {
              const i = w.start + k;
              return (
                <span key={i} className="relative">
                  <span className={i < n ? "opacity-100" : "opacity-0"}>{ch}</span>
                  {i === n - 1 && (
                    <span className="absolute top-[0.08em] -right-[0.08em] h-[0.82em] w-[0.06em] animate-pulse bg-gold" />
                  )}
                </span>
              );
            })}
          </span>
        )
      )}
    </span>
  );
}

/** Education: outlined text fills in from left to right. */
function Fill({ parts }: { parts: Part[] }) {
  const content = parts.map((p, i) => (
    <span key={i} className={p.accent ? "accent" : ""}>
      {p.text}
    </span>
  ));
  return (
    <span className="relative inline-block">
      <span className="text-transparent [-webkit-text-stroke:1px_rgb(237_232_224/0.5)] [&_.accent]:text-transparent [&_.accent]:[-webkit-text-stroke:1px_rgb(216_166_87/0.7)]">
        {content}
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-0"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={once}
        transition={{ duration: 1.6, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
      >
        {content}
      </motion.span>
    </span>
  );
}

/** Roadmap: a short RGB-split glitch that snaps into place. */
function Glitch({ parts }: { parts: Part[] }) {
  const content = parts.map((p, i) => (
    <span key={i} className={p.accent ? "accent" : ""}>
      {p.text}
    </span>
  ));
  const t = { duration: 0.9, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "linear" as const };
  return (
    <span className="relative inline-block">
      <motion.span
        className="relative z-10 inline-block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0.2, 1, 0.6, 1], x: [0, -3, 2, -1, 1, 0] }}
        viewport={once}
        transition={t}
      >
        {content}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#d8a657] mix-blend-screen [&_.accent]:text-[#d8a657]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.9, 0.7, 0.9, 0.4, 0], x: [0, 8, -6, 5, -2, 0], clipPath: ["inset(0 0 60% 0)", "inset(30% 0 20% 0)", "inset(60% 0 0 0)", "inset(10% 0 50% 0)", "inset(40% 0 30% 0)", "inset(0 0 0 0)"] }}
        viewport={once}
        transition={t}
      >
        {content}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 text-[#7fb3c9] mix-blend-screen [&_.accent]:text-[#7fb3c9]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.8, 0.9, 0.6, 0.3, 0], x: [0, -8, 6, -4, 2, 0], clipPath: ["inset(50% 0 0 0)", "inset(0 0 60% 0)", "inset(20% 0 40% 0)", "inset(70% 0 0 0)", "inset(0 0 70% 0)", "inset(0 0 0 0)"] }}
        viewport={once}
        transition={t}
      >
        {content}
      </motion.span>
    </span>
  );
}

export function AnimatedHeading({ parts, variant, className = "" }: Props) {
  const body =
    variant === "cascade" ? (
      <Cascade parts={parts} />
    ) : variant === "assemble" ? (
      <Assemble parts={parts} />
    ) : variant === "blur" ? (
      <Blur parts={parts} />
    ) : variant === "highlight" ? (
      <Highlight parts={parts} />
    ) : variant === "typewriter" ? (
      <Typewriter parts={parts} />
    ) : variant === "fill" ? (
      <Fill parts={parts} />
    ) : (
      <Glitch parts={parts} />
    );
  return (
    <h2 className={`display ${className}`}>
      <span className="sr-only">{plain(parts)}</span>
      <span aria-hidden>{body}</span>
    </h2>
  );
}
