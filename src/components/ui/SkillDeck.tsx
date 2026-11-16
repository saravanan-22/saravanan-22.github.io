"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { strengths } from "@/lib/content";

/**
 * Skill deck: the four strength cards start stacked as a fanned deck in the
 * middle of the section, then deal out to their places once, when the section
 * scrolls into view. Each card then flips over in 3D on hover (or tap / Enter)
 * to show where those skills were used for real.
 */

type Offset = { x: number; y: number };
type Strength = (typeof strengths)[number];

const pad = (n: number) => String(n).padStart(2, "0");

function FlipCard({ s, i }: { s: Strength; i: number }) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${s.title}: ${flipped ? "show skills" : "show where I used them"}`}
      data-cursor="hover"
      onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
      onClick={(e) => {
        // Mouse users flip by hovering; taps and keyboard toggle.
        if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setFlipped((f) => !f);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((f) => !f);
        }
      }}
      className="group h-full cursor-pointer rounded-sm outline-none [perspective:1200px] focus-visible:ring-1 focus-visible:ring-gold"
    >
      <motion.div
        className="relative grid h-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
      >
        {/* Front: the skills */}
        <article className="hairline relative col-start-1 row-start-1 flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-sm border bg-[#0f0e0c] p-6 [backface-visibility:hidden] md:p-7">
          <div className="flex items-start justify-between">
            <span className="label">{pad(i + 1)}</span>
            <span className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.12em] text-bone/35 uppercase">
              <span className="hidden md:inline">hover</span>
              <span className="md:hidden">tap</span> to flip
              <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
            </span>
          </div>

          <span
            aria-hidden
            className="display pointer-events-none absolute -right-3 -bottom-6 text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_rgb(237_232_224/0.08)]"
          >
            {pad(i + 1)}
          </span>

          <div className="relative mt-10">
            <h3 className="display text-3xl md:text-4xl">{s.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {s.items.map((t) => (
                <li key={t} className="rounded-full border border-bone/12 px-2.5 py-1 text-xs text-bone/65">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* Back: where they were used */}
        <article
          aria-hidden={!flipped}
          className="relative col-start-1 row-start-1 flex min-h-[16rem] [transform:rotateY(180deg)] flex-col justify-between overflow-hidden rounded-sm border border-gold/50 bg-[radial-gradient(120%_90%_at_100%_0%,#2a2219,#0f0e0c_60%)] p-6 [backface-visibility:hidden] md:p-7"
        >
          <div className="flex items-start justify-between">
            <span className="label !text-gold">
              {pad(i + 1)} · {s.title}
            </span>
            <span className="font-mono text-[0.6rem] tracking-[0.12em] text-bone/35 uppercase">where I used it</span>
          </div>
          <ul className="mt-6 space-y-4">
            {s.used.map((u) => (
              <li key={u.where}>
                <p className="font-mono text-[0.62rem] tracking-[0.14em] text-gold uppercase">{u.where}</p>
                <p className="mt-1 text-[13.5px] leading-snug text-bone/80">{u.what}</p>
              </li>
            ))}
          </ul>
        </article>
      </motion.div>
    </div>
  );
}

export default function SkillDeck() {
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(box, { once: true, amount: 0.45 });
  const reduced = useReducedMotion();
  const [offsets, setOffsets] = useState<Offset[] | null>(null);

  // Measure how far each card sits from the section's centre, so the deck
  // starts in the middle whatever the column count (4 / 2 / 1).
  useLayoutEffect(() => {
    const c = box.current?.getBoundingClientRect();
    if (!c) return;
    setOffsets(
      cards.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return { x: c.left + c.width / 2 - (r.left + r.width / 2), y: c.top + c.height / 2 - (r.top + r.height / 2) };
      })
    );
  }, []);

  const last = strengths.length - 1;

  return (
    <section aria-label="Core strengths" className="relative px-5 py-20 md:px-10 md:py-28">
      <div className="mb-8 flex items-center justify-between md:mb-10">
        <p className="label">At a glance</p>
        <p className="label">{strengths.length} core strengths</p>
      </div>

      <div ref={box} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {strengths.map((s, i) => {
          const o = offsets?.[i] ?? { x: 0, y: 0 };
          const dealt = reduced || inView;
          return (
            <motion.div
              key={s.title}
              ref={(el) => {
                cards.current[i] = el;
              }}
              style={{ zIndex: strengths.length - i }}
              initial={false}
              animate={
                !offsets && !reduced
                  ? { opacity: 0 }
                  : dealt
                    ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                    : { opacity: 1, x: o.x, y: o.y + i * -4, rotate: (i - last / 2) * 5, scale: 0.92 }
              }
              transition={
                dealt && !reduced
                  ? { type: "spring", stiffness: 90, damping: 16, delay: 0.15 + i * 0.12 }
                  : { duration: 0 }
              }
            >
              <FlipCard s={s} i={i} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
