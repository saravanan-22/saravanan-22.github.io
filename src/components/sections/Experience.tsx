"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { experience, profile } from "@/lib/content";
import { AnimatedHeading, SectionLabel } from "@/components/ui/SectionTitle";

type Card = {
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  highlights?: string[];
  next?: boolean;
};

const cards: Card[] = [
  ...experience,
  {
    period: "Next",
    role: "Your team?",
    company: "The next chapter",
    type: profile.availability,
    description:
      "I’m looking for a FinTech or product team where I can keep shipping lending and finance software end to end. Let’s talk.",
    next: true,
  },
];

function DeckCard({
  card,
  i,
  progress,
  total,
}: {
  card: Card;
  i: number;
  progress: MotionValue<number>;
  total: number;
}) {
  // Cards already in the deck shrink back as newer ones slide over them.
  const targetScale = 1 - (total - i) * 0.05;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const dim = useTransform(progress, [i / total, 1], [0, (total - 1 - i) * 0.25]);

  return (
    <div className="sticky top-0 flex h-svh items-center justify-center px-5 md:px-10">
      <motion.article
        style={{ scale, top: `calc(-4vh + ${i * 28}px)` }}
        className={`hairline relative flex h-[70svh] w-full max-w-6xl origin-top flex-col justify-between overflow-hidden rounded-sm border p-7 md:p-12 ${
          card.next ? "bg-bone/90 text-ink backdrop-blur-xl" : "bg-ink/55 backdrop-blur-xl"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <span className={`label ${card.next ? "!text-ink/60" : ""}`}>{card.period}</span>
          <span className={`label text-right ${card.next ? "!text-ink/60" : ""}`}>{card.type}</span>
        </div>

        <span
          aria-hidden
          className={`display pointer-events-none absolute -right-6 -bottom-10 text-[42vw] text-transparent md:text-[22vw] ${
            card.next
              ? "[-webkit-text-stroke:1px_rgb(11_10_9/0.15)]"
              : "[-webkit-text-stroke:1px_rgb(237_232_224/0.1)]"
          }`}
        >
          {String(i + 1).padStart(2, "0")}
        </span>

        <div className="relative max-w-3xl">
          <h3 className="display text-[min(11vw,9svh)] md:text-[min(6.5vw,10svh)]">{card.role}</h3>
          <p className={`accent mt-3 text-2xl md:text-4xl ${card.next ? "!text-ink" : ""}`}>
            {card.company}
          </p>
          <p
            className={`mt-6 max-w-xl text-lg leading-relaxed md:text-xl ${
              card.next ? "text-ink/70" : "text-bone/60"
            }`}
          >
            {card.description}
          </p>
          {!!card.highlights?.length && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {card.highlights.map((h) => (
                <li
                  key={h}
                  className="hairline rounded-full border px-4 py-1.5 text-sm text-bone/75"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
          {card.next && (
            <a
              href="#contact"
              className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 text-sm font-medium text-bone transition-colors hover:bg-gold hover:text-ink"
            >
              Get in touch →
            </a>
          )}
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink"
          style={{ opacity: dim }}
        />
      </motion.article>
    </div>
  );
}

/** Pinned stacking deck: each role slides up and stacks over the previous one. */
export default function Experience() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <section id="experience" className="relative pt-28 md:pt-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="03" title="Experience" className="" />
      </div>
      <AnimatedHeading
        variant="highlight"
        className="px-5 pt-10 text-[13vw] md:px-10 md:text-[7vw]"
        parts={[{ text: "Where I’ve " }, { text: "worked", accent: true }, { text: "." }]}
      />

      <div ref={container}>
        {cards.map((card, i) => (
          <DeckCard key={card.role} card={card} i={i} progress={scrollYProgress} total={cards.length} />
        ))}
      </div>
    </section>
  );
}
