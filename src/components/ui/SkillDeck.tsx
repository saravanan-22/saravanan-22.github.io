"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { strengths } from "@/lib/content";

/**
 * Skill deck: the four strength cards start stacked as a fanned deck in the
 * middle of the section, then deal out to their places once, when the section
 * scrolls into view. After that they stay still and only lift on hover.
 */

type Offset = { x: number; y: number };

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
              className="relative"
            >
              <article
                data-cursor="hover"
                className="hairline group relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden rounded-sm border bg-[#0f0e0c] p-6 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_30px_60px_-30px_rgb(216_166_87/0.35)] md:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold" />
                </div>

                <span
                  aria-hidden
                  className="display pointer-events-none absolute -right-3 -bottom-6 text-[9rem] leading-none text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_rgb(237_232_224/0.08)] group-hover:[-webkit-text-stroke:1px_rgb(216_166_87/0.35)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative mt-10">
                  <h3 className="display text-3xl md:text-4xl">{s.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {s.items.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-bone/12 px-2.5 py-1 text-xs text-bone/65 transition-colors duration-300 group-hover:border-gold/30 group-hover:text-bone"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
