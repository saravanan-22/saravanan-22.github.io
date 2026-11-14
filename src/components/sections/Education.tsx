"use client";

import {
  motion,
  motionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { certifications, education } from "@/lib/content";
import { AnimatedHeading, SectionLabel } from "@/components/ui/SectionTitle";

type Card = { kind: string; when: string; title: string; by: string };

const cards: Card[] = [
  ...education.map((e) => ({ kind: "Education", when: e.period, title: e.title, by: e.place })),
  ...certifications.map((c) => ({ kind: "Certification", when: c.year, title: c.title, by: c.issuer })),
];
const N = cards.length;
// Messy pile: fixed small rotations/offsets so the stack looks hand-dropped.
const PILE = [
  { r: -6, x: -10, y: 6 },
  { r: 4, x: 8, y: -4 },
  { r: -2, x: -4, y: -8 },
  { r: 7, x: 12, y: 8 },
  { r: -8, x: -14, y: 2 },
  { r: 3, x: 4, y: 10 },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function DealtCard({
  card,
  i,
  progress,
  offset,
}: {
  card: Card;
  i: number;
  progress: MotionValue<number>;
  offset: MotionValue<{ dx: number; dy: number }>;
}) {
  // Card 0 sits on top of the pile and is dealt first.
  const start = 0.06 + i * 0.13;
  const t = useTransform(progress, (p) => ease(clamp01((p - start) / 0.2)));
  const pile = PILE[i % PILE.length];

  const x = useTransform(() => (offset.get().dx + pile.x) * (1 - t.get()));
  const y = useTransform(() => {
    const k = t.get();
    return (offset.get().dy + pile.y) * (1 - k) - Math.sin(Math.PI * k) * 70;
  });
  const rotate = useTransform(t, (k) => pile.r * (1 - k) + Math.sin(Math.PI * k) * -6);
  const scale = useTransform(t, (k) => 1 + Math.sin(Math.PI * k) * 0.08);
  const shadow = useTransform(
    t,
    (k) => `0 ${10 + Math.sin(Math.PI * k) * 40}px ${30 + Math.sin(Math.PI * k) * 50}px rgb(0 0 0 / ${0.35 + Math.sin(Math.PI * k) * 0.25})`
  );
  const seal = useTransform(t, [0.85, 1], [0, 1]);
  // Cards still on the pile stack above those already dealt; the moving card is on top.
  const zIndex = useTransform(t, (k) => (k > 0 && k < 1 ? 50 : k >= 1 ? 1 : 10 + N - i));

  return (
    <motion.article
      data-card
      style={{ x, y, rotate, scale, boxShadow: shadow, zIndex }}
      className="hairline relative flex min-h-0 flex-col justify-between rounded-sm border bg-[#141311] p-4 md:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`label ${card.kind === "Education" ? "!text-gold" : ""}`}>{card.kind}</span>
        <span className="label">{card.when}</span>
      </div>
      <div>
        <h3 className="text-[0.95rem] leading-snug font-medium tracking-tight md:text-2xl">{card.title}</h3>
        <p className="accent mt-1 text-base md:mt-2 md:text-xl">{card.by}</p>
      </div>
      <motion.span
        style={{ opacity: seal, scale: seal }}
        className="absolute right-4 bottom-4 hidden h-7 w-7 place-items-center md:grid rounded-full border border-gold/60 text-[0.7rem] text-gold md:right-6 md:bottom-6 md:h-9 md:w-9"
        aria-hidden
      >
        ✦
      </motion.span>
    </motion.article>
  );
}

/** Pinned "deal": a messy pile of certificates is dealt card by card into a grid. */
export default function Education() {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  // Each card's offset from its grid slot to the centre of the grid (where the pile sits).
  const [offsets] = useState(() => cards.map(() => motionValue({ dx: 0, dy: 0 })));

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const measure = () => {
      // The grid is the offsetParent; offsetLeft/Top ignore transforms, so
      // measuring mid-animation is safe.
      const cx = el.clientWidth / 2;
      const cy = el.clientHeight / 2;
      el.querySelectorAll<HTMLElement>("[data-card]").forEach((c, i) => {
        offsets[i].set({
          dx: cx - (c.offsetLeft + c.offsetWidth / 2),
          dy: cy - (c.offsetTop + c.offsetHeight / 2),
        });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [offsets]);

  const counter = useTransform(progress, (p) => {
    const dealt = cards.filter((_, i) => p >= 0.06 + i * 0.13 + 0.2).length;
    return `${String(dealt).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
  });

  return (
    <section id="education" ref={section} className="relative" style={{ height: "360vh" }}>
      <div className="sticky top-0 flex h-svh flex-col px-5 pt-24 pb-8 md:px-10 md:pt-28">
        <SectionLabel index="06" title="Education & certifications" className="" />

        <div className="mt-6 mb-6 flex items-end justify-between gap-6 md:mt-8 md:mb-8">
          <AnimatedHeading
            variant="fill"
            className="text-[12vw] md:text-[5.5vw]"
            parts={[{ text: "Always " }, { text: "learning", accent: true }, { text: "." }]}
          />
          <p className="label mb-2 text-right whitespace-nowrap">
            Collected <motion.span className="tabular-nums !text-bone">{counter}</motion.span>
          </p>
        </div>

        <div ref={grid} className="relative grid flex-1 grid-cols-2 grid-rows-3 gap-3 md:grid-cols-3 md:grid-rows-2 md:gap-5">
          {cards.map((c, i) => (
            <DealtCard key={c.title} card={c} i={i} progress={progress} offset={offsets[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
